import React from "react";
import type { TabType } from "../types/editor";
import { Type, Library, Layout, Settings, Sun, Moon, Sparkles } from "lucide-react";

interface HeaderProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  installedCount: number;
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  installedCount,
  darkMode,
  setDarkMode
}) => {
  return (
    <header className="app-header">
      <div className="header-brand">
        <div className="logo-badge">
          <Sparkles className="logo-icon" size={22} />
        </div>
        <div className="title-container">
          <h1 className="app-title">Urdu Text PNG Maker</h1>
          <span className="app-subtitle">AI Font Studio & Transparent PNG Generator</span>
        </div>
      </div>

      <nav className="header-nav">
        <button
          type="button"
          className={`nav-btn ${activeTab === "editor" ? "active" : ""}`}
          onClick={() => setActiveTab("editor")}
        >
          <Type size={16} />
          <span>Editor</span>
        </button>

        <button
          type="button"
          className={`nav-btn ${activeTab === "banner" ? "active" : ""}`}
          onClick={() => setActiveTab("banner")}
        >
          <Layout size={16} />
          <span>Banner Studio</span>
        </button>

        <button
          type="button"
          className={`nav-btn ${activeTab === "library" ? "active" : ""}`}
          onClick={() => setActiveTab("library")}
        >
          <Library size={16} />
          <span>Font Library</span>
          {installedCount > 0 && <span className="count-badge">{installedCount}</span>}
        </button>

        <button
          type="button"
          className={`nav-btn ${activeTab === "settings" ? "active" : ""}`}
          onClick={() => setActiveTab("settings")}
        >
          <Settings size={16} />
          <span>Settings</span>
        </button>
      </nav>

      <div className="header-actions">
        <button
          type="button"
          className="theme-toggle-btn"
          onClick={() => setDarkMode(!darkMode)}
          title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
          aria-label="Toggle dark mode"
        >
          {darkMode ? <Sun size={18} /> : <Moon size={18} />}
        </button>
      </div>
    </header>
  );
};
