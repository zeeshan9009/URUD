import React from "react";
import type { TextSettings } from "../types/editor";
import { AlignRight, AlignCenter, AlignLeft, Bold, Palette, Sparkles } from "lucide-react";

interface StyleControlsProps {
  settings: TextSettings;
  onChange: (updates: Partial<TextSettings>) => void;
}

export const StyleControls: React.FC<StyleControlsProps> = ({ settings, onChange }) => {
  const isBold = settings.fontWeight === "bold";
  const isGradient = settings.colorType === "gradient";

  const gradientPresets = [
    { name: "Emerald Wave", c1: "#10b981", c2: "#3b82f6", angle: 90 },
    { name: "Sunset Gold", c1: "#f59e0b", c2: "#ef4444", angle: 90 },
    { name: "Royal Purple", c1: "#8b5cf6", c2: "#ec4899", angle: 90 },
    { name: "Ocean Cyan", c1: "#06b6d4", c2: "#3b82f6", angle: 90 },
    { name: "Deep Velvet", c1: "#111827", c2: "#4b5563", angle: 90 }
  ];

  return (
    <div className="control-section">
      <h3 className="section-title">Text Formatting & Styling</h3>

      {/* Font Size & Bold Toggle */}
      <div className="control-group">
        <div className="control-label-row">
          <label htmlFor="fontSizeSlider">Font Size & Weight</label>
          <div className="size-weight-header-actions">
            <button
              type="button"
              className={`btn-bold-toggle ${isBold ? "active" : ""}`}
              onClick={() => onChange({ fontWeight: isBold ? "normal" : "bold" })}
              title="Toggle Bold Font Weight"
            >
              <Bold size={16} />
              <span>Bold</span>
            </button>
            <div className="numeric-input-wrapper">
              <input
                id="fontSizeNumber"
                type="number"
                min={20}
                max={500}
                value={settings.fontSize}
                onChange={(e) => onChange({ fontSize: Math.max(20, Math.min(500, Number(e.target.value) || 20)) })}
              />
              <span className="unit">px</span>
            </div>
          </div>
        </div>
        <input
          id="fontSizeSlider"
          type="range"
          min={20}
          max={500}
          value={settings.fontSize}
          onChange={(e) => onChange({ fontSize: Number(e.target.value) })}
          className="range-slider"
        />
      </div>

      {/* Color Mode Switcher: Solid vs Gradient */}
      <div className="control-group">
        <div className="control-label-row">
          <label>Text Color Style</label>
          <span className="value-badge">{isGradient ? "Gradient Fill" : "Solid Fill"}</span>
        </div>
        <div className="segmented-control">
          <button
            type="button"
            className={`segmented-btn ${!isGradient ? "active" : ""}`}
            onClick={() => onChange({ colorType: "solid" })}
          >
            <Palette size={15} />
            <span>Solid Color</span>
          </button>
          <button
            type="button"
            className={`segmented-btn ${isGradient ? "active" : ""}`}
            onClick={() => onChange({ colorType: "gradient" })}
          >
            <Sparkles size={15} />
            <span>Gradient</span>
          </button>
        </div>
      </div>

      {/* Solid Color Picker */}
      {!isGradient ? (
        <div className="control-group">
          <label htmlFor="textColorInput">Solid Text Color</label>
          <div className="color-picker-row">
            <input
              id="textColorPicker"
              type="color"
              value={settings.color || "#000000"}
              onChange={(e) => onChange({ color: e.target.value })}
              className="color-swatch-input"
            />
            <input
              id="textColorInput"
              type="text"
              value={settings.color || "#000000"}
              onChange={(e) => onChange({ color: e.target.value })}
              className="hex-input"
              placeholder="#000000"
            />
          </div>
        </div>
      ) : (
        /* Gradient Color Pickers & Angle Slider */
        <div className="gradient-controls-box">
          <div className="control-group-grid">
            <div className="control-group">
              <label htmlFor="gradColor1">Start Color</label>
              <div className="color-picker-row">
                <input
                  id="gradColor1"
                  type="color"
                  value={settings.gradientColor1 || "#10b981"}
                  onChange={(e) => onChange({ gradientColor1: e.target.value })}
                  className="color-swatch-input"
                />
                <input
                  type="text"
                  value={settings.gradientColor1 || "#10b981"}
                  onChange={(e) => onChange({ gradientColor1: e.target.value })}
                  className="hex-input"
                />
              </div>
            </div>

            <div className="control-group">
              <label htmlFor="gradColor2">End Color</label>
              <div className="color-picker-row">
                <input
                  id="gradColor2"
                  type="color"
                  value={settings.gradientColor2 || "#3b82f6"}
                  onChange={(e) => onChange({ gradientColor2: e.target.value })}
                  className="color-swatch-input"
                />
                <input
                  type="text"
                  value={settings.gradientColor2 || "#3b82f6"}
                  onChange={(e) => onChange({ gradientColor2: e.target.value })}
                  className="hex-input"
                />
              </div>
            </div>
          </div>

          <div className="control-group">
            <div className="control-label-row">
              <label htmlFor="gradientAngleSlider">Gradient Angle</label>
              <span className="value-badge">{settings.gradientAngle || 90}°</span>
            </div>
            <input
              id="gradientAngleSlider"
              type="range"
              min={0}
              max={360}
              value={settings.gradientAngle || 90}
              onChange={(e) => onChange({ gradientAngle: Number(e.target.value) })}
              className="range-slider"
            />
          </div>

          {/* Quick Presets */}
          <div className="gradient-presets-row">
            <span className="presets-label">Presets:</span>
            {gradientPresets.map((p) => (
              <button
                key={p.name}
                type="button"
                className="gradient-preset-chip"
                style={{ background: `linear-gradient(135deg, ${p.c1}, ${p.c2})` }}
                onClick={() =>
                  onChange({
                    gradientColor1: p.c1,
                    gradientColor2: p.c2,
                    gradientAngle: p.angle
                  })
                }
                title={p.name}
              />
            ))}
          </div>
        </div>
      )}

      {/* Text Alignment */}
      <div className="control-group">
        <label>Text Alignment</label>
        <div className="segmented-control">
          <button
            type="button"
            className={`segmented-btn ${settings.textAlign === "right" ? "active" : ""}`}
            onClick={() => onChange({ textAlign: "right" })}
            title="Right align (Default for Urdu)"
          >
            <AlignRight size={16} />
            <span>Right</span>
          </button>
          <button
            type="button"
            className={`segmented-btn ${settings.textAlign === "center" ? "active" : ""}`}
            onClick={() => onChange({ textAlign: "center" })}
            title="Center align"
          >
            <AlignCenter size={16} />
            <span>Center</span>
          </button>
          <button
            type="button"
            className={`segmented-btn ${settings.textAlign === "left" ? "active" : ""}`}
            onClick={() => onChange({ textAlign: "left" })}
            title="Left align"
          >
            <AlignLeft size={16} />
            <span>Left</span>
          </button>
        </div>
      </div>

      {/* Line Height */}
      <div className="control-group">
        <div className="control-label-row">
          <label htmlFor="lineHeightSlider">Line Height</label>
          <span className="value-badge">{settings.lineHeight.toFixed(1)}x</span>
        </div>
        <input
          id="lineHeightSlider"
          type="range"
          min={0.8}
          max={3}
          step={0.1}
          value={settings.lineHeight}
          onChange={(e) => onChange({ lineHeight: Number(e.target.value) })}
          className="range-slider"
        />
      </div>

      {/* Letter Spacing */}
      <div className="control-group">
        <div className="control-label-row">
          <label htmlFor="letterSpacingSlider">Letter Spacing</label>
          <span className="value-badge">{settings.letterSpacing}px</span>
        </div>
        <input
          id="letterSpacingSlider"
          type="range"
          min={-10}
          max={30}
          value={settings.letterSpacing}
          onChange={(e) => onChange({ letterSpacing: Number(e.target.value) })}
          className="range-slider"
        />
        <p className="help-note">Note: For Urdu Nastaliq script, 0px preserves proper glyph joining.</p>
      </div>
    </div>
  );
};
