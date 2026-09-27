import React, { useState } from "react";
import type { TextSettings, TabType, ToastMessage } from "./types/editor";
import { useFonts } from "./hooks/useFonts";
import { Header } from "./components/Header";
import { TextEditor } from "./components/TextEditor";
import { FontLibrary } from "./components/FontLibrary";
import { SettingsPage } from "./components/Settings";
import { BannerStudio } from "./components/BannerStudio";
import { FontUploader } from "./components/FontUploader";
import { ToastContainer } from "./components/Toast";
import { downloadTransparentPng, copyPngToClipboard } from "./utils/downloadPng";

const DEFAULT_SETTINGS: TextSettings = {
  text: "اللہ آپ کو خوش رکھے",
  fontFamily: "Noto Nastaliq Urdu",
  fontSize: 90,
  fontWeight: "bold",
  color: "#000000",

  colorType: "solid",
  gradientColor1: "#10b981",
  gradientColor2: "#3b82f6",
  gradientAngle: 90,

  backgroundType: "transparent",
  backgroundColor: "#ffffff",
  bgGradient1: "#0f172a",
  bgGradient2: "#1e293b",
  bgGradientAngle: 90,

  textAlign: "right",
  lineHeight: 1.6,
  letterSpacing: 0,
  padding: 30,
  scale: 2,

  outlineEnabled: false,
  outlineColor: "#ffffff",
  outlineWidth: 4,

  shadowEnabled: false,
  shadowColor: "rgba(0, 0, 0, 0.4)",
  shadowBlur: 8,
  shadowOffsetX: 2,
  shadowOffsetY: 4,

  text3dEnabled: false,
  text3dDepth: 12,
  text3dAngle: 45,
  text3dColor: "#d97706",
  text3dDarken: true,

  isGolden: false,
  goldenPreset: "classic"
};

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>("editor");
  const [settings, setSettings] = useState<TextSettings>(DEFAULT_SETTINGS);
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [showUploader, setShowUploader] = useState<boolean>(false);
  const [isDownloading, setIsDownloading] = useState<boolean>(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const {
    installedFonts,
    storageStats,
    uploadFont,
    deleteFont,
    clearAllFonts
  } = useFonts();

  const addToast = (type: "success" | "error" | "info", message: string) => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const updateSettings = (updates: Partial<TextSettings>) => {
    setSettings((prev) => ({ ...prev, ...updates }));
  };

  const handleDownload = async () => {
    if (!settings.text || settings.text.trim().length === 0) {
      addToast("error", "Please enter Urdu text before exporting PNG.");
      return;
    }

    setIsDownloading(true);
    try {
      const filename = await downloadTransparentPng(settings, settings.fontFamily);
      addToast("success", `Downloaded transparent PNG: ${filename}`);
    } catch (err: any) {
      console.error("Download error:", err);
      addToast("error", err.message || "Failed to generate PNG download.");
    } finally {
      setIsDownloading(false);
    }
  };

  const handleCopy = async () => {
    if (!settings.text || settings.text.trim().length === 0) {
      addToast("error", "Please enter Urdu text before copying PNG.");
      return;
    }

    try {
      await copyPngToClipboard(settings, settings.fontFamily);
      addToast("success", "Transparent PNG copied to clipboard!");
    } catch (err: any) {
      addToast("error", err.message || "PNG clipboard copying is not supported in this browser.");
    }
  };

  const handleReset = () => {
    setSettings(DEFAULT_SETTINGS);
    addToast("info", "All text settings reset to default values.");
  };

  const handleSelectFontAndSwitchToEditor = (family: string) => {
    updateSettings({ fontFamily: family });
    setActiveTab("editor");
    addToast("info", `Selected font: "${family}"`);
  };

  return (
    <div className={`app-shell ${darkMode ? "dark-theme" : "light-theme"}`}>
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        installedCount={installedFonts.length}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
      />

      <main className="app-main-content">
        {activeTab === "editor" && (
          <TextEditor
            settings={settings}
            onChangeSettings={updateSettings}
            installedFonts={installedFonts}
            onOpenUpload={() => setShowUploader(true)}
            onDownload={handleDownload}
            onCopy={handleCopy}
            onReset={handleReset}
            isDownloading={isDownloading}
          />
        )}

        {activeTab === "banner" && (
          <BannerStudio
            installedFonts={installedFonts}
            onToast={addToast}
          />
        )}

        {activeTab === "library" && (
          <FontLibrary
            installedFonts={installedFonts}
            storageStats={storageStats}
            onDeleteFont={deleteFont}
            onClearAllFonts={clearAllFonts}
            onOpenUpload={() => setShowUploader(true)}
            onSelectFont={handleSelectFontAndSwitchToEditor}
          />
        )}

        {activeTab === "settings" && (
          <SettingsPage
            settings={settings}
            onChangeSettings={updateSettings}
            storageStats={storageStats}
            onClearAllFonts={clearAllFonts}
            darkMode={darkMode}
            setDarkMode={setDarkMode}
          />
        )}
      </main>

      {/* Font Uploader Modal */}
      {showUploader && (
        <FontUploader
          onUpload={uploadFont}
          onClose={() => setShowUploader(false)}
          onSuccess={(font) => {
            addToast("success", `Font "${font.displayName}" successfully uploaded and registered!`);
            updateSettings({ fontFamily: font.family });
          }}
          onError={(msg) => addToast("error", msg)}
        />
      )}

      {/* Global Toast Container */}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />
    </div>
  );
};

export default App;
