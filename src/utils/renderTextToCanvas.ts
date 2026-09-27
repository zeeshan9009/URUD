import type { TextSettings } from "../types/editor";
import { measureTextLayout } from "./measureText";

function adjustColorBrightness(hexColor: string, factor: number): string {
  let c = hexColor.replace("#", "");
  if (c.length === 3) c = c.split("").map((x) => x + x).join("");
  const num = parseInt(c, 16);
  if (isNaN(num)) return hexColor;
  let r = Math.max(0, Math.min(255, Math.floor(((num >> 16) & 255) * factor)));
  let g = Math.max(0, Math.min(255, Math.floor(((num >> 8) & 255) * factor)));
  let b = Math.max(0, Math.min(255, Math.floor((num & 255) * factor)));
  return `rgb(${r}, ${g}, ${b})`;
}

function createGoldenGradient(
  ctx: CanvasRenderingContext2D,
  preset: string,
  x1: number,
  y1: number,
  x2: number,
  y2: number
): CanvasGradient {
  const grad = ctx.createLinearGradient(x1, y1, x2, y2);
  switch (preset) {
    case "shiny":
      grad.addColorStop(0, "#FFE57F");
      grad.addColorStop(0.25, "#FFD700");
      grad.addColorStop(0.5, "#FFF8DC");
      grad.addColorStop(0.75, "#DAA520");
      grad.addColorStop(1, "#B8860B");
      break;
    case "rose":
      grad.addColorStop(0, "#F5D6CE");
      grad.addColorStop(0.3, "#E8B4B8");
      grad.addColorStop(0.6, "#D4AF37");
      grad.addColorStop(1, "#A35C67");
      break;
    case "antique":
      grad.addColorStop(0, "#E2C974");
      grad.addColorStop(0.4, "#C5A059");
      grad.addColorStop(0.7, "#9A7B38");
      grad.addColorStop(1, "#634B19");
      break;
    case "royal":
      grad.addColorStop(0, "#FFF2A3");
      grad.addColorStop(0.3, "#FFD700");
      grad.addColorStop(0.6, "#FF8C00");
      grad.addColorStop(1, "#8B5A2B");
      break;
    case "classic":
    default:
      grad.addColorStop(0, "#BF953F");
      grad.addColorStop(0.25, "#FCF6BA");
      grad.addColorStop(0.5, "#B38728");
      grad.addColorStop(0.75, "#FBF5B7");
      grad.addColorStop(1, "#AA771C");
      break;
  }
  return grad;
}

