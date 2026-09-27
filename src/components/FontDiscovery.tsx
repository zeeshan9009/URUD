import React, { useState, useEffect } from "react";
import type { RemoteFont, FontDiscoveryIntent, StoredFont } from "../types/fonts";
import { FontCard } from "./FontCard";
import { searchRemoteFonts } from "../services/fonts/FontSearchService";
import { FONT_CATEGORIES, FONT_SCRIPTS } from "../data/fontCategories";
import { Search, Sparkles, Filter, RefreshCw } from "lucide-react";

interface FontDiscoveryProps {
  installedFonts: StoredFont[];
  downloadProgress: Record<string, number>;
  onDownload: (font: RemoteFont) => Promise<void>;
  onUseFont: (family: string) => void;
}

export const FontDiscovery: React.FC<FontDiscoveryProps> = ({
  installedFonts,
  downloadProgress,
  onDownload,
  onUseFont
}) => {
  const [searchPrompt, setSearchPrompt] = useState<string>("Urdu Nastaliq fonts");
  const [selectedScript, setSelectedScript] = useState<string>("All");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [previewText, setPreviewText] = useState<string>("خوش آمدید");
  const [results, setResults] = useState<RemoteFont[]>([]);
  const [intent, setIntent] = useState<FontDiscoveryIntent | undefined>(undefined);
  const [isSearching, setIsSearching] = useState<boolean>(false);

  const samplePrompts = [
    "Urdu Nastaliq fonts",
    "Traditional Pakistani Urdu font",
    "Modern Urdu advertising banner",
    "Arabic Naskh font",
    "Elegant Urdu wedding invitation",
    "Bold headline typography"
  ];

  const handleSearch = async (queryToUse?: string) => {
    setIsSearching(true);
    try {
      const q = queryToUse !== undefined ? queryToUse : searchPrompt;
      const { intent: parsedIntent, results: searchResults } = await searchRemoteFonts({
        query: q,
        script: selectedScript !== "All" ? [selectedScript] : undefined,
        category: selectedCategory !== "All" ? [selectedCategory] : undefined
      });

      setIntent(parsedIntent);
      setResults(searchResults);
    } catch (err) {
      console.error("Font search error:", err);
    } finally {
      setIsSearching(false);
    }
  };

  useEffect(() => {
    handleSearch();
  }, [selectedScript, selectedCategory]);

  const isFontInstalled = (id: string, family: string) => {
    return installedFonts.some(f => f.id === id || f.family.toLowerCase() === family.toLowerCase());
  };

  return (
    <div className="discovery-container">
      {/* AI Search Bar Header */}
      <div className="ai-search-hero">
        <div className="search-title-row">
          <Sparkles className="hero-icon" size={24} />
          <h2>AI Font Discovery</h2>
        </div>
        <p className="hero-subtitle">
          Describe what style or language font you need in plain text to find free open-source fonts with verified licenses.
        </p>

        <form
          className="search-input-form"
          onSubmit={(e) => {
            e.preventDefault();
            handleSearch();
          }}
        >
          <div className="search-input-wrapper">
            <Search className="search-icon" size={20} />
            <input
              type="text"
              value={searchPrompt}
              onChange={(e) => setSearchPrompt(e.target.value)}
              placeholder="e.g. Elegant Nastaliq Urdu font for Pakistani banner..."
              className="ai-search-input"
            />
            <button type="submit" className="btn btn-primary search-submit-btn" disabled={isSearching}>
              {isSearching ? <RefreshCw size={16} className="spin-icon" /> : <Sparkles size={16} />}
              <span>Discover Fonts</span>
            </button>
          </div>
        </form>

        {/* Sample Prompt Chips */}
        <div className="prompt-chips-row">
          <span className="chips-label">Try asking:</span>
          {samplePrompts.map((prompt) => (
            <button
              key={prompt}
              type="button"
              className="prompt-chip"
              onClick={() => {
                setSearchPrompt(prompt);
                handleSearch(prompt);
              }}
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>

      {/* AI Intent Interpretation Banner */}
      {intent && (intent.styles.length > 0 || intent.language.length > 0) && (
        <div className="ai-intent-banner">
          <Sparkles size={16} className="text-emerald-500" />
          <span className="intent-text">
            <strong>AI Criteria Extracted:</strong>{" "}
            {intent.language.length > 0 && `Script: [${intent.language.join(", ")}] `}
            {intent.styles.length > 0 && `Style: [${intent.styles.join(", ")}]`}
          </span>
        </div>
      )}

      {/* Controls & Filter Bar */}
      <div className="discovery-filter-bar">
        <div className="filter-controls-group">
          <div className="filter-item">
            <label>Script:</label>
            <div className="chip-segmented">
              {FONT_SCRIPTS.map((script) => (
                <button
                  key={script}
                  type="button"
                  className={`chip-btn ${selectedScript === script ? "active" : ""}`}
                  onClick={() => setSelectedScript(script)}
                >
                  {script}
                </button>
              ))}
            </div>
          </div>

          <div className="filter-item">
            <label>Style Category:</label>
            <div className="chip-segmented">
              {FONT_CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  className={`chip-btn ${selectedCategory === cat ? "active" : ""}`}
                  onClick={() => setSelectedCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Custom Preview Text Editor */}
        <div className="preview-text-input-wrapper">
          <label htmlFor="previewTextEdit">Live Preview Text:</label>
          <input
            id="previewTextEdit"
            type="text"
            value={previewText}
            onChange={(e) => setPreviewText(e.target.value)}
            dir="rtl"
            placeholder="اپنا اردو متن لکھیں..."
            className="preview-text-input"
          />
        </div>
      </div>

      {/* Results Grid */}
      <div className="font-grid">
        {results.length > 0 ? (
          results.map((font) => (
            <FontCard
              key={font.id}
              font={font}
              isInstalled={isFontInstalled(font.id, font.family)}
              downloadProgress={downloadProgress[font.id]}
              customPreviewText={previewText}
              onDownload={onDownload}
              onUseFont={onUseFont}
            />
          ))
        ) : (
          <div className="empty-results-state">
            <Filter size={40} className="text-gray-400" />
            <h3>No fonts match your search criteria</h3>
            <p>Try searching for "Urdu", "Nastaliq", "Naskh" or selecting "All" filters.</p>
          </div>
        )}
      </div>
    </div>
  );
};
