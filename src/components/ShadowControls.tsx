import React from "react";
import type { TextSettings } from "../types/editor";

interface ShadowControlsProps {
  settings: TextSettings;
  onChange: (updates: Partial<TextSettings>) => void;
}

export const ShadowControls: React.FC<ShadowControlsProps> = ({ settings, onChange }) => {
  return (
    <div className="control-section">
      <div className="section-header-row">
        <h3 className="section-title">Text Shadow</h3>
        <label className="toggle-switch">
          <input
            type="checkbox"
            checked={settings.shadowEnabled}
            onChange={(e) => onChange({ shadowEnabled: e.target.checked })}
          />
          <span className="slider round"></span>
        </label>
      </div>

      {settings.shadowEnabled && (
        <div className="subcontrols-container">
          <div className="control-group">
            <label htmlFor="shadowColorInput">Shadow Color</label>
            <div className="color-picker-row">
              <input
                id="shadowColorPicker"
                type="color"
                value={settings.shadowColor.substring(0, 7)}
                onChange={(e) => onChange({ shadowColor: e.target.value })}
                className="color-swatch-input"
              />
              <input
                id="shadowColorInput"
                type="text"
                value={settings.shadowColor}
                onChange={(e) => onChange({ shadowColor: e.target.value })}
                className="hex-input"
              />
            </div>
          </div>

          <div className="control-group">
            <div className="control-label-row">
              <label htmlFor="shadowBlurSlider">Shadow Blur</label>
              <span className="value-badge">{settings.shadowBlur}px</span>
            </div>
            <input
              id="shadowBlurSlider"
              type="range"
              min={0}
              max={50}
              value={settings.shadowBlur}
              onChange={(e) => onChange({ shadowBlur: Number(e.target.value) })}
              className="range-slider"
            />
          </div>

          <div className="control-group-grid">
            <div className="control-group">
              <div className="control-label-row">
                <label htmlFor="shadowOffsetX">Offset X</label>
                <span className="value-badge">{settings.shadowOffsetX}px</span>
              </div>
              <input
                id="shadowOffsetX"
                type="range"
                min={-50}
                max={50}
                value={settings.shadowOffsetX}
                onChange={(e) => onChange({ shadowOffsetX: Number(e.target.value) })}
                className="range-slider"
              />
            </div>

            <div className="control-group">
              <div className="control-label-row">
                <label htmlFor="shadowOffsetY">Offset Y</label>
                <span className="value-badge">{settings.shadowOffsetY}px</span>
              </div>
              <input
                id="shadowOffsetY"
                type="range"
                min={-50}
                max={50}
                value={settings.shadowOffsetY}
                onChange={(e) => onChange({ shadowOffsetY: Number(e.target.value) })}
                className="range-slider"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
