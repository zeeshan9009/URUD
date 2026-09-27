import React, { useEffect } from "react";
import type { StoredFont } from "../types/fonts";
import { ensureFontLoaded } from "../services/fontLoader";
import { CURATED_REMOTE_FONTS } from "../data/fonts";
import { Upload, Type } from "lucide-react";

interface FontSelectorProps {
  selectedFontFamily: string;
  onSelectFont: (family: string) => void;
  installedFonts: StoredFont[];
  onOpenUpload: () => void;
}

export const FontSelector: React.FC<FontSelectorProps> = ({
  selectedFontFamily,
  onSelectFont,
  installedFonts,
  onOpenUpload
}) => {
  useEffect(() => {
    ensureFontLoaded(selectedFontFamily);
  }, [selectedFontFamily]);

  const handleFontChange = (family: string) => {
    ensureFontLoaded(family);
    onSelectFont(family);
  };

  // Group curated remote fonts by category
  const categories = Array.from(new Set(CURATED_REMOTE_FONTS.map((f) => f.category)));

  return (
    <div className="control-section font-selector-section">
      <div className="section-header-row">
        <h3 className="section-title">Font Family ({CURATED_REMOTE_FONTS.length + installedFonts.length} Real Fonts)</h3>
        <button
          type="button"
          className="btn btn-inline-sm"
          onClick={onOpenUpload}
        >
          <Upload size={14} />
          <span>Upload Font</span>
        </button>
      </div>

      <div className="font-dropdown-wrapper">
        <label htmlFor="fontSelect" className="sr-only">Select Font</label>
        <select
          id="fontSelect"
          value={selectedFontFamily}
          onChange={(e) => handleFontChange(e.target.value)}
          className="font-select-input"
        >
          {installedFonts.length > 0 && (
            <optgroup label="Installed Local Fonts (IndexedDB)">
              {installedFonts.map((font) => (
                <option key={font.id} value={font.family}>
                  {font.displayName} ({font.source === "uploaded" ? "Custom Upload" : "Downloaded"})
                </option>
              ))}
            </optgroup>
          )}

          {categories.map((cat) => {
            const fontsInCat = CURATED_REMOTE_FONTS.filter((f) => f.category === cat);
            return (
              <optgroup key={cat} label={`${cat} Style Fonts`}>
                {fontsInCat.map((font) => (
                  <option key={font.id} value={font.family}>
                    {font.displayName} — {font.category}
                  </option>
                ))}
              </optgroup>
            );
          })}

          <optgroup label="System Standard Fallback">
            <option value="system-ui">System Default</option>
          </optgroup>
        </select>
      </div>

      {/* Active Font Live Urdu Preview Banner */}
      <div className="selected-font-preview-box">
        <div className="selected-font-info">
          <Type size={14} className="text-emerald-500" />
          <span className="selected-font-name">{selectedFontFamily}</span>
        </div>
        <div
          className="selected-font-urdu-sample"
          style={{ fontFamily: `"${selectedFontFamily}", system-ui, sans-serif` }}
        >
          خوش آمدید
        </div>
      </div>
    </div>
  );
};
