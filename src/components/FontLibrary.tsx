import React, { useState } from "react";
import type { StoredFont } from "../types/fonts";
import { Library, Trash2, HardDrive, Search, Upload, Sparkles, AlertCircle } from "lucide-react";

interface FontLibraryProps {
  installedFonts: StoredFont[];
  storageStats: { count: number; totalBytes: number };
  onDeleteFont: (id: string, family?: string) => Promise<void>;
  onClearAllFonts: () => Promise<void>;
  onOpenUpload: () => void;
  onSelectFont: (family: string) => void;
}

export const FontLibrary: React.FC<FontLibraryProps> = ({
  installedFonts,
  storageStats,
  onDeleteFont,
  onClearAllFonts,
  onOpenUpload,
  onSelectFont
}) => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [fontToDelete, setFontToDelete] = useState<StoredFont | null>(null);
  const [showClearConfirm, setShowClearConfirm] = useState<boolean>(false);

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const filteredFonts = installedFonts.filter(f =>
    f.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    f.family.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (f.category && f.category.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleDeleteConfirm = async () => {
    if (fontToDelete) {
      await onDeleteFont(fontToDelete.id, fontToDelete.family);
      setFontToDelete(null);
    }
  };

  const handleClearConfirm = async () => {
    await onClearAllFonts();
    setShowClearConfirm(false);
  };

  return (
    <div className="library-container">
      {/* Storage Summary Header */}
      <div className="library-hero">
        <div className="library-hero-main">
          <div className="hero-icon-bg">
            <Library size={24} />
          </div>
          <div>
            <h2>Local Font Library (IndexedDB)</h2>
            <p className="library-subtitle">
              All installed fonts are stored in your browser's IndexedDB database and work 100% offline.
            </p>
          </div>
        </div>

        <div className="storage-meter-card">
          <div className="storage-info-row">
            <HardDrive size={18} className="text-emerald-500" />
            <span className="storage-text">
              <strong>{storageStats.count}</strong> {storageStats.count === 1 ? "Font" : "Fonts"} Installed • <strong>{formatSize(storageStats.totalBytes)}</strong> Used
            </span>
          </div>
          <div className="storage-actions">
            <button type="button" className="btn btn-inline-sm" onClick={onOpenUpload}>
              <Upload size={14} />
              <span>Upload File</span>
            </button>
            {installedFonts.length > 0 && (
              <button
                type="button"
                className="btn btn-danger-ghost btn-inline-sm"
                onClick={() => setShowClearConfirm(true)}
              >
                <Trash2 size={14} />
                <span>Clear All</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Filter / Search Bar */}
      <div className="library-search-bar">
        <div className="search-input-wrapper">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search installed fonts by name or style..."
            className="library-search-input"
          />
        </div>
      </div>

      {/* Installed Fonts Table / Cards List */}
      <div className="library-fonts-grid">
        {filteredFonts.length > 0 ? (
          filteredFonts.map((font) => (
            <div key={font.id} className="library-font-card">
              <div className="lib-card-header">
                <div>
                  <h4 className="lib-font-name">{font.displayName}</h4>
                  <div className="lib-badges-row">
                    <span className={`lib-source-badge ${font.source}`}>
                      {font.source === "uploaded" ? "Custom Upload" : "Downloaded"}
                    </span>
                    <span className="lib-format-badge">.{font.format.toUpperCase()}</span>
                    <span className="lib-size-badge">{formatSize(font.fileSize)}</span>
                  </div>
                </div>
                <button
                  type="button"
                  className="lib-delete-btn"
                  onClick={() => setFontToDelete(font)}
                  title="Remove font from IndexedDB"
                >
                  <Trash2 size={16} />
                </button>
              </div>

              {/* Urdu Live Sample */}
              <div className="lib-urdu-preview">
                <p style={{ fontFamily: `"${font.family}", system-ui, sans-serif` }}>
                  خوش آمدید — اللہ آپ کو خوش رکھے
                </p>
              </div>

              <div className="lib-card-footer">
                <span className="lib-date">Added {new Date(font.addedAt).toLocaleDateString()}</span>
                <button
                  type="button"
                  className="btn btn-emerald btn-sm"
                  onClick={() => onSelectFont(font.family)}
                >
                  <Sparkles size={14} />
                  <span>Use in Editor</span>
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="empty-library-state">
            <Library size={44} className="text-gray-400" />
            <h3>No local fonts found</h3>
            <p>Upload a custom .TTF/.OTF file or discover free fonts to build your library.</p>
            <button type="button" className="btn btn-primary mt-4" onClick={onOpenUpload}>
              <Upload size={16} />
              <span>Upload Your First Font</span>
            </button>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {fontToDelete && (
        <div className="modal-backdrop">
          <div className="modal-card modal-confirm">
            <div className="modal-header">
              <div className="modal-title-group">
                <AlertCircle size={22} className="text-rose-500" />
                <h3 className="modal-title">Delete Font</h3>
              </div>
            </div>
            <div className="modal-body">
              <p>
                Are you sure you want to remove <strong>"{fontToDelete.displayName}"</strong> from your local browser font library?
              </p>
              <p className="subtext">This action will delete the font binary stored in IndexedDB.</p>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-ghost" onClick={() => setFontToDelete(null)}>
                Cancel
              </button>
              <button type="button" className="btn btn-danger" onClick={handleDeleteConfirm}>
                Remove Font
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Clear All Confirmation Modal */}
      {showClearConfirm && (
        <div className="modal-backdrop">
          <div className="modal-card modal-confirm">
            <div className="modal-header">
              <div className="modal-title-group">
                <AlertCircle size={22} className="text-rose-500" />
                <h3 className="modal-title">Clear All Local Fonts</h3>
              </div>
            </div>
            <div className="modal-body">
              <p>
                This will remove all downloaded and uploaded fonts (<strong>{installedFonts.length} fonts</strong>, {formatSize(storageStats.totalBytes)}) from this browser's IndexedDB database.
              </p>
              <p className="subtext">This cannot be undone. Are you sure you want to continue?</p>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-ghost" onClick={() => setShowClearConfirm(false)}>
                Cancel
              </button>
              <button type="button" className="btn btn-danger" onClick={handleClearConfirm}>
                Clear All Fonts
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
