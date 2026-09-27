export interface TextSettings {
  text: string;
  fontFamily: string;
  fontSize: number;
  fontWeight: "normal" | "bold";
  color: string;

  colorType: "solid" | "gradient";
  gradientColor1: string;
  gradientColor2: string;
  gradientAngle: number;

  backgroundType: "transparent" | "solid" | "gradient";
  backgroundColor: string;
  bgGradient1: string;
  bgGradient2: string;
  bgGradientAngle: number;

  textAlign: "left" | "center" | "right";
  lineHeight: number;
  letterSpacing: number;
  padding: number;
  scale: number;

  outlineEnabled: boolean;
  outlineColor: string;
  outlineWidth: number;

  shadowEnabled: boolean;
  shadowColor: string;
  shadowBlur: number;
  shadowOffsetX: number;
  shadowOffsetY: number;

  // 3D Text Extrusion Settings
  text3dEnabled: boolean;
  text3dDepth: number;
  text3dAngle: number;
  text3dColor: string;
  text3dDarken: boolean;

  // Golden Style Presets
  isGolden: boolean;
  goldenPreset: "classic" | "shiny" | "rose" | "antique" | "royal";
}

export interface BannerSettings {
  aspectRatio: "1:1" | "16:9" | "9:16" | "4:5" | "3:1" | "custom";
  width: number;
  height: number;
  gradientType: "linear" | "radial";
  color1: string;
  color2: string;
  color3: string;
  useThreeColors: boolean;
  angle: number;

  text: string;
  fontFamily: string;
  fontSize: number;
  textColor: string;
  textAlign: "left" | "center" | "right";
  scale: number;
}

export interface UrduTextElement {
  id: string;
  text: string;
  x: number;
  y: number;
  fontSize: number;
  fontFamily: string;
  fontWeight: "normal" | "bold";
  colorType: "solid" | "gradient";
  color: string;
  gradientColor1: string;
  gradientColor2: string;
  gradientAngle: number;
  strokeEnabled: boolean;
  strokeColor: string;
  strokeWidth: number;
  shadowEnabled: boolean;
  shadowColor: string;
  shadowBlur: number;
  shadowOffsetX: number;
  shadowOffsetY: number;
  extrude3D: boolean;
  extrudeColor: string;
  extrudeDepth: number;
  rotation: number;
  opacity: number;
  zIndex: number;
}

export type TabType = "editor" | "library" | "banner" | "settings";

export interface ToastMessage {
  id: string;
  type: "success" | "error" | "info";
  message: string;
}
