import React, { useState, useRef } from "react";
import type { StoredFont } from "../types/fonts";
import { Upload, X } from "lucide-react";

interface FontUploaderProps {
  onUpload: (file: File) => Promise<StoredFont>;
  onClose: () => void;
  onSuccess: (font: StoredFont) => void;
  onError: (msg: string) => void;
}

export const FontUploader: React.FC<FontUploaderProps> = ({
  onUpload,
  onClose,
  onSuccess,
  onError
}) => {
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const processFile = async (file: File) => {
    setIsUploading(true);
    try {
      const font = await onUpload(file);
      onSuccess(font);
      onClose();
    } catch (err: any) {
      onError(err.message || "Could not load this font. Please upload a valid TTF or OTF file.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-card">
        <div className="modal-header">
          <div className="modal-title-group">
            <Upload size={20} className="text-emerald-500" />
            <h3 className="modal-title">Upload Custom Urdu Font</h3>
          </div>
          <button type="button" className="modal-close-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div
          className={`dropzone ${isDragging ? "dragging" : ""} ${isUploading ? "uploading" : ""}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".ttf,.otf,.woff,.woff2"
            onChange={handleFileChange}
            className="hidden-file-input"
          />

          <div className="dropzone-content">
            <div className="dropzone-icon-bg">
              <Upload size={32} />
            </div>
            <h4>{isUploading ? "Processing Font..." : "Drag & Drop Font File"}</h4>
            <p className="dropzone-subtitle">or click to browse from your device</p>

            <div className="format-badges">
              <span className="badge">.TTF</span>
              <span className="badge">.OTF</span>
              <span className="badge">.WOFF</span>
              <span className="badge">.WOFF2</span>
            </div>
          </div>
        </div>

        <div className="modal-footer-notes">
          <p>
            Font files are processed locally in your browser and saved to local IndexedDB. No files are uploaded to an external server.
          </p>
        </div>
      </div>
    </div>
  );
};
