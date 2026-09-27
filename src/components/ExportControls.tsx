import React from "react";
import type { TextSettings } from "../types/editor";
import { Download, Copy, RotateCcw, Image, Sparkles, Layers } from "lucide-react";

interface ExportControlsProps {
  settings: TextSettings;
  onChange: (updates: Partial<TextSettings>) => void;
  onDownload: () => void;
  onCopy: () => void;
  onReset: () => void;
  isDownloading: boolean;
  disabled: boolean;
}

export const ExportControls: React.FC<ExportControlsProps> = ({
  settings,
  onChange,
  onDownload,
  onCopy,
  onReset,
  isDownloading,
  disabled
}) => {
  const bgType = settings.backgroundType || "transparent";

  const bgPresets = [
    { name: "Midnight Dark", c1: "#0f172a", c2: "#1e293b", angle: 90 },
    { name: "Royal Emerald", c1: "#064e3b", c2: "#047857", angle: 90 },
    { name: "Sunset Gold", c1: "#451a03", c2: "#78350f", angle: 90 },
    { name: "Ocean Deep", c1: "#0c4a6e", c2: "#0369a1", angle: 90 },
    { name: "Clean Slate", c1: "#f1f5f9", c2: "#e2e8f0", angle: 90 }
  ];

  return (
    <div className="control-section export-section">
      <h3 className="section-title">Canvas Background & Export</h3>

      {/* Canvas Background Type Switcher */}
      <div className="control-group">
        <label>Canvas Background</label>
        <div className="segmented-control">
          <button
            type="button"
            className={`segmented-btn ${bgType === "transparent" ? "active" : ""}`}
            onClick={() => onChange({ backgroundType: "transparent" })}
            title="Transparent background (0% Alpha fill)"
          >
            <Layers size={15} />
            <span>Transparent</span>
          </button>
          <button
            type="button"
            className={`segmented-btn ${bgType === "solid" ? "active" : ""}`}
            onClick={() => onChange({ backgroundType: "solid" })}
            title="Solid color background"
          >
            <Image size={15} />
            <span>Solid Color</span>
          </button>
          <button
            type="button"
            className={`segmented-btn ${bgType === "gradient" ? "active" : ""}`}
            onClick={() => onChange({ backgroundType: "gradient" })}
            title="Gradient color background"
          >
            <Sparkles size={15} />
            <span>Gradient BG</span>
          </button>
        </div>
      </div>

      {/* Solid Background Color Picker */}
      {bgType === "solid" && (
        <div className="control-group">
          <label htmlFor="bgColorInput">Background Color</label>
          <div className="color-picker-row">
            <input
              id="bgColorPicker"
              type="color"
              value={settings.backgroundColor || "#ffffff"}
              onChange={(e) => onChange({ backgroundColor: e.target.value })}
              className="color-swatch-input"
            />
            <input
              id="bgColorInput"
              type="text"
              value={settings.backgroundColor || "#ffffff"}
              onChange={(e) => onChange({ backgroundColor: e.target.value })}
              className="hex-input"
              placeholder="#ffffff"
            />
          </div>
        </div>
      )}

      {/* Gradient Background Options */}
      {bgType === "gradient" && (
        <div className="gradient-controls-box">
          <div className="control-group-grid">
            <div className="control-group">
              <label htmlFor="bgGradColor1">BG Start Color</label>
              <div className="color-picker-row">
                <input
                  id="bgGradColor1"
                  type="color"
                  value={settings.bgGradient1 || "#0f172a"}
                  onChange={(e) => onChange({ bgGradient1: e.target.value })}
                  className="color-swatch-input"
                />
                <input
                  type="text"
                  value={settings.bgGradient1 || "#0f172a"}
                  onChange={(e) => onChange({ bgGradient1: e.target.value })}
                  className="hex-input"
                />
              </div>
            </div>

            <div className="control-group">
              <label htmlFor="bgGradColor2">BG End Color</label>
              <div className="color-picker-row">
                <input
                  id="bgGradColor2"
                  type="color"
                  value={settings.bgGradient2 || "#1e293b"}
                  onChange={(e) => onChange({ bgGradient2: e.target.value })}
                  className="color-swatch-input"
                />
                <input
                  type="text"
                  value={settings.bgGradient2 || "#1e293b"}
                  onChange={(e) => onChange({ bgGradient2: e.target.value })}
                  className="hex-input"
                />
              </div>
            </div>
          </div>

          <div className="control-group">
            <div className="control-label-row">
              <label htmlFor="bgGradientAngleSlider">BG Gradient Angle</label>
              <span className="value-badge">{settings.bgGradientAngle || 90}°</span>
            </div>
            <input
              id="bgGradientAngleSlider"
              type="range"
              min={0}
              max={360}
              value={settings.bgGradientAngle || 90}
              onChange={(e) => onChange({ bgGradientAngle: Number(e.target.value) })}
              className="range-slider"
            />
          </div>

          {/* BG Presets */}
          <div className="gradient-presets-row">
            <span className="presets-label">BG Presets:</span>
            {bgPresets.map((p) => (
              <button
                key={p.name}
                type="button"
                className="gradient-preset-chip"
                style={{ background: `linear-gradient(135deg, ${p.c1}, ${p.c2})` }}
                onClick={() =>
                  onChange({
                    bgGradient1: p.c1,
                    bgGradient2: p.c2,
                    bgGradientAngle: p.angle
                  })
                }
                title={p.name}
              />
            ))}
          </div>
        </div>
      )}

      {/* Padding */}
      <div className="control-group">
        <div className="control-label-row">
          <label htmlFor="paddingSlider">Canvas Outer Padding</label>
          <span className="value-badge">{settings.padding}px</span>
        </div>
        <input
          id="paddingSlider"
          type="range"
          min={0}
          max={200}
          value={settings.padding}
          onChange={(e) => onChange({ padding: Number(e.target.value) })}
          className="range-slider"
        />
      </div>

      {/* Export Scale */}
      <div className="control-group">
        <label>Export Resolution Scale</label>
        <div className="segmented-control scale-control">
          {[1, 2, 3, 4].map((s) => (
            <button
              key={s}
              type="button"
              className={`segmented-btn ${settings.scale === s ? "active" : ""}`}
              onClick={() => onChange({ scale: s })}
            >
              <span>{s}x</span>
              {s === 2 && <span className="recommended-label">Default</span>}
            </button>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="action-buttons-stack">
        <button
          type="button"
          className="btn btn-primary btn-large btn-download"
          onClick={onDownload}
          disabled={disabled || isDownloading}
        >
          <Download size={18} />
          <span>
            {isDownloading
              ? "Generating High-Res PNG..."
              : bgType === "transparent"
              ? "Download Transparent PNG"
              : "Download Image PNG"}
          </span>
        </button>

        <div className="action-buttons-row">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onCopy}
            disabled={disabled || isDownloading}
            title="Copy image PNG to clipboard"
          >
            <Copy size={16} />
            <span>Copy PNG</span>
          </button>

          <button
            type="button"
            className="btn btn-ghost"
            onClick={onReset}
            title="Reset all settings to default values"
          >
            <RotateCcw size={16} />
            <span>Reset All</span>
          </button>
        </div>
      </div>
    </div>
  );
};
