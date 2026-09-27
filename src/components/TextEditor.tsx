import React from "react";
import type { TextSettings } from "../types/editor";
import type { StoredFont } from "../types/fonts";
import { FontSelector } from "./FontSelector";
import { GoldenControls } from "./GoldenControls";
import { ThreeDControls } from "./ThreeDControls";
import { StyleControls } from "./StyleControls";
import { OutlineControls } from "./OutlineControls";
import { ShadowControls } from "./ShadowControls";
import { ExportControls } from "./ExportControls";
import { PreviewCanvas } from "./PreviewCanvas";

interface TextEditorProps {
  settings: TextSettings;
  onChangeSettings: (updates: Partial<TextSettings>) => void;
  installedFonts: StoredFont[];
  onOpenUpload: () => void;
  onDownload: () => void;
  onCopy: () => void;
  onReset: () => void;
  isDownloading: boolean;
}

export const TextEditor: React.FC<TextEditorProps> = ({
  settings,
  onChangeSettings,
  installedFonts,
  onOpenUpload,
  onDownload,
  onCopy,
  onReset,
  isDownloading
}) => {
  const isTextEmpty = !settings.text || settings.text.trim().length === 0;

  return (
    <div className="editor-layout">
      {/* Left Column: Control Panel */}
      <aside className="editor-sidebar">
        {/* Text Input Section */}
        <div className="control-section text-input-section">
          <div className="section-header-row">
            <h3 className="section-title">Urdu Text</h3>
            <span className="rtl-badge">RTL Enabled</span>
          </div>

          <div className="textarea-wrapper">
            <textarea
              id="urduTextArea"
              value={settings.text}
              onChange={(e) => onChangeSettings({ text: e.target.value })}
              placeholder="اپنا اردو متن یہاں لکھیں..."
              rows={4}
              className="urdu-textarea"
              dir="rtl"
            />
          </div>
          <p className="help-note">
            Supports Urdu, Arabic, Persian, English, and multiple line formatting.
          </p>
        </div>

        {/* Font Selector */}
        <FontSelector
          selectedFontFamily={settings.fontFamily}
          onSelectFont={(family) => onChangeSettings({ fontFamily: family })}
          installedFonts={installedFonts}
          onOpenUpload={onOpenUpload}
        />

        {/* Golden Metallic Text Feature */}
        <GoldenControls settings={settings} onChange={onChangeSettings} />

        {/* 3D Text Extrusion Feature */}
        <ThreeDControls settings={settings} onChange={onChangeSettings} />

        {/* Style Controls */}
        <StyleControls settings={settings} onChange={onChangeSettings} />

        {/* Outline Controls */}
        <OutlineControls settings={settings} onChange={onChangeSettings} />

        {/* Shadow Controls */}
        <ShadowControls settings={settings} onChange={onChangeSettings} />

        {/* Canvas & Export Controls */}
        <ExportControls
          settings={settings}
          onChange={onChangeSettings}
          onDownload={onDownload}
          onCopy={onCopy}
          onReset={onReset}
          isDownloading={isDownloading}
          disabled={isTextEmpty}
        />
      </aside>

      {/* Right Column: Live Preview Viewport */}
      <main className="editor-preview-column">
        <PreviewCanvas settings={settings} selectedFontFamily={settings.fontFamily} />
      </main>
    </div>
  );
};
