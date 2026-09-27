import type { StoredFont } from "../types/fonts";
import { CURATED_REMOTE_FONTS } from "../data/fonts";

const activeFontUrls = new Map<string, string>();
const activeFontFaces = new Map<string, FontFace>();
const loadingPromises = new Map<string, Promise<any>>();

export async function loadFontFromBinary(
  family: string,
  data: ArrayBuffer,
  id?: string
): Promise<FontFace> {
  const fontId = id || family;

  // Revoke existing URL if reloading
  if (activeFontUrls.has(fontId)) {
    URL.revokeObjectURL(activeFontUrls.get(fontId)!);
    activeFontUrls.delete(fontId);
  }

  const blob = new Blob([data]);
  const fontUrl = URL.createObjectURL(blob);
  activeFontUrls.set(fontId, fontUrl);

  const fontFace = new FontFace(family, `url(${fontUrl})`);

  try {
    const loadedFace = await fontFace.load();
    document.fonts.add(loadedFace);
    activeFontFaces.set(fontId, loadedFace);
    return loadedFace;
  } catch (error) {
    URL.revokeObjectURL(fontUrl);
    activeFontUrls.delete(fontId);
    console.error(`Failed to load font face "${family}":`, error);
    throw new Error(`Could not load font "${family}". Please verify it is a valid TTF or OTF file.`);
  }
}

export async function loadStoredFont(storedFont: StoredFont): Promise<FontFace> {
  return loadFontFromBinary(storedFont.family, storedFont.data, storedFont.id);
}

export async function loadUploadedFile(file: File): Promise<{ fontFace: FontFace; storedFont: StoredFont }> {
  const arrayBuffer = await file.arrayBuffer();

  // Generate family name from filename
  const rawName = file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ");
  const family = rawName.charAt(0).toUpperCase() + rawName.slice(1);
  const id = `custom-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;

  let format: "ttf" | "otf" | "woff" | "woff2" = "ttf";
  const ext = file.name.split(".").pop()?.toLowerCase();
  if (ext === "otf" || ext === "woff" || ext === "woff2") {
    format = ext;
  }

  const fontFace = await loadFontFromBinary(family, arrayBuffer, id);

  const storedFont: StoredFont = {
    id,
    family,
    displayName: family,
    format,
    data: arrayBuffer,
    source: "uploaded",
    addedAt: Date.now(),
    fileSize: file.size,
    category: "Custom Upload",
    languages: ["Urdu", "Arabic", "English"]
  };

  return { fontFace, storedFont };
}

export async function ensureFontLoaded(family: string): Promise<boolean> {
  if (!family || family === "system-ui" || family === "sans-serif") return true;

  // Check if browser already has this font active
  if (document.fonts.check(`16px "${family}"`)) {
    return true;
  }

  if (loadingPromises.has(family)) {
    await loadingPromises.get(family);
    return true;
  }

  const promise = (async () => {
    try {
      // Try calling browser native font loader first (for Google Fonts CSS loaded via link/import)
      await document.fonts.load(`16px "${family}"`);

      if (document.fonts.check(`16px "${family}"`)) {
        return true;
      }

      // If not active yet, find matching curated remote font file URL
      const remote = CURATED_REMOTE_FONTS.find(
        (f) => f.family.toLowerCase() === family.toLowerCase() || f.displayName.toLowerCase() === family.toLowerCase()
      );

      if (remote && remote.fontFileUrl) {
        const resp = await fetch(remote.fontFileUrl);
        if (resp.ok) {
          const buffer = await resp.arrayBuffer();
          await loadFontFromBinary(family, buffer, remote.id);
          return true;
        }
      }

      await document.fonts.ready;
      return document.fonts.check(`16px "${family}"`);
    } catch (err) {
      console.warn(`Font load attempt for "${family}" failed:`, err);
      return false;
    } finally {
      loadingPromises.delete(family);
    }
  })();

  loadingPromises.set(family, promise);
  return promise;
}

export function unloadFont(id: string, family?: string): void {
  if (activeFontFaces.has(id)) {
    const face = activeFontFaces.get(id)!;
    document.fonts.delete(face);
    activeFontFaces.delete(id);
  }
  if (family && activeFontFaces.has(family)) {
    const face = activeFontFaces.get(family)!;
    document.fonts.delete(face);
    activeFontFaces.delete(family);
  }
  if (activeFontUrls.has(id)) {
    URL.revokeObjectURL(activeFontUrls.get(id)!);
    activeFontUrls.delete(id);
  }
}

export function isFontLoadedInBrowser(family: string): boolean {
  return document.fonts.check(`16px "${family}"`);
}
