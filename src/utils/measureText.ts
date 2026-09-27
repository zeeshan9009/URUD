import type { TextSettings } from "../types/editor";

export interface TextDimensions {
  width: number;
  height: number;
  lines: string[];
  lineHeightPx: number;
  maxLineWidth: number;
  totalTextHeight: number;
  extraMarginTop: number;
  extraMarginBottom: number;
  extraMarginLeft: number;
  extraMarginRight: number;
}

export function measureTextLayout(
  settings: TextSettings,
  fontFamily: string,
  scaleMultiplier: number = 1
): TextDimensions {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("Could not get 2D canvas rendering context");
  }

  const effectiveFontSize = settings.fontSize * scaleMultiplier;
  const lineHeightPx = effectiveFontSize * settings.lineHeight;

  // Set font for measurement
  const weightStr = settings.fontWeight || "normal";
  ctx.font = `${weightStr} ${effectiveFontSize}px "${fontFamily}", system-ui, sans-serif`;
  ctx.direction = "rtl";

  // Split lines
  const rawLines = settings.text.split("\n");
  const lines = rawLines.length > 0 ? rawLines : [" "];

  let maxLineWidth = 0;

  for (const line of lines) {
    let lineWidth = ctx.measureText(line || " ").width;

    // Adjust for letter spacing if positive
    if (settings.letterSpacing !== 0 && line.length > 1) {
      lineWidth += (line.length - 1) * (settings.letterSpacing * scaleMultiplier);
    }

    if (lineWidth > maxLineWidth) {
      maxLineWidth = lineWidth;
    }
  }

  // Safety margins for Nastaliq glyph descenders/ascenders, dots, stroke outline and shadows
  const strokeMargin = settings.outlineEnabled ? settings.outlineWidth * scaleMultiplier : 0;

  let shadowOffsetX = 0;
  let shadowOffsetY = 0;
  let shadowBlur = 0;

  if (settings.shadowEnabled) {
    shadowOffsetX = Math.abs(settings.shadowOffsetX * scaleMultiplier);
    shadowOffsetY = Math.abs(settings.shadowOffsetY * scaleMultiplier);
    shadowBlur = settings.shadowBlur * scaleMultiplier;
  }

  const shadowMarginX = shadowOffsetX + shadowBlur;
  const shadowMarginY = shadowOffsetY + shadowBlur;

  // Nastaliq fonts (like Noto Nastaliq Urdu / Gulzar) have tall ascenders and deep descenders
  const nastaliqSafetyMargin = effectiveFontSize * 0.4;

  // 3D extrusion depth margin calculation
  let extrudeMarginX = 0;
  let extrudeMarginY = 0;
  if (settings.text3dEnabled && settings.text3dDepth > 0) {
    const angleRad = ((settings.text3dAngle || 45) * Math.PI) / 180;
    extrudeMarginX = Math.abs(settings.text3dDepth * Math.cos(angleRad) * scaleMultiplier);
    extrudeMarginY = Math.abs(settings.text3dDepth * Math.sin(angleRad) * scaleMultiplier);
  }

  const extraMarginLeft = strokeMargin + shadowMarginX + nastaliqSafetyMargin + extrudeMarginX;
  const extraMarginRight = strokeMargin + shadowMarginX + nastaliqSafetyMargin + extrudeMarginX;
  const extraMarginTop = strokeMargin + shadowMarginY + nastaliqSafetyMargin + extrudeMarginY;
  const extraMarginBottom = strokeMargin + shadowMarginY + nastaliqSafetyMargin + extrudeMarginY;

  const totalTextHeight = lines.length * lineHeightPx;
  const paddingPx = settings.padding * scaleMultiplier;

  const width = Math.ceil(maxLineWidth + extraMarginLeft + extraMarginRight + paddingPx * 2);
  const height = Math.ceil(totalTextHeight + extraMarginTop + extraMarginBottom + paddingPx * 2);

  return {
    width: Math.max(width, 100 * scaleMultiplier),
    height: Math.max(height, 60 * scaleMultiplier),
    lines,
    lineHeightPx,
    maxLineWidth,
    totalTextHeight,
    extraMarginTop,
    extraMarginBottom,
    extraMarginLeft,
    extraMarginRight
  };
}
