import React from "react";
import type { TextSettings } from "../types/editor";
import { Sparkles, Award } from "lucide-react";

interface GoldenControlsProps {
  settings: TextSettings;
  onChange: (updates: Partial<TextSettings>) => void;
}

export const GoldenControls: React.FC<GoldenControlsProps> = ({ settings, onChange }) => {
  const presets = [
    {
      id: "classic",
      name: "24K Classic Gold",
      gradientBg: "linear-gradient(135deg, #BF953F, #FCF6BA, #B38728, #FBF5B7, #AA771C)",
      extrudeColor: "#9A7B38"
    },
    {
      id: "shiny",
      name: "Ultra Shiny Gold",
      gradientBg: "linear-gradient(135deg, #FFE57F, #FFD700, #FFF8DC, #DAA520, #B8860B)",
      extrudeColor: "#B8860B"
    },
    {
      id: "rose",
      name: "Rose Gold",
      gradientBg: "linear-gradient(135deg, #F5D6CE, #E8B4B8, #D4AF37, #A35C67)",
      extrudeColor: "#8C4653"
    },
    {
      id: "antique",
      name: "Antique Vintage",
      gradientBg: "linear-gradient(135deg, #E2C974, #C5A059, #9A7B38, #634B19)",
      extrudeColor: "#543C12"
    },
    {
      id: "royal",
      name: "Royal Crown Gold",
      gradientBg: "linear-gradient(135deg, #FFF2A3, #FFD700, #FF8C00, #8B5A2B)",
      extrudeColor: "#8B5A2B"
    }
  ] as const;

  const handleApplyGolden = (presetId: "classic" | "shiny" | "rose" | "antique" | "royal") => {
    const selectedPreset = presets.find((p) => p.id === presetId);
    onChange({
      isGolden: true,
      goldenPreset: presetId,
      text3dEnabled: true,
      text3dDepth: Math.max(settings.text3dDepth || 12, 10),
      text3dColor: selectedPreset ? selectedPreset.extrudeColor : "#9A7B38",
      text3dDarken: true,
      shadowEnabled: true,
      shadowColor: "rgba(0, 0, 0, 0.45)",
      shadowBlur: 10,
      shadowOffsetX: 3,
      shadowOffsetY: 6
    });
  };

  const handleDisableGolden = () => {
    onChange({ isGolden: false });
  };

  return (
    <div className="control-section golden-feature-section">
      <div className="section-header-row">
        <h3 className="section-title text-golden-accent">
          <Award size={18} className="inline-icon" style={{ verticalAlign: "text-bottom", marginRight: 6, color: "#d97706" }} />
          Golden Metallic Text Feature
        </h3>
        {settings.isGolden && (
          <button
            type="button"
            className="btn-disable-golden"
            onClick={handleDisableGolden}
            title="Disable Golden Style"
          >
            Clear Gold
          </button>
        )}
      </div>

      <p className="help-note" style={{ marginBottom: 12 }}>
        Transform your text into stunning 3D metallic gold calligraphic text in one click!
      </p>

      {/* Preset Buttons Grid */}
      <div className="golden-presets-grid">
        {presets.map((p) => {
          const isSelected = settings.isGolden && settings.goldenPreset === p.id;
          return (
            <button
              key={p.id}
              type="button"
              className={`golden-preset-card ${isSelected ? "active" : ""}`}
              onClick={() => handleApplyGolden(p.id)}
            >
              <div
                className="golden-color-bar"
                style={{ background: p.gradientBg }}
              />
              <div className="golden-preset-info">
                <span className="golden-preset-name">{p.name}</span>
                {isSelected && <Sparkles size={12} className="sparkle-icon" />}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
