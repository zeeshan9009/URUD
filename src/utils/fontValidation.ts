const MAX_FONT_SIZE_BYTES = 25 * 1024 * 1024; // 25 MB max
const ALLOWED_EXTENSIONS = ["ttf", "otf", "woff", "woff2"];

export interface FontValidationResult {
  valid: boolean;
  error?: string;
  extension?: string;
}

export function validateFontFile(file: File): FontValidationResult {
  if (!file) {
    return { valid: false, error: "No file selected." };
  }

  if (file.size > MAX_FONT_SIZE_BYTES) {
    return {
      valid: false,
      error: `Font file size (${(file.size / (1024 * 1024)).toFixed(1)} MB) exceeds maximum allowed size of 25 MB.`
    };
  }

  const extension = file.name.split(".").pop()?.toLowerCase();
  if (!extension || !ALLOWED_EXTENSIONS.includes(extension)) {
    return {
      valid: false,
      error: `Invalid file extension ".${extension}". Please upload a valid TTF, OTF, WOFF, or WOFF2 font file.`
    };
  }

  return { valid: true, extension };
}
