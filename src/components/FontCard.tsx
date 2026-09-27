import React from "react";
import type { RemoteFont } from "../types/fonts";
import { Download, Check, ShieldCheck, ShieldAlert, Sparkles } from "lucide-react";

interface FontCardProps {
  font: RemoteFont;
  isInstalled: boolean;
  downloadProgress?: number;
  customPreviewText: string;
  onDownload: (font: RemoteFont) => void;
  onUseFont: (family: string) => void;
}

export const FontCard: React.FC<FontCardProps> = ({
  font,
  isInstalled,
  downloadProgress,
  customPreviewText,
  onDownload,
  onUseFont
}) => {
  const isDownloading = downloadProgress !== undefined;
  const isVerified = font.license && font.license.verified;
  const previewText = customPreviewText || font.previewText || "خوش آمدید";

  return (
    <div className={`font-card ${isInstalled ? "installed" : ""}`}>
      <div className="font-card-header">
        <div className="font-card-title-group">
          <h4 className="font-card-name">{font.displayName}</h4>
          <div className="font-tags">
            <span className="tag-category">{font.category}</span>
            {font.languages.slice(0, 2).map((lang) => (
              <span key={lang} className="tag-lang">{lang}</span>
            ))}
          </div>
        </div>

        <div className="license-badge-container">
          {isVerified ? (
            <span className="license-badge verified" title={font.license.name}>
              <ShieldCheck size={12} />
              <span>{font.license.name.split(" ")[0]}</span>
            </span>
          ) : (
            <span className="license-badge unverified" title="License could not be verified">
              <ShieldAlert size={12} />
              <span>Unverified</span>
            </span>
          )}
        </div>
      </div>

      {/* Live Preview Container */}
      <div className="font-card-preview-box">
        <div
          className="font-card-urdu-preview"
          style={{ fontFamily: `"${font.family}", system-ui, sans-serif` }}
        >
          {previewText}
        </div>
        <div className="preview-indicator">
          {isInstalled ? (
            <span className="indicator-text font-active">Actual Font</span>
          ) : (
            <span className="indicator-text font-fallback">Preview Fallback</span>
          )}
        </div>
      </div>

      <div className="font-card-footer">
        <div className="font-source-info">
          <span className="source-label">Source: {font.source}</span>
        </div>

        <div className="font-card-actions">
          {isInstalled ? (
            <>
              <span className="installed-badge">
                <Check size={14} /> Installed
              </span>
              <button
                type="button"
                className="btn btn-emerald btn-sm"
                onClick={() => onUseFont(font.family)}
              >
                <Sparkles size={14} />
                <span>Use Font</span>
              </button>
            </>
          ) : (
            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={() => onDownload(font)}
              disabled={!isVerified || isDownloading}
            >
              <Download size={14} />
              <span>
                {isDownloading
                  ? `Downloading... ${downloadProgress}%`
                  : !isVerified
                  ? "License Unverified"
                  : "Download Font"}
              </span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
