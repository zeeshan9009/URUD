import { useState, useEffect, useCallback } from "react";
import type { StoredFont, RemoteFont } from "../types/fonts";
import {
  getAllFonts,
  saveFont,
  deleteFont as removeStoredFont,
  hasFont,
  clearFonts as clearDBFonts,
  getStorageStats
} from "../services/fontDatabase";
import {
  loadStoredFont,
  loadUploadedFile,
  unloadFont
} from "../services/fontLoader";
import { downloadAndGetBuffer } from "../services/fonts/FontSearchService";
import { validateFontFile } from "../utils/fontValidation";

export function useFonts() {
  const [installedFonts, setInstalledFonts] = useState<StoredFont[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [downloadProgress, setDownloadProgress] = useState<Record<string, number>>({});
  const [storageStats, setStorageStats] = useState<{ count: number; totalBytes: number }>({ count: 0, totalBytes: 0 });

  const refreshFonts = useCallback(async () => {
    try {
      const fonts = await getAllFonts();
      setInstalledFonts(fonts);

      // Load all stored fonts into document.fonts in parallel
      await Promise.allSettled(
        fonts.map(async (font) => {
          try {
            await loadStoredFont(font);
          } catch (err) {
            console.warn(`Could not register stored font "${font.family}" on startup:`, err);
          }
        })
      );

      const stats = await getStorageStats();
      setStorageStats(stats);
    } catch (err) {
      console.error("Failed to initialize fonts from IndexedDB:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshFonts();
  }, [refreshFonts]);

  const uploadFont = async (file: File): Promise<StoredFont> => {
    const validation = validateFontFile(file);
    if (!validation.valid) {
      throw new Error(validation.error || "Invalid font file.");
    }

    const { storedFont } = await loadUploadedFile(file);
    await saveFont(storedFont);
    await refreshFonts();
    return storedFont;
  };

  const downloadRemoteFont = async (
    remoteFont: RemoteFont,
    onProgress?: (percent: number) => void
  ): Promise<StoredFont> => {
    const alreadyInstalled = await hasFont(remoteFont.id);
    if (alreadyInstalled) {
      const existing = installedFonts.find(f => f.id === remoteFont.id);
      if (existing) return existing;
    }

    setDownloadProgress(prev => ({ ...prev, [remoteFont.id]: 1 }));

    try {
      const buffer = await downloadAndGetBuffer(remoteFont, (percent) => {
        setDownloadProgress(prev => ({ ...prev, [remoteFont.id]: percent }));
        if (onProgress) onProgress(percent);
      });

      const fontFace = new FontFace(remoteFont.family, buffer);
      const loaded = await fontFace.load();
      document.fonts.add(loaded);

      let format: "ttf" | "otf" | "woff" | "woff2" = "ttf";
      if (remoteFont.fontFileUrl.endsWith(".otf")) format = "otf";
      if (remoteFont.fontFileUrl.endsWith(".woff")) format = "woff";
      if (remoteFont.fontFileUrl.endsWith(".woff2")) format = "woff2";

      const storedFont: StoredFont = {
        id: remoteFont.id,
        family: remoteFont.family,
        displayName: remoteFont.displayName,
        format,
        data: buffer,
        source: "downloaded",
        sourceUrl: remoteFont.sourceUrl,
        licenseName: remoteFont.license.name,
        licenseUrl: remoteFont.license.url,
        addedAt: Date.now(),
        fileSize: buffer.byteLength,
        category: remoteFont.category,
        languages: remoteFont.languages
      };

      await saveFont(storedFont);
      await refreshFonts();
      return storedFont;
    } finally {
      setDownloadProgress(prev => {
        const copy = { ...prev };
        delete copy[remoteFont.id];
        return copy;
      });
    }
  };

  const deleteFont = async (id: string, family?: string): Promise<void> => {
    unloadFont(id, family);
    await removeStoredFont(id);
    await refreshFonts();
  };

  const clearAllFonts = async (): Promise<void> => {
    installedFonts.forEach(font => unloadFont(font.id, font.family));
    await clearDBFonts();
    await refreshFonts();
  };

  return {
    installedFonts,
    loading,
    downloadProgress,
    storageStats,
    uploadFont,
    downloadRemoteFont,
    deleteFont,
    clearAllFonts,
    refreshFonts
  };
}
