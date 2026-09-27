import React from "react";
import type { TextSettings } from "../types/editor";
import { Settings as SettingsIcon, HardDrive, Trash2, Sliders, Moon, Sun } from "lucide-react";

interface SettingsProps {
  settings: TextSettings;
  onChangeSettings: (updates: Partial<TextSettings>) => void;
  storageStats: { count: number; totalBytes: number };
  onClearAllFonts: () => Promise<void>;
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
}

export const SettingsPage: React.FC<SettingsProps> = ({
  settings,
  onChangeSettings,
  storageStats,
  onClearAllFonts,
  darkMode,
  setDarkMode
}) => {
  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  return (
    <div className="settings-container">
      <div className="settings-hero">
        <div className="settings-hero-main">
          <div className="hero-icon-bg">
            <SettingsIcon size={24} />
          </div>
          <div>
            <h2>Application Preferences</h2>
            <p className="settings-subtitle">
              Manage IndexedDB storage, export defaults, and theme appearance.
            </p>
          </div>
        </div>
      </div>

      <div className="settings-sections-grid">
        {/* Storage Management Card */}
        <div className="settings-card">
          <div className="card-header-row">
            <HardDrive size={20} className="text-emerald-500" />
            <h3>Font Storage (IndexedDB)</h3>
          </div>
          <div className="card-body">
            <div className="stat-box">
              <div className="stat-row">
                <span className="stat-label">Installed Fonts Count:</span>
                <span className="stat-value">{storageStats.count}</span>
              </div>
              <div className="stat-row">
                <span className="stat-label">IndexedDB Space Used:</span>
                <span className="stat-value">{formatSize(storageStats.totalBytes)}</span>
              </div>
            </div>

            <div className="card-action-row">
              <button
                type="button"
                className="btn btn-danger-ghost"
                onClick={onClearAllFonts}
                disabled={storageStats.count === 0}
              >
                <Trash2 size={16} />
                <span>Clear All Saved Fonts</span>
              </button>
            </div>
          </div>
        </div>

        {/* Export Defaults Card */}
        <div className="settings-card">
          <div className="card-header-row">
            <Sliders size={20} className="text-emerald-500" />
            <h3>Default Canvas & Rendering Defaults</h3>
          </div>
          <div className="card-body">
            <div className="control-group">
              <label htmlFor="defScale">Default Export Resolution Scale</label>
              <div className="segmented-control">
                {[1, 2, 3, 4].map((s) => (
                  <button
                    key={s}
                    type="button"
                    className={`segmented-btn ${settings.scale === s ? "active" : ""}`}
                    onClick={() => onChangeSettings({ scale: s })}
                  >
                    {s}x High-Res
                  </button>
                ))}
              </div>
            </div>

            <div className="control-group">
              <div className="control-label-row">
                <label htmlFor="defPadding">Default Canvas Padding</label>
                <span className="value-badge">{settings.padding}px</span>
              </div>
              <input
                id="defPadding"
                type="range"
                min={0}
                max={200}
                value={settings.padding}
                onChange={(e) => onChangeSettings({ padding: Number(e.target.value) })}
                className="range-slider"
              />
            </div>
          </div>
        </div>

        {/* Appearance Card */}
        <div className="settings-card">
          <div className="card-header-row">
            {darkMode ? <Moon size={20} className="text-emerald-500" /> : <Sun size={20} className="text-emerald-500" />}
            <h3>Appearance & Theme</h3>
          </div>
          <div className="card-body">
            <div className="theme-selection-grid">
              <button
                type="button"
                className={`theme-card-btn ${!darkMode ? "active" : ""}`}
                onClick={() => setDarkMode(false)}
              >
                <Sun size={24} />
                <span>Light Theme</span>
              </button>
              <button
                type="button"
                className={`theme-card-btn ${darkMode ? "active" : ""}`}
                onClick={() => setDarkMode(true)}
              >
                <Moon size={24} />
                <span>Dark Theme</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