export function renderTextToCanvas(
  settings: TextSettings,
  fontFamily: string,
  scaleMultiplier: number = 1
): HTMLCanvasElement {
  const layout = measureTextLayout(settings, fontFamily, scaleMultiplier);

  const canvas = document.createElement("canvas");
  canvas.width = layout.width;
  canvas.height = layout.height;

  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("Canvas 2D context not available");
  }

  // Clear canvas first
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Apply Canvas Background Fill (Transparent vs Solid vs Gradient)
  if (settings.backgroundType === "solid") {
    ctx.fillStyle = settings.backgroundColor || "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  } else if (settings.backgroundType === "gradient") {
    const bgAngleRad = ((settings.bgGradientAngle || 90) - 90) * (Math.PI / 180);
    const bgCx = canvas.width / 2;
    const bgCy = canvas.height / 2;
    const bgR = Math.hypot(canvas.width, canvas.height) / 2 || 100;

    const bgX1 = bgCx - bgR * Math.cos(bgAngleRad);
    const bgY1 = bgCy - bgR * Math.sin(bgAngleRad);
    const bgX2 = bgCx + bgR * Math.cos(bgAngleRad);
    const bgY2 = bgCy + bgR * Math.sin(bgAngleRad);

    const bgGrad = ctx.createLinearGradient(bgX1, bgY1, bgX2, bgY2);
    bgGrad.addColorStop(0, settings.bgGradient1 || "#0f172a");
    bgGrad.addColorStop(1, settings.bgGradient2 || "#1e293b");

    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  const effectiveFontSize = settings.fontSize * scaleMultiplier;
  const paddingPx = settings.padding * scaleMultiplier;

  // Set font with font weight
  const weightStr = settings.fontWeight || "normal";
  ctx.font = `${weightStr} ${effectiveFontSize}px "${fontFamily}", system-ui, sans-serif`;
  ctx.textBaseline = "top";

  // Native RTL direction setting
  if ("direction" in ctx) {
    ctx.direction = "rtl";
  }

  // Modern browser letter spacing property support
  if ("letterSpacing" in ctx && settings.letterSpacing !== 0) {
    (ctx as any).letterSpacing = `${settings.letterSpacing * scaleMultiplier}px`;
  }

  const contentLeft = paddingPx + layout.extraMarginLeft;
  const contentWidth = layout.maxLineWidth;
  const startY = paddingPx + layout.extraMarginTop;

  // Calculate Fill Style for Text (Golden vs Solid vs Linear Gradient)
  let textFillStyle: string | CanvasGradient;

  if (settings.isGolden) {
    const angleRad = (45 - 90) * (Math.PI / 180);
    const cx = contentLeft + contentWidth / 2;
    const cy = startY + layout.totalTextHeight / 2;
    const r = Math.hypot(contentWidth, layout.totalTextHeight) / 2 || 100;
    const x1 = cx - r * Math.cos(angleRad);
    const y1 = cy - r * Math.sin(angleRad);
    const x2 = cx + r * Math.cos(angleRad);
    const y2 = cy + r * Math.sin(angleRad);
    textFillStyle = createGoldenGradient(ctx, settings.goldenPreset || "classic", x1, y1, x2, y2);
  } else if (settings.colorType === "gradient") {
    const angleRad = ((settings.gradientAngle || 90) - 90) * (Math.PI / 180);
    const cx = contentLeft + contentWidth / 2;
    const cy = startY + layout.totalTextHeight / 2;
    const r = Math.hypot(contentWidth, layout.totalTextHeight) / 2 || 100;

    const x1 = cx - r * Math.cos(angleRad);
    const y1 = cy - r * Math.sin(angleRad);
    const x2 = cx + r * Math.cos(angleRad);
    const y2 = cy + r * Math.sin(angleRad);

    const gradient = ctx.createLinearGradient(x1, y1, x2, y2);
    gradient.addColorStop(0, settings.gradientColor1 || "#10b981");
    gradient.addColorStop(1, settings.gradientColor2 || "#3b82f6");
    textFillStyle = gradient;
  } else {
    textFillStyle = settings.color || "#000000";
  }

  // Calculate X based on Alignment
  ctx.textAlign = settings.textAlign;

  for (let i = 0; i < layout.lines.length; i++) {
    const line = layout.lines[i];
    const lineY = startY + i * layout.lineHeightPx;

    let lineX: number;
    if (settings.textAlign === "right") {
      lineX = contentLeft + contentWidth;
    } else if (settings.textAlign === "center") {
      lineX = contentLeft + contentWidth / 2;
    } else {
      lineX = contentLeft;
    }

    // LAYER 1: 3D Extrusion (if 3D text is enabled)
    if (settings.text3dEnabled && settings.text3dDepth > 0) {
      const angleRad = ((settings.text3dAngle || 45) * Math.PI) / 180;
      const totalDepth = Math.round(settings.text3dDepth * scaleMultiplier);
      const baseExtrudeColor = settings.text3dColor || "#d97706";

      for (let d = totalDepth; d >= 1; d--) {
        const dx = d * Math.cos(angleRad);
        const dy = d * Math.sin(angleRad);

        ctx.save();

        // If shadow is enabled, attach drop shadow to the lowest (backmost) 3D layer
        if (d === totalDepth && settings.shadowEnabled) {
          ctx.shadowColor = settings.shadowColor;
          ctx.shadowBlur = settings.shadowBlur * scaleMultiplier;
          ctx.shadowOffsetX = settings.shadowOffsetX * scaleMultiplier;
          ctx.shadowOffsetY = settings.shadowOffsetY * scaleMultiplier;
        } else {
          ctx.shadowColor = "transparent";
        }

        let layerColor = baseExtrudeColor;
        if (settings.text3dDarken) {
          // Darken layer color progressively from front (1.0) to back (0.45)
          const factor = 0.45 + 0.55 * (1 - d / totalDepth);
          layerColor = adjustColorBrightness(baseExtrudeColor, factor);
        }

        ctx.fillStyle = layerColor;
        ctx.fillText(line, lineX + dx, lineY + dy);

        // Also outline the depth layers for crisp 3D edges if outline is enabled
        if (settings.outlineEnabled && settings.outlineWidth > 0) {
          ctx.strokeStyle = adjustColorBrightness(layerColor, 0.7);
          ctx.lineWidth = settings.outlineWidth * scaleMultiplier;
          ctx.lineJoin = "round";
          ctx.lineCap = "round";
          ctx.strokeText(line, lineX + dx, lineY + dy);
        }

        ctx.restore();
      }
    }

    // LAYER 2: Outline stroke on top face
    if (settings.outlineEnabled && settings.outlineWidth > 0) {
      ctx.save();
      ctx.strokeStyle = settings.outlineColor;
      ctx.lineWidth = settings.outlineWidth * 2 * scaleMultiplier;
      ctx.lineJoin = "round";
      ctx.lineCap = "round";
      ctx.miterLimit = 2;
      ctx.shadowColor = "transparent";
      ctx.strokeText(line, lineX, lineY);
      ctx.restore();
    }

    // LAYER 3: Main top face text fill with shadow (if 3D disabled)
    ctx.save();
    if (!settings.text3dEnabled && settings.shadowEnabled) {
      ctx.shadowColor = settings.shadowColor;
      ctx.shadowBlur = settings.shadowBlur * scaleMultiplier;
      ctx.shadowOffsetX = settings.shadowOffsetX * scaleMultiplier;
      ctx.shadowOffsetY = settings.shadowOffsetY * scaleMultiplier;
    } else {
      ctx.shadowColor = "transparent";
    }

    ctx.fillStyle = textFillStyle;
    ctx.fillText(line, lineX, lineY);
    ctx.restore();
  }

  return canvas;
}
