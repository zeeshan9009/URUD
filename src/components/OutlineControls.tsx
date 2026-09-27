import React from "react";
import type { TextSettings } from "../types/editor";

interface OutlineControlsProps {
  settings: TextSettings;
  onChange: (updates: Partial<TextSettings>) => void;
}

export const OutlineControls: React.FC<OutlineControlsProps> = ({ settings, onChange }) => {
  return (
    <div className="control-section">
      <div className="section-header-row">
        <h3 className="section-title">Outline / Stroke</h3>
        <label className="toggle-switch">
          <input
            type="checkbox"
            checked={settings.outlineEnabled}
            onChange={(e) => onChange({ outlineEnabled: e.target.checked })}
          />
          <span className="slider round"></span>
        </label>
      </div>

      {settings.outlineEnabled && (
        <div className="subcontrols-container">
          <div className="control-group">
            <label htmlFor="outlineColorInput">Outline Color</label>
            <div className="color-picker-row">
              <input
                id="outlineColorPicker"
                type="color"
                value={settings.outlineColor}
                onChange={(e) => onChange({ outlineColor: e.target.value })}
                className="color-swatch-input"
              />
              <input
                id="outlineColorInput"
                type="text"
                value={settings.outlineColor}
                onChange={(e) => onChange({ outlineColor: e.target.value })}
                className="hex-input"
              />
            </div>
          </div>

          <div className="control-group">
            <div className="control-label-row">
              <label htmlFor="outlineWidthSlider">Outline Width</label>
              <span className="value-badge">{settings.outlineWidth}px</span>
            </div>
            <input
              id="outlineWidthSlider"
              type="range"
              min={0}
              max={30}
              value={settings.outlineWidth}
              onChange={(e) => onChange({ outlineWidth: Number(e.target.value) })}
              className="range-slider"
            />
          </div>
        </div>
      )}
    </div>
  );
};
