export type FontFormat = "ttf" | "otf" | "woff" | "woff2";

export interface FontLicense {
  name: string;
  url?: string;
  verified: boolean;
}

export interface StoredFont {
  id: string;
  family: string;
  displayName: string;
  format: FontFormat;
  data: ArrayBuffer;
  source: "uploaded" | "downloaded" | "bundled";
  sourceUrl?: string;
  licenseName?: string;
  licenseUrl?: string;
  addedAt: number;
  lastUsedAt?: number;
  fileSize: number;
  category?: string;
  languages?: string[];
}

export interface RemoteFont {
  id: string;
  family: string;
  displayName: string;
  category: string;
  languages: string[];
  subsets: string[];
  variants: string[];
  source: string;
  sourceUrl: string;
  fontFileUrl: string;
  license: FontLicense;
  previewText?: string;
  downloaded?: boolean;
}

export interface FontSearchQuery {
  language?: string[];
  script?: string[];
  style?: string[];
  category?: string[];
  query: string;
}

export interface FontDiscoveryIntent {
  query: string;
  language: string[];
  script: string[];
  styles: string[];
  categories: string[];
}
