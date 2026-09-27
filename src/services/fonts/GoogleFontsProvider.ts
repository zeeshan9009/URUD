import type { FontProvider } from "./FontProvider";
import type { RemoteFont, FontSearchQuery } from "../../types/fonts";
import { CURATED_REMOTE_FONTS } from "../../data/fonts";

export class GoogleFontsProvider implements FontProvider {
  name = "Google Fonts Catalog";

  async search(query: FontSearchQuery): Promise<RemoteFont[]> {
    const searchStr = query.query.toLowerCase().trim();
    
    return CURATED_REMOTE_FONTS.filter((font) => {
      // Filter by language / script if specified
      if (query.script && query.script.length > 0 && !query.script.includes("All")) {
        const matchesScript = query.script.some(s => 
          font.languages.map(l => l.toLowerCase()).includes(s.toLowerCase())
        );
        if (!matchesScript) return false;
      }

      // Filter by category
      if (query.category && query.category.length > 0 && !query.category.includes("All")) {
        const matchesCat = query.category.some(c => 
          font.category.toLowerCase().includes(c.toLowerCase())
        );
        if (!matchesCat) return false;
      }

      // Filter by text search query
      if (!searchStr) return true;

      const inFamily = font.family.toLowerCase().includes(searchStr);
      const inDisplayName = font.displayName.toLowerCase().includes(searchStr);
      const inCategory = font.category.toLowerCase().includes(searchStr);
      const inLangs = font.languages.some(l => l.toLowerCase().includes(searchStr));

      return inFamily || inDisplayName || inCategory || inLangs;
    });
  }

  async getFontDetails(fontId: string): Promise<RemoteFont | null> {
    const font = CURATED_REMOTE_FONTS.find(f => f.id === fontId);
    return font || null;
  }

  async downloadFont(font: RemoteFont, onProgress?: (percent: number) => void): Promise<ArrayBuffer> {
    // Validate license before downloading
    if (!font.license || !font.license.verified) {
      throw new Error(`License could not be verified for font "${font.displayName}". Automatic download disabled.`);
    }

    const response = await fetch(font.fontFileUrl);

    if (!response.ok) {
      throw new Error(`We couldn't download this font. HTTP status ${response.status}. Check your internet connection or try another font.`);
    }

    const contentLength = response.headers.get("Content-Length");
    const totalBytes = contentLength ? parseInt(contentLength, 10) : 0;

    if (!response.body || totalBytes === 0) {
      // Stream reader not supported or unknown length
      const arrayBuffer = await response.arrayBuffer();
      if (onProgress) onProgress(100);
      return arrayBuffer;
    }

    const reader = response.body.getReader();
    let receivedBytes = 0;
    const chunks: Uint8Array[] = [];

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      chunks.push(value);
      receivedBytes += value.length;

      if (onProgress && totalBytes > 0) {
        const percent = Math.min(99, Math.round((receivedBytes / totalBytes) * 100));
        onProgress(percent);
      }
    }

    const concatenated = new Uint8Array(receivedBytes);
    let position = 0;
    for (const chunk of chunks) {
      concatenated.set(chunk, position);
      position += chunk.length;
    }

    if (onProgress) onProgress(100);

    return concatenated.buffer;
  }
}
