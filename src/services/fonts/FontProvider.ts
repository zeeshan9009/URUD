import type { RemoteFont, FontSearchQuery } from "../../types/fonts";

export interface FontProvider {
  name: string;
  search(query: FontSearchQuery): Promise<RemoteFont[]>;
  getFontDetails(fontId: string): Promise<RemoteFont | null>;
  downloadFont(font: RemoteFont, onProgress?: (percent: number) => void): Promise<ArrayBuffer>;
}
