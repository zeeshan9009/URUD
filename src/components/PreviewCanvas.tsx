import React, { useState } from "react";
import type { TextSettings } from "../types/editor";
import { useCanvasRenderer } from "../hooks/useCanvasRenderer";
import { ZoomIn, ZoomOut } from "lucide-react";

interface PreviewCanvasProps {
  settings: TextSettings;
  selectedFontFamily: string;
}

export const PreviewCanvas: React.FC<PreviewCanvasProps> = ({ settings, selectedFontFamily }) => {
  const { canvasRef, dimensions } = useCanvasRenderer(settings, selectedFontFamily);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [checkerboardStyle, setCheckerboardStyle] = useState<"light" | "dark" | "solid">("light");

  const exportWidth = dimensions.width * (settings.scale || 2);
  const exportHeight = dimensions.height * (settings.scale || 2);

  return (
    <div className="preview-container">
      {/* Top Preview Status Bar */}
      <div className="preview-header-bar">
        <div className="preview-status-badge">
          <span className="transparency-indicator-dot" />
          <span className="transparency-label">Transparent Canvas (0% Alpha Fill)</span>
        </div>

        <div className="canvas-dimensions-badge">
          <span>Preview: {dimensions.width} × {dimensions.height} px</span>
          <span className="divider">•</span>
          <span className="export-dim">{settings.scale}x PNG: {exportWidth} × {exportHeight} px</span>
        </div>

        {/* View Options */}
        <div className="preview-toolbar">
          <div className="checkerboard-toggle-group">
            <button
              type="button"
              className={`toolbar-btn ${checkerboardStyle === "light" ? "active" : ""}`}
              onClick={() => setCheckerboardStyle("light")}
              title="Light checkerboard pattern"
            >
              Light
            </button>
            <button
              type="button"
              className={`toolbar-btn ${checkerboardStyle === "dark" ? "active" : ""}`}
              onClick={() => setCheckerboardStyle("dark")}
              title="Dark checkerboard pattern"
            >
              Dark
            </button>
          </div>

          <div className="zoom-controls">
            <button
              type="button"
              className="toolbar-icon-btn"
              onClick={() => setZoomLevel(prev => Math.max(0.25, prev - 0.25))}
              title="Zoom Out"
            >
              <ZoomOut size={16} />
            </button>
            <span className="zoom-percentage">{Math.round(zoomLevel * 100)}%</span>
            <button
              type="button"
              className="toolbar-icon-btn"
              onClick={() => setZoomLevel(prev => Math.min(3, prev + 0.25))}
              title="Zoom In"
            >
              <ZoomIn size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Main Canvas Viewport with Checkerboard Grid */}
      <div className={`canvas-viewport checkerboard-${checkerboardStyle}`}>
        <div
          className="canvas-zoom-wrapper"
          style={{ transform: `scale(${zoomLevel})` }}
        >
          <canvas
            ref={canvasRef}
            className="main-render-canvas"
            title="Urdu Text Transparent Canvas Preview"
          />
        </div>
      </div>

      {/* Bottom Information Footer */}
      <div className="preview-footer-bar">
        <div className="font-metric-tag">
          <span>Selected Font: <strong>{selectedFontFamily}</strong></span>
        </div>
        <p className="checkerboard-notice">
          The grid background is for preview UI only. The exported PNG will be 100% transparent around text.
        </p>
      </div>
    </div>
  );
};
