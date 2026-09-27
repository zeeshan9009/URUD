import React from "react";
import type { TextSettings } from "../types/editor";
import { Box, Sun } from "lucide-react";

interface ThreeDControlsProps {
  settings: TextSettings;
  onChange: (updates: Partial<TextSettings>) => void;
}

export const ThreeDControls: React.FC<ThreeDControlsProps> = ({ settings, onChange }) => {
  return (
    <div className="control-section">
      <div className="section-header-row">
        <h3 className="section-title">
          <Box size={18} className="inline-icon" style={{ verticalAlign: "text-bottom", marginRight: 6 }} />
          3D Text Extrusion
        </h3>
        <label className="toggle-switch-wrapper">
          <input
            type="checkbox"
            checked={settings.text3dEnabled}
            onChange={(e) => onChange({ text3dEnabled: e.target.checked })}
          />
          <span className="toggle-slider" />
        </label>
      </div>

      {settings.text3dEnabled && (
        <div className="collapsible-controls-body">
          {/* 3D Depth Slider */}
          <div className="control-group">
            <div className="control-label-row">
              <label htmlFor="text3dDepthSlider">Extrusion Depth</label>
              <span className="value-badge">{settings.text3dDepth || 12}px</span>
            </div>
            <input
              id="text3dDepthSlider"
              type="range"
              min={1}
              max={60}
              value={settings.text3dDepth || 12}
              onChange={(e) => onChange({ text3dDepth: Number(e.target.value) })}
              className="range-slider"
            />
          </div>

          {/* 3D Angle Slider */}
          <div className="control-group">
            <div className="control-label-row">
              <label htmlFor="text3dAngleSlider">3D Projection Angle</label>
              <span className="value-badge">{settings.text3dAngle || 45}°</span>
            </div>
            <input
              id="text3dAngleSlider"
              type="range"
              min={0}
              max={360}
              step={15}
              value={settings.text3dAngle || 45}
              onChange={(e) => onChange({ text3dAngle: Number(e.target.value) })}
              className="range-slider"
            />
          </div>

          {/* 3D Extrusion Color */}
          <div className="control-group">
            <label htmlFor="text3dColorInput">3D Side Wall Color</label>
            <div className="color-picker-row">
              <input
                id="text3dColorPicker"
                type="color"
                value={settings.text3dColor || "#d97706"}
                onChange={(e) => onChange({ text3dColor: e.target.value })}
                className="color-swatch-input"
              />
              <input
                id="text3dColorInput"
                type="text"
                value={settings.text3dColor || "#d97706"}
                onChange={(e) => onChange({ text3dColor: e.target.value })}
                className="hex-input"
              />
            </div>
          </div>

          {/* Darken Shading Toggle */}
          <div className="control-group">
            <label className="checkbox-control-label">
              <input
                type="checkbox"
                checked={settings.text3dDarken}
                onChange={(e) => onChange({ text3dDarken: e.target.checked })}
              />
              <Sun size={15} />
              <span>Enable Realistic 3D Ambient Shading</span>
            </label>
          </div>
        </div>
      )}
    </div>
  );
};
