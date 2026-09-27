import { renderTextToCanvas } from "./renderTextToCanvas";
import type { TextSettings } from "../types/editor";
import { ensureFontLoaded } from "../services/fontLoader";

export function generateFilename(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");

  return `urdu-text-${year}-${month}-${day}-${hours}-${minutes}.png`;
}

export async function downloadTransparentPng(
  settings: TextSettings,
  fontFamily: string
): Promise<string> {
  // Ensure font is ready in document.fonts before rendering canvas
  await ensureFontLoaded(fontFamily);
  await document.fonts.ready;

  const scale = settings.scale || 2;
  const canvas = renderTextToCanvas(settings, fontFamily, scale);

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        reject(new Error("Failed to generate transparent PNG blob."));
        return;
      }

      const url = URL.createObjectURL(blob);
      const filename = generateFilename();

      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setTimeout(() => {
        URL.revokeObjectURL(url);
      }, 1000);

      resolve(filename);
    }, "image/png");
  });
}

export async function copyPngToClipboard(
  settings: TextSettings,
  fontFamily: string
): Promise<boolean> {
  // Ensure font is ready in document.fonts before rendering canvas
  await ensureFontLoaded(fontFamily);
  await document.fonts.ready;

  const scale = settings.scale || 2;
  const canvas = renderTextToCanvas(settings, fontFamily, scale);

  if (!navigator.clipboard || typeof ClipboardItem === "undefined") {
    throw new Error("PNG clipboard copying is not supported in this browser.");
  }

  return new Promise((resolve, reject) => {
    canvas.toBlob(async (blob) => {
      if (!blob) {
        reject(new Error("Failed to render PNG for clipboard."));
        return;
      }

      try {
        const item = new ClipboardItem({ "image/png": blob });
        await navigator.clipboard.write([item]);
        resolve(true);
      } catch (err) {
        console.error("Clipboard write failed:", err);
        reject(new Error("PNG clipboard copying failed. Your browser permissions may require direct interaction."));
      }
    }, "image/png");
  });
}
