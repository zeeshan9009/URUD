import React, { useState, useRef, useEffect } from "react";
import type { BannerSettings } from "../types/editor";
import type { StoredFont } from "../types/fonts";
import { ensureFontLoaded } from "../services/fontLoader";
import { CURATED_REMOTE_FONTS } from "../data/fonts";
import { Sparkles, Download, Layout, Sliders } from "lucide-react";

interface BannerStudioProps {
  installedFonts: StoredFont[];
  onToast: (type: "success" | "error" | "info", msg: string) => void;
}

const DEFAULT_BANNER: BannerSettings = {
  aspectRatio: "16:9",
  width: 1920,
  height: 1080,
  gradientType: "linear",
  color1: "#064e3b",
  color2: "#047857",
  color3: "#10b981",
  useThreeColors: true,
  angle: 135,

  text: "البدار الیکٹرونکس\nآپ کے اعتماد کا شکریہ",
  fontFamily: "Noto Nastaliq Urdu",
  fontSize: 110,
  textColor: "#ffffff",
  textAlign: "center",
  scale: 2
};

export const BannerStudio: React.FC<BannerStudioProps> = ({ installedFonts, onToast }) => {
  const [settings, setSettings] = useState<BannerSettings>(DEFAULT_BANNER);
  const [isDownloading, setIsDownloading] = useState<boolean>(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const presets = [
    { name: "Pakistani Emerald", c1: "#064e3b", c2: "#047857", c3: "#10b981", angle: 135 },
    { name: "Golden Luxury", c1: "#451a03", c2: "#b45309", c3: "#f59e0b", angle: 135 },
    { name: "Cyberpunk Neon", c1: "#4c1d95", c2: "#7c3aed", c3: "#06b6d4", angle: 135 },
    { name: "Royal Velvet", c1: "#31124b", c2: "#6b21a8", c3: "#db2777", angle: 135 },
    { name: "Sunset Glow", c1: "#7c2d12", c2: "#c2410c", c3: "#f97316", angle: 135 },
    { name: "Ocean Deep", c1: "#0f172a", c2: "#0c4a6e", c3: "#0284c7", angle: 135 }
  ];

  const handleRatioSelect = (ratio: BannerSettings["aspectRatio"]) => {
    let w = settings.width;
    let h = settings.height;

    if (ratio === "1:1") { w = 1080; h = 1080; }
    else if (ratio === "16:9") { w = 1920; h = 1080; }
    else if (ratio === "9:16") { w = 1080; h = 1920; }
    else if (ratio === "4:5") { w = 1080; h = 1350; }
    else if (ratio === "3:1") { w = 1500; h = 500; }

    setSettings(prev => ({ ...prev, aspectRatio: ratio, width: w, height: h }));
  };

  useEffect(() => {
    ensureFontLoaded(settings.fontFamily);
  }, [settings.fontFamily]);

  // Render Canvas Callback
  const renderBannerCanvas = (targetScale: number = 1): HTMLCanvasElement => {
    const canvas = document.createElement("canvas");
    const w = settings.width * targetScale;
    const h = settings.height * targetScale;

    canvas.width = w;
    canvas.height = h;

    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas context uninitialized");

    // 1. Render Gradient Background
    let bgFill: CanvasGradient;

    if (settings.gradientType === "radial") {
      bgFill = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, Math.hypot(w, h) / 2);
    } else {
      const angleRad = ((settings.angle || 135) - 90) * (Math.PI / 180);
      const cx = w / 2;
      const cy = h / 2;
      const r = Math.hypot(w, h) / 2;

      const x1 = cx - r * Math.cos(angleRad);
      const y1 = cy - r * Math.sin(angleRad);
      const x2 = cx + r * Math.cos(angleRad);
      const y2 = cy + r * Math.sin(angleRad);

      bgFill = ctx.createLinearGradient(x1, y1, x2, y2);
    }

    bgFill.addColorStop(0, settings.color1 || "#064e3b");
    if (settings.useThreeColors) {
      bgFill.addColorStop(0.5, settings.color2 || "#047857");
    }
    bgFill.addColorStop(1, settings.useThreeColors ? settings.color3 : settings.color2);

    ctx.fillStyle = bgFill;
    ctx.fillRect(0, 0, w, h);

    // 2. Render Overlaid Text
    if (settings.text && settings.text.trim().length > 0) {
      const fontSizePx = settings.fontSize * targetScale;
      ctx.font = `bold ${fontSizePx}px "${settings.fontFamily}", system-ui, sans-serif`;
      ctx.direction = "rtl";
      ctx.textAlign = settings.textAlign;
      ctx.textBaseline = "middle";

      const lines = settings.text.split("\n");
      const lineHeightPx = fontSizePx * 1.5;
      const totalHeight = lines.length * lineHeightPx;
      const startY = h / 2 - totalHeight / 2 + lineHeightPx / 2;

      let startX = w / 2;
      if (settings.textAlign === "right") startX = w * 0.9;
      if (settings.textAlign === "left") startX = w * 0.1;

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const lineY = startY + i * lineHeightPx;

        // Shadow for banner legibility
        ctx.save();
        ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
        ctx.shadowBlur = 12 * targetScale;
        ctx.shadowOffsetX = 3 * targetScale;
        ctx.shadowOffsetY = 4 * targetScale;

        ctx.fillStyle = settings.textColor || "#ffffff";
        ctx.fillText(line, startX, lineY);
        ctx.restore();
      }
    }

    return canvas;
  };

  // Sync Live Preview Canvas
  useEffect(() => {
    let active = true;

    const syncPreview = async () => {
      await ensureFontLoaded(settings.fontFamily);
      await document.fonts.ready;

      if (!active || !canvasRef.current) return;

      try {
        const rendered = renderBannerCanvas(1);
        canvasRef.current.width = rendered.width;
        canvasRef.current.height = rendered.height;

        const ctx = canvasRef.current.getContext("2d");
        if (ctx) {
          ctx.clearRect(0, 0, rendered.width, rendered.height);
          ctx.drawImage(rendered, 0, 0);
        }
      } catch (err) {
        console.error("Banner canvas preview error:", err);
      }
    };

    const animId = requestAnimationFrame(syncPreview);
    return () => {
      active = false;
      cancelAnimationFrame(animId);
    };
  }, [settings]);

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      await ensureFontLoaded(settings.fontFamily);
      await document.fonts.ready;

      const scale = settings.scale || 2;
      const canvas = renderBannerCanvas(scale);

      canvas.toBlob((blob) => {
        if (!blob) {
          onToast("error", "Could not generate banner image.");
          setIsDownloading(false);
          return;
        }

        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `banner-${settings.aspectRatio.replace(":", "x")}-${Date.now()}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        setTimeout(() => URL.revokeObjectURL(url), 1000);
        onToast("success", "Custom Gradient Banner downloaded successfully!");
        setIsDownloading(false);
      }, "image/png");
    } catch (err: any) {
      onToast("error", err.message || "Failed to download banner.");
      setIsDownloading(false);
    }
  };

  return (
    <div className="banner-studio-container">
      {/* Studio Control Sidebar */}
      <aside className="editor-sidebar">
        {/* Aspect Ratio & Dimensions Card */}
        <div className="control-section">
          <div className="section-header-row">
            <h3 className="section-title">Aspect Ratio & Canvas Size</h3>
            <span className="value-badge">{settings.width} × {settings.height} px</span>
          </div>

          <div className="aspect-chips-grid">
            {[
              { id: "16:9", label: "16:9 Banner", dim: "1920×1080" },
              { id: "1:1", label: "1:1 Square", dim: "1080×1080" },
              { id: "9:16", label: "9:16 Story", dim: "1080×1920" },
              { id: "4:5", label: "4:5 Portrait", dim: "1080×1350" },
              { id: "3:1", label: "3:1 Header", dim: "1500×500" },
              { id: "custom", label: "Custom Build", dim: "Custom" }
            ].map((r) => (
              <button
                key={r.id}
                type="button"
                className={`aspect-chip-btn ${settings.aspectRatio === r.id ? "active" : ""}`}
                onClick={() => handleRatioSelect(r.id as any)}
              >
                <span className="ratio-title">{r.label}</span>
                <span className="ratio-dim">{r.dim}</span>
              </button>
            ))}
          </div>

          {settings.aspectRatio === "custom" && (
            <div className="control-group-grid mt-3">
              <div className="control-group">
                <label>Width (px)</label>
                <input
                  type="number"
                  min={100}
                  max={5000}
                  value={settings.width}
                  onChange={(e) => setSettings(prev => ({ ...prev, width: Number(e.target.value) }))}
                  className="hex-input"
                />
              </div>
              <div className="control-group">
                <label>Height (px)</label>
                <input
                  type="number"
                  min={100}
                  max={5000}
                  value={settings.height}
                  onChange={(e) => setSettings(prev => ({ ...prev, height: Number(e.target.value) }))}
                  className="hex-input"
                />
              </div>
            </div>
          )}
        </div>

        {/* Gradient Creator Studio */}
        <div className="control-section">
          <div className="section-header-row">
            <h3 className="section-title">Custom Gradient Builder</h3>
            <span className="value-badge">{settings.gradientType.toUpperCase()}</span>
          </div>

          <div className="control-group">
            <label>Gradient Type</label>
            <div className="segmented-control">
              <button
                type="button"
                className={`segmented-btn ${settings.gradientType === "linear" ? "active" : ""}`}
                onClick={() => setSettings(prev => ({ ...prev, gradientType: "linear" }))}
              >
                <Sliders size={15} />
                <span>Linear</span>
              </button>
              <button
                type="button"
                className={`segmented-btn ${settings.gradientType === "radial" ? "active" : ""}`}
                onClick={() => setSettings(prev => ({ ...prev, gradientType: "radial" }))}
              >
                <Sparkles size={15} />
                <span>Radial</span>
              </button>
            </div>
          </div>

          {/* Color Stops */}
          <div className="control-group-grid">
            <div className="control-group">
              <label>Color 1 (Start)</label>
              <div className="color-picker-row">
                <input
                  type="color"
                  value={settings.color1}
                  onChange={(e) => setSettings(prev => ({ ...prev, color1: e.target.value }))}
                  className="color-swatch-input"
                />
                <input
                  type="text"
                  value={settings.color1}
                  onChange={(e) => setSettings(prev => ({ ...prev, color1: e.target.value }))}
                  className="hex-input"
                />
              </div>
            </div>

            <div className="control-group">
              <label>Color 2 (End)</label>
              <div className="color-picker-row">
                <input
                  type="color"
                  value={settings.color2}
                  onChange={(e) => setSettings(prev => ({ ...prev, color2: e.target.value }))}
                  className="color-swatch-input"
                />
                <input
                  type="text"
                  value={settings.color2}
                  onChange={(e) => setSettings(prev => ({ ...prev, color2: e.target.value }))}
                  className="hex-input"
                />
              </div>
            </div>
          </div>

          {/* 3-Stop Toggle */}
          <div className="control-group">
            <div className="section-header-row">
              <label>Add 3rd Accent Color Stop</label>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={settings.useThreeColors}
                  onChange={(e) => setSettings(prev => ({ ...prev, useThreeColors: e.target.checked }))}
                />
                <span className="slider round"></span>
              </label>
            </div>

            {settings.useThreeColors && (
              <div className="color-picker-row mt-2">
                <input
                  type="color"
                  value={settings.color3}
                  onChange={(e) => setSettings(prev => ({ ...prev, color3: e.target.value }))}
                  className="color-swatch-input"
                />
                <input
                  type="text"
                  value={settings.color3}
                  onChange={(e) => setSettings(prev => ({ ...prev, color3: e.target.value }))}
                  className="hex-input"
                />
              </div>
            )}
          </div>

          {/* Angle Slider */}
          {settings.gradientType === "linear" && (
            <div className="control-group">
              <div className="control-label-row">
                <label>Gradient Angle</label>
                <span className="value-badge">{settings.angle}°</span>
              </div>
              <input
                type="range"
                min={0}
                max={360}
                value={settings.angle}
                onChange={(e) => setSettings(prev => ({ ...prev, angle: Number(e.target.value) }))}
                className="range-slider"
              />
            </div>
          )}

          {/* Designer Presets */}
          <div className="gradient-presets-row">
            <span className="presets-label">Designer Themes:</span>
            {presets.map((p) => (
              <button
                key={p.name}
                type="button"
                className="gradient-preset-chip"
                style={{ background: `linear-gradient(135deg, ${p.c1}, ${p.c2}, ${p.c3})` }}
                onClick={() =>
                  setSettings(prev => ({
                    ...prev,
                    color1: p.c1,
                    color2: p.c2,
                    color3: p.c3,
                    angle: p.angle,
                    useThreeColors: true
                  }))
                }
                title={p.name}
              />
            ))}
          </div>
        </div>

        {/* Text Overlay Section */}
        <div className="control-section">
          <h3 className="section-title">Urdu Text Overlay</h3>

          <div className="control-group">
            <textarea
              value={settings.text}
              onChange={(e) => setSettings(prev => ({ ...prev, text: e.target.value }))}
              placeholder="اپنا بینر متن یہاں لکھیں..."
              rows={3}
              className="urdu-textarea"
              dir="rtl"
            />
          </div>

          <div className="control-group">
            <label>Font Family</label>
            <select
              value={settings.fontFamily}
              onChange={(e) => setSettings(prev => ({ ...prev, fontFamily: e.target.value }))}
              className="font-select-input"
            >
              {installedFonts.length > 0 && (
                <optgroup label="Installed Local Fonts">
                  {installedFonts.map(f => (
                    <option key={f.id} value={f.family}>{f.displayName}</option>
                  ))}
                </optgroup>
              )}
              <optgroup label="Curated Fonts">
                {CURATED_REMOTE_FONTS.map(f => (
                  <option key={f.id} value={f.family}>{f.displayName} — {f.category}</option>
                ))}
              </optgroup>
            </select>
          </div>

          <div className="control-group">
            <div className="control-label-row">
              <label>Text Size</label>
              <span className="value-badge">{settings.fontSize}px</span>
            </div>
            <input
              type="range"
              min={20}
              max={300}
              value={settings.fontSize}
              onChange={(e) => setSettings(prev => ({ ...prev, fontSize: Number(e.target.value) }))}
              className="range-slider"
            />
          </div>
        </div>

        {/* Banner Export Card */}
        <div className="control-section">
          <div className="control-group">
            <label>Resolution Export Scale</label>
            <div className="segmented-control scale-control">
              {[1, 2, 3, 4].map((s) => (
                <button
                  key={s}
                  type="button"
                  className={`segmented-btn ${settings.scale === s ? "active" : ""}`}
                  onClick={() => setSettings(prev => ({ ...prev, scale: s }))}
                >
                  <span>{s}x</span>
                  {s === 2 && <span className="recommended-label">Default</span>}
                </button>
              ))}
            </div>
          </div>

          <button
            type="button"
            className="btn btn-primary btn-large w-full mt-2"
            onClick={handleDownload}
            disabled={isDownloading}
          >
            <Download size={18} />
            <span>{isDownloading ? "Generating High-Res Banner..." : "Download Banner PNG"}</span>
          </button>
        </div>
      </aside>

      {/* Live Banner Viewport */}
      <main className="editor-preview-column">
        <div className="preview-container">
          <div className="preview-header-bar">
            <div className="preview-status-badge">
              <Layout size={16} />
              <span>Banner Studio ({settings.aspectRatio})</span>
            </div>
            <div className="canvas-dimensions-badge">
              <span>{settings.width} × {settings.height} px</span>
              <span className="divider">•</span>
              <span className="export-dim">{settings.scale}x Export: {settings.width * settings.scale} × {settings.height * settings.scale} px</span>
            </div>
          </div>

          <div className="canvas-viewport banner-viewport-bg">
            <div className="canvas-zoom-wrapper">
              <canvas
                ref={canvasRef}
                className="main-render-canvas banner-canvas"
                title="Gradient Banner Preview"
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
