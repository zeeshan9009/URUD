import React, { useState, useRef, useEffect, useCallback } from "react";
import type { UrduTextElement } from "../types/editor";
import type { StoredFont } from "../types/fonts";
import { ensureFontLoaded } from "../services/fontLoader";
import { CURATED_REMOTE_FONTS } from "../data/fonts";
import {
  Sparkles,
  Plus,
  Trash2,
  Copy,
  ArrowUp,
  ArrowDown,
  Download,
  Type,
  Layers,
  Clipboard
} from "lucide-react";

interface UrduNameStudioProps {
  installedFonts: StoredFont[];
  onToast: (type: "success" | "error" | "info", msg: string) => void;
}

// Preset Title & Honorific Items
export const PRESET_URDU_TITLES = [
  { label: "خصوصی خطاب", cat: "القابات" },
  { label: "حضرت علامہ مولانا", cat: "القابات" },
  { label: "مفتی اہل سنت", cat: "عہدے" },
  { label: "مفکر اسلام", cat: "القابات" },
  { label: "خطیب اعظم", cat: "القابات" },
  { label: "زیر صدارت", cat: "القابات" },
  { label: "مہمان خصوصی", cat: "القابات" },
  { label: "زیر سرپرستی", cat: "القابات" },
  { label: "نقابت", cat: "القابات" },
  { label: "ہدیہ نعت", cat: "القابات" },
  { label: "منقبت", cat: "القابات" },
  { label: "شیخ الحدیث", cat: "عہدے" },
  { label: "پروفیسر", cat: "عہدے" },
  { label: "صاحبزادہ", cat: "القابات" },
  { label: "ڈاکٹر", cat: "عہدے" },
  { label: "مدرس جامعہ", cat: "عہدے" },
  { label: "جانشین", cat: "القابات" },
  { label: "مظہر اسلام", cat: "القابات" },
  { label: "صدر مجلس", cat: "القابات" },
  { label: "خصوصی شرکت", cat: "القابات" },
  { label: "پروگرام", cat: "معلومات" },
  { label: "بمقام", cat: "معلومات" },
  { label: "بتاریخ", cat: "معلومات" }
];

// Initial Demo Stack representing typical Pakistani Flex Name Titles (like reference images)
const INITIAL_ELEMENTS: UrduTextElement[] = [
  {
    id: "el-1",
    text: "خصوصی خطاب",
    x: 400,
    y: 120,
    fontSize: 55,
    fontFamily: "Noto Nastaliq Urdu",
    fontWeight: "bold",
    colorType: "gradient",
    color: "#facc15",
    gradientColor1: "#fef08a",
    gradientColor2: "#eab308",
    gradientAngle: 90,
    strokeEnabled: true,
    strokeColor: "#064e3b",
    strokeWidth: 6,
    shadowEnabled: true,
    shadowColor: "rgba(0, 0, 0, 0.7)",
    shadowBlur: 10,
    shadowOffsetX: 3,
    shadowOffsetY: 4,
    extrude3D: true,
    extrudeColor: "#022c22",
    extrudeDepth: 4,
    rotation: 0,
    opacity: 1,
    zIndex: 1
  },
  {
    id: "el-2",
    text: "حضرت علامہ مولانا",
    x: 400,
    y: 220,
    fontSize: 65,
    fontFamily: "Noto Nastaliq Urdu",
    fontWeight: "bold",
    colorType: "solid",
    color: "#ffffff",
    gradientColor1: "#ffffff",
    gradientColor2: "#cbd5e1",
    gradientAngle: 90,
    strokeEnabled: true,
    strokeColor: "#0f172a",
    strokeWidth: 8,
    shadowEnabled: true,
    shadowColor: "rgba(0,0,0,0.8)",
    shadowBlur: 12,
    shadowOffsetX: 4,
    shadowOffsetY: 5,
    extrude3D: true,
    extrudeColor: "#020617",
    extrudeDepth: 5,
    rotation: 0,
    opacity: 1,
    zIndex: 2
  },
  {
    id: "el-3",
    text: "ہاشم حسن رضوی",
    x: 400,
    y: 370,
    fontSize: 115,
    fontFamily: "Noto Nastaliq Urdu",
    fontWeight: "bold",
    colorType: "gradient",
    color: "#facc15",
    gradientColor1: "#fef08a",
    gradientColor2: "#ca8a04",
    gradientAngle: 90,
    strokeEnabled: true,
    strokeColor: "#064e3b",
    strokeWidth: 10,
    shadowEnabled: true,
    shadowColor: "rgba(0, 0, 0, 0.9)",
    shadowBlur: 16,
    shadowOffsetX: 5,
    shadowOffsetY: 7,
    extrude3D: true,
    extrudeColor: "#022c22",
    extrudeDepth: 8,
    rotation: 0,
    opacity: 1,
    zIndex: 3
  },
  {
    id: "el-4",
    text: "خطیب اعظم میانوالی",
    x: 400,
    y: 490,
    fontSize: 50,
    fontFamily: "Noto Nastaliq Urdu",
    fontWeight: "bold",
    colorType: "solid",
    color: "#ffffff",
    gradientColor1: "#ffffff",
    gradientColor2: "#e2e8f0",
    gradientAngle: 90,
    strokeEnabled: true,
    strokeColor: "#166534",
    strokeWidth: 5,
    shadowEnabled: true,
    shadowColor: "rgba(0,0,0,0.6)",
    shadowBlur: 8,
    shadowOffsetX: 2,
    shadowOffsetY: 3,
    extrude3D: false,
    extrudeColor: "#000000",
    extrudeDepth: 0,
    rotation: 0,
    opacity: 1,
    zIndex: 4
  }
];

export const UrduNameStudio: React.FC<UrduNameStudioProps> = ({ installedFonts, onToast }) => {
  const [elements, setElements] = useState<UrduTextElement[]>(INITIAL_ELEMENTS);
  const [selectedId, setSelectedId] = useState<string | null>("el-3");
  
  // Canvas settings
  const [canvasWidth, setCanvasWidth] = useState<number>(800);
  const [canvasHeight, setCanvasHeight] = useState<number>(600);
  const [aspectRatio, setAspectRatio] = useState<string>("4:3");
  const [bgType, setBgType] = useState<"transparent" | "solid" | "gradient">("gradient");
  const [bgColor, setBgColor] = useState<string>("#0f172a");
  const [bgGradient1, setBgGradient1] = useState<string>("#022c22");
  const [bgGradient2, setBgGradient2] = useState<string>("#064e3b");
  const [exportScale, setExportScale] = useState<number>(2);
  const [isExporting, setIsExporting] = useState<boolean>(false);

  // Mouse / Touch Dragging State
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const selectedElement = elements.find((el) => el.id === selectedId) || null;

  // Sync aspect ratio change
  const handleRatioChange = (ratio: string) => {
    setAspectRatio(ratio);
    if (ratio === "1:1") { setCanvasWidth(800); setCanvasHeight(800); }
    else if (ratio === "16:9") { setCanvasWidth(960); setCanvasHeight(540); }
    else if (ratio === "4:3") { setCanvasWidth(800); setCanvasHeight(600); }
    else if (ratio === "3:4") { setCanvasWidth(600); setCanvasHeight(800); }
    else if (ratio === "9:16") { setCanvasWidth(540); setCanvasHeight(960); }
  };

  // Add new element
  const handleAddText = (customText?: string) => {
    const newId = `el-${Date.now()}`;
    const maxZ = elements.reduce((max, el) => Math.max(max, el.zIndex), 0);
    const newEl: UrduTextElement = {
      id: newId,
      text: customText || "اپنا اردو نام درج کریں",
      x: canvasWidth / 2,
      y: canvasHeight / 2,
      fontSize: 60,
      fontFamily: "Noto Nastaliq Urdu",
      fontWeight: "bold",
      colorType: "gradient",
      color: "#facc15",
      gradientColor1: "#fef08a",
      gradientColor2: "#eab308",
      gradientAngle: 90,
      strokeEnabled: true,
      strokeColor: "#0f172a",
      strokeWidth: 6,
      shadowEnabled: true,
      shadowColor: "rgba(0, 0, 0, 0.7)",
      shadowBlur: 10,
      shadowOffsetX: 3,
      shadowOffsetY: 4,
      extrude3D: true,
      extrudeColor: "#020617",
      extrudeDepth: 4,
      rotation: 0,
      opacity: 1,
      zIndex: maxZ + 1
    };

    setElements((prev) => [...prev, newEl]);
    setSelectedId(newId);
    ensureFontLoaded(newEl.fontFamily);
    onToast("success", `Added "${newEl.text}" element to canvas`);
  };

  // Load Preset Full Suite
  const handleLoadFullSuite = () => {
    setElements(INITIAL_ELEMENTS);
    setSelectedId("el-3");
    onToast("info", "Loaded Urdu Flex Name Design Suite!");
  };

  // Update selected element property
  const updateSelected = (updates: Partial<UrduTextElement>) => {
    if (!selectedId) return;
    setElements((prev) =>
      prev.map((el) => {
        if (el.id === selectedId) {
          const updated = { ...el, ...updates };
          if (updates.fontFamily) {
            ensureFontLoaded(updates.fontFamily);
          }
          return updated;
        }
        return el;
      })
    );
  };

  // Duplicate Element
  const handleDuplicate = () => {
    if (!selectedElement) return;
    const newId = `el-${Date.now()}`;
    const maxZ = elements.reduce((max, el) => Math.max(max, el.zIndex), 0);
    const dup: UrduTextElement = {
      ...selectedElement,
      id: newId,
      x: selectedElement.x + 30,
      y: selectedElement.y + 30,
      zIndex: maxZ + 1
    };
    setElements((prev) => [...prev, dup]);
    setSelectedId(newId);
    onToast("info", `Duplicated element "${selectedElement.text}"`);
  };

  // Delete Element
  const handleDelete = (id?: string) => {
    const targetId = id || selectedId;
    if (!targetId) return;
    setElements((prev) => prev.filter((el) => el.id !== targetId));
    if (selectedId === targetId) {
      setSelectedId(null);
    }
  };

  // Layer ordering
  const handleMoveLayer = (direction: "up" | "down") => {
    if (!selectedElement) return;
    const sorted = [...elements].sort((a, b) => a.zIndex - b.zIndex);
    const idx = sorted.findIndex((el) => el.id === selectedElement.id);
    if (idx === -1) return;

    if (direction === "up" && idx < sorted.length - 1) {
      const neighbor = sorted[idx + 1];
      const tempZ = selectedElement.zIndex;
      updateSelected({ zIndex: neighbor.zIndex });
      setElements((prev) =>
        prev.map((e) => (e.id === neighbor.id ? { ...e, zIndex: tempZ } : e))
      );
    } else if (direction === "down" && idx > 0) {
      const neighbor = sorted[idx - 1];
      const tempZ = selectedElement.zIndex;
      updateSelected({ zIndex: neighbor.zIndex });
      setElements((prev) =>
        prev.map((e) => (e.id === neighbor.id ? { ...e, zIndex: tempZ } : e))
      );
    }
  };

  // Ensure fonts for all elements are loaded
  useEffect(() => {
    elements.forEach((el) => {
      ensureFontLoaded(el.fontFamily);
    });
  }, [elements]);

  // Main Canvas Render Logic
  const drawCanvas = useCallback(
    (scale: number = 1): HTMLCanvasElement => {
      const canvas = document.createElement("canvas");
      const w = canvasWidth * scale;
      const h = canvasHeight * scale;
      canvas.width = w;
      canvas.height = h;

      const ctx = canvas.getContext("2d");
      if (!ctx) return canvas;

      // 1. Draw Background
      if (bgType === "solid") {
        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, w, h);
      } else if (bgType === "gradient") {
        const grad = ctx.createLinearGradient(0, 0, w, h);
        grad.addColorStop(0, bgGradient1);
        grad.addColorStop(1, bgGradient2);
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, w, h);
      } else {
        ctx.clearRect(0, 0, w, h);
      }

      // 2. Draw Elements sorted by zIndex ascending
      const sorted = [...elements].sort((a, b) => a.zIndex - b.zIndex);

      sorted.forEach((el) => {
        if (!el.text || el.text.trim().length === 0) return;

        ctx.save();
        ctx.globalAlpha = el.opacity ?? 1;

        const posX = el.x * scale;
        const posY = el.y * scale;
        const fontSizePx = el.fontSize * scale;

        ctx.translate(posX, posY);
        if (el.rotation) {
          ctx.rotate((el.rotation * Math.PI) / 180);
        }

        ctx.font = `${el.fontWeight} ${fontSizePx}px "${el.fontFamily}", system-ui, sans-serif`;
        ctx.direction = "rtl";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        const lines = el.text.split("\n");
        const lineHeightPx = fontSizePx * 1.4;
        const totalH = lines.length * lineHeightPx;
        const startY = -totalH / 2 + lineHeightPx / 2;

        lines.forEach((line, lineIdx) => {
          const ly = startY + lineIdx * lineHeightPx;

          // A. 3D Extrusion Effect
          if (el.extrude3D && el.extrudeDepth > 0) {
            const depthPx = Math.round(el.extrudeDepth * scale);
            ctx.fillStyle = el.extrudeColor || "#000000";
            ctx.strokeStyle = el.extrudeColor || "#000000";
            ctx.lineWidth = el.strokeEnabled ? el.strokeWidth * scale : 1;

            for (let d = depthPx; d > 0; d--) {
              if (el.strokeEnabled) {
                ctx.strokeText(line, d, ly + d);
              }
              ctx.fillText(line, d, ly + d);
            }
          }

          // B. Drop Shadow
          if (el.shadowEnabled) {
            ctx.shadowColor = el.shadowColor || "rgba(0,0,0,0.5)";
            ctx.shadowBlur = (el.shadowBlur || 8) * scale;
            ctx.shadowOffsetX = (el.shadowOffsetX || 3) * scale;
            ctx.shadowOffsetY = (el.shadowOffsetY || 4) * scale;
          } else {
            ctx.shadowColor = "transparent";
          }

          // C. Stroke / Outline
          if (el.strokeEnabled && el.strokeWidth > 0) {
            ctx.strokeStyle = el.strokeColor || "#000000";
            ctx.lineWidth = el.strokeWidth * scale * 2; // centered stroke multiplier
            ctx.lineJoin = "round";
            ctx.miterLimit = 2;
            ctx.strokeText(line, 0, ly);
          }

          // D. Fill Style (Gradient or Solid)
          if (el.colorType === "gradient") {
            const rad = ((el.gradientAngle || 90) * Math.PI) / 180;
            const textWidth = ctx.measureText(line).width || fontSizePx * 2;
            const x1 = -textWidth / 2 * Math.cos(rad);
            const y1 = -lineHeightPx / 2 * Math.sin(rad);
            const x2 = textWidth / 2 * Math.cos(rad);
            const y2 = lineHeightPx / 2 * Math.sin(rad);

            const fillGrad = ctx.createLinearGradient(x1, y1 + ly, x2, y2 + ly);
            fillGrad.addColorStop(0, el.gradientColor1 || "#fef08a");
            fillGrad.addColorStop(1, el.gradientColor2 || "#eab308");
            ctx.fillStyle = fillGrad;
          } else {
            ctx.fillStyle = el.color || "#ffffff";
          }

          ctx.fillText(line, 0, ly);
        });

        ctx.restore();
      });

      return canvas;
    },
    [canvasWidth, canvasHeight, bgType, bgColor, bgGradient1, bgGradient2, elements]
  );

  // Live Canvas Viewport Rendering
  useEffect(() => {
    let active = true;

    const renderPreview = async () => {
      await document.fonts.ready;
      if (!active || !canvasRef.current) return;

      const rendered = drawCanvas(1);
      canvasRef.current.width = rendered.width;
      canvasRef.current.height = rendered.height;

      const ctx = canvasRef.current.getContext("2d");
      if (ctx) {
        ctx.clearRect(0, 0, rendered.width, rendered.height);
        ctx.drawImage(rendered, 0, 0);
      }
    };

    const animId = requestAnimationFrame(renderPreview);
    return () => {
      active = false;
      cancelAnimationFrame(animId);
    };
  }, [drawCanvas]);

  // Drag & Drop Mouse Events on Canvas
  const handleCanvasMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const scaleX = canvasWidth / rect.width;
    const scaleY = canvasHeight / rect.height;

    const clickX = (e.clientX - rect.left) * scaleX;
    const clickY = (e.clientY - rect.top) * scaleY;

    // Find clicked element (topmost first)
    const sorted = [...elements].sort((a, b) => b.zIndex - a.zIndex);
    const hit = sorted.find((el) => {
      const halfSize = (el.fontSize * 1.8) / 2;
      return (
        clickX >= el.x - halfSize * 2 &&
        clickX <= el.x + halfSize * 2 &&
        clickY >= el.y - halfSize &&
        clickY <= el.y + halfSize
      );
    });

    if (hit) {
      setSelectedId(hit.id);
      setIsDragging(true);
      setDragOffset({ x: clickX - hit.x, y: clickY - hit.y });
    } else {
      setSelectedId(null);
    }
  };

  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging || !selectedId || !canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const scaleX = canvasWidth / rect.width;
    const scaleY = canvasHeight / rect.height;

    const mouseX = (e.clientX - rect.left) * scaleX;
    const mouseY = (e.clientY - rect.top) * scaleY;

    const newX = Math.round(mouseX - dragOffset.x);
    const newY = Math.round(mouseY - dragOffset.y);

    setElements((prev) =>
      prev.map((el) => (el.id === selectedId ? { ...el, x: newX, y: newY } : el))
    );
  };

  const handleCanvasMouseUp = () => {
    setIsDragging(false);
  };

  // High-Res Export Download
  const handleDownloadPng = async () => {
    setIsExporting(true);
    try {
      await document.fonts.ready;
      const exportCanvas = drawCanvas(exportScale);

      exportCanvas.toBlob((blob) => {
        if (!blob) {
          onToast("error", "Failed to generate PNG image.");
          setIsExporting(false);
          return;
        }

        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `urdu-flex-name-${Date.now()}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        setTimeout(() => URL.revokeObjectURL(url), 1000);
        onToast("success", `Downloaded High-Res Transparent PNG (${exportScale}x)!`);
        setIsExporting(false);
      }, "image/png");
    } catch (err: any) {
      onToast("error", err.message || "Failed to export image.");
      setIsExporting(false);
    }
  };

  // Copy PNG to Clipboard
  const handleCopyClipboard = async () => {
    try {
      await document.fonts.ready;
      const exportCanvas = drawCanvas(exportScale);

      exportCanvas.toBlob(async (blob) => {
        if (!blob) {
          onToast("error", "Could not create image blob.");
          return;
        }

        try {
          const item = new ClipboardItem({ "image/png": blob });
          await navigator.clipboard.write([item]);
          onToast("success", "Urdu Name PNG copied to clipboard!");
        } catch (err: any) {
          onToast("error", "Clipboard API not supported in this browser.");
        }
      }, "image/png");
    } catch (err: any) {
      onToast("error", "Failed to copy image.");
    }
  };

  return (
    <div className="banner-studio-container urdu-name-studio-root">
      {/* Sidebar Controls */}
      <aside className="editor-sidebar">
        {/* Preset Urdu Titles & Quick Add Card */}
        <div className="control-section">
          <div className="section-header-row">
            <h3 className="section-title">
              <Sparkles size={16} className="text-amber-500 inline mr-1" />
              Urdu Title & Name Presets
            </h3>
            <button
              type="button"
              className="btn btn-inline-sm btn-ghost"
              onClick={handleLoadFullSuite}
              title="Reset to Full Banner Suite"
            >
              Reset Suite
            </button>
          </div>
          <p className="section-subtext">
            Click any title to add to canvas or pick full design layouts:
          </p>

          <div className="preset-chips-flex">
            {PRESET_URDU_TITLES.map((t, idx) => (
              <button
                key={idx}
                type="button"
                className="urdu-title-chip-btn"
                onClick={() => handleAddText(t.label)}
              >
                <Plus size={12} />
                <span>{t.label}</span>
              </button>
            ))}
          </div>

          <button
            type="button"
            className="btn btn-secondary w-full mt-3"
            onClick={() => handleAddText()}
          >
            <Plus size={16} />
            <span>Add Custom Urdu Text Element</span>
          </button>
        </div>

        {/* Selected Element Editor Panel ("edit kar sakta ho all ho") */}
        {selectedElement ? (
          <div className="control-section active-element-editor">
            <div className="section-header-row">
              <h3 className="section-title">Edit Selected Element</h3>
              <div className="layer-actions-row">
                <button
                  type="button"
                  className="icon-btn-sm"
                  onClick={() => handleMoveLayer("up")}
                  title="Bring Forward"
                >
                  <ArrowUp size={14} />
                </button>
                <button
                  type="button"
                  className="icon-btn-sm"
                  onClick={() => handleMoveLayer("down")}
                  title="Send Backward"
                >
                  <ArrowDown size={14} />
                </button>
                <button
                  type="button"
                  className="icon-btn-sm"
                  onClick={handleDuplicate}
                  title="Duplicate Element"
                >
                  <Copy size={14} />
                </button>
                <button
                  type="button"
                  className="icon-btn-sm btn-danger-icon"
                  onClick={() => handleDelete()}
                  title="Delete Element"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>

            {/* Urdu Text Input */}
            <div className="control-group">
              <label>Urdu Text Content</label>
              <textarea
                value={selectedElement.text}
                onChange={(e) => updateSelected({ text: e.target.value })}
                rows={2}
                dir="rtl"
                className="urdu-textarea"
                placeholder="نام یا عنوان درج کریں..."
              />
            </div>

            {/* Font Family & Weight */}
            <div className="control-group-grid">
              <div className="control-group">
                <label>Font Family</label>
                <select
                  value={selectedElement.fontFamily}
                  onChange={(e) => updateSelected({ fontFamily: e.target.value })}
                  className="font-select-input"
                >
                  {installedFonts.length > 0 && (
                    <optgroup label="Installed Local Fonts">
                      {installedFonts.map((f) => (
                        <option key={f.id} value={f.family}>
                          {f.displayName}
                        </option>
                      ))}
                    </optgroup>
                  )}
                  <optgroup label="Curated Urdu Fonts">
                    {CURATED_REMOTE_FONTS.map((f) => (
                      <option key={f.id} value={f.family}>
                        {f.displayName} — {f.category}
                      </option>
                    ))}
                  </optgroup>
                </select>
              </div>

              <div className="control-group">
                <label>Font Weight</label>
                <select
                  value={selectedElement.fontWeight}
                  onChange={(e) =>
                    updateSelected({ fontWeight: e.target.value as "normal" | "bold" })
                  }
                  className="font-select-input"
                >
                  <option value="bold">Bold (جلی)</option>
                  <option value="normal">Normal (سادہ)</option>
                </select>
              </div>
            </div>

            {/* Font Size & Position Sliders */}
            <div className="control-group">
              <div className="control-label-row">
                <label>Font Size</label>
                <span className="value-badge">{selectedElement.fontSize}px</span>
              </div>
              <input
                type="range"
                min={20}
                max={250}
                value={selectedElement.fontSize}
                onChange={(e) => updateSelected({ fontSize: Number(e.target.value) })}
                className="range-slider"
              />
            </div>

            <div className="control-group-grid">
              <div className="control-group">
                <div className="control-label-row">
                  <label>X Position</label>
                  <span className="value-badge">{selectedElement.x}px</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={canvasWidth}
                  value={selectedElement.x}
                  onChange={(e) => updateSelected({ x: Number(e.target.value) })}
                  className="range-slider"
                />
              </div>
              <div className="control-group">
                <div className="control-label-row">
                  <label>Y Position</label>
                  <span className="value-badge">{selectedElement.y}px</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={canvasHeight}
                  value={selectedElement.y}
                  onChange={(e) => updateSelected({ y: Number(e.target.value) })}
                  className="range-slider"
                />
              </div>
            </div>

            {/* Color & Gradient Fill */}
            <div className="control-group">
              <div className="section-header-row">
                <label>Text Fill Style</label>
                <div className="segmented-control scale-control">
                  <button
                    type="button"
                    className={`segmented-btn ${selectedElement.colorType === "solid" ? "active" : ""}`}
                    onClick={() => updateSelected({ colorType: "solid" })}
                  >
                    Solid
                  </button>
                  <button
                    type="button"
                    className={`segmented-btn ${selectedElement.colorType === "gradient" ? "active" : ""}`}
                    onClick={() => updateSelected({ colorType: "gradient" })}
                  >
                    Gradient
                  </button>
                </div>
              </div>

              {selectedElement.colorType === "solid" ? (
                <div className="color-picker-row mt-2">
                  <input
                    type="color"
                    value={selectedElement.color}
                    onChange={(e) => updateSelected({ color: e.target.value })}
                    className="color-swatch-input"
                  />
                  <input
                    type="text"
                    value={selectedElement.color}
                    onChange={(e) => updateSelected({ color: e.target.value })}
                    className="hex-input"
                  />
                </div>
              ) : (
                <div className="mt-2">
                  <div className="control-group-grid">
                    <div className="control-group">
                      <label>Color 1 (Top)</label>
                      <div className="color-picker-row">
                        <input
                          type="color"
                          value={selectedElement.gradientColor1}
                          onChange={(e) => updateSelected({ gradientColor1: e.target.value })}
                          className="color-swatch-input"
                        />
                        <input
                          type="text"
                          value={selectedElement.gradientColor1}
                          onChange={(e) => updateSelected({ gradientColor1: e.target.value })}
                          className="hex-input"
                        />
                      </div>
                    </div>
                    <div className="control-group">
                      <label>Color 2 (Bottom)</label>
                      <div className="color-picker-row">
                        <input
                          type="color"
                          value={selectedElement.gradientColor2}
                          onChange={(e) => updateSelected({ gradientColor2: e.target.value })}
                          className="color-swatch-input"
                        />
                        <input
                          type="text"
                          value={selectedElement.gradientColor2}
                          onChange={(e) => updateSelected({ gradientColor2: e.target.value })}
                          className="hex-input"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Stroke / Outline */}
            <div className="control-group">
              <div className="section-header-row">
                <label>Stroke / Outline</label>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={selectedElement.strokeEnabled}
                    onChange={(e) => updateSelected({ strokeEnabled: e.target.checked })}
                  />
                  <span className="slider round"></span>
                </label>
              </div>

              {selectedElement.strokeEnabled && (
                <div className="mt-2 space-y-3">
                  <div className="color-picker-row">
                    <input
                      type="color"
                      value={selectedElement.strokeColor}
                      onChange={(e) => updateSelected({ strokeColor: e.target.value })}
                      className="color-swatch-input"
                    />
                    <input
                      type="text"
                      value={selectedElement.strokeColor}
                      onChange={(e) => updateSelected({ strokeColor: e.target.value })}
                      className="hex-input"
                    />
                  </div>
                  <div className="control-label-row">
                    <label>Stroke Width</label>
                    <span className="value-badge">{selectedElement.strokeWidth}px</span>
                  </div>
                  <input
                    type="range"
                    min={1}
                    max={25}
                    value={selectedElement.strokeWidth}
                    onChange={(e) => updateSelected({ strokeWidth: Number(e.target.value) })}
                    className="range-slider"
                  />
                </div>
              )}
            </div>

            {/* 3D Flex Depth & Shadow */}
            <div className="control-group">
              <div className="section-header-row">
                <label>3D Flex Depth Effect</label>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={selectedElement.extrude3D}
                    onChange={(e) => updateSelected({ extrude3D: e.target.checked })}
                  />
                  <span className="slider round"></span>
                </label>
              </div>

              {selectedElement.extrude3D && (
                <div className="mt-2 space-y-3">
                  <div className="color-picker-row">
                    <input
                      type="color"
                      value={selectedElement.extrudeColor}
                      onChange={(e) => updateSelected({ extrudeColor: e.target.value })}
                      className="color-swatch-input"
                    />
                    <input
                      type="text"
                      value={selectedElement.extrudeColor}
                      onChange={(e) => updateSelected({ extrudeColor: e.target.value })}
                      className="hex-input"
                    />
                  </div>
                  <div className="control-label-row">
                    <label>3D Extrude Depth</label>
                    <span className="value-badge">{selectedElement.extrudeDepth}px</span>
                  </div>
                  <input
                    type="range"
                    min={1}
                    max={15}
                    value={selectedElement.extrudeDepth}
                    onChange={(e) => updateSelected({ extrudeDepth: Number(e.target.value) })}
                    className="range-slider"
                  />
                </div>
              )}
            </div>

            {/* Drop Shadow */}
            <div className="control-group">
              <div className="section-header-row">
                <label>Drop Shadow</label>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={selectedElement.shadowEnabled}
                    onChange={(e) => updateSelected({ shadowEnabled: e.target.checked })}
                  />
                  <span className="slider round"></span>
                </label>
              </div>

              {selectedElement.shadowEnabled && (
                <div className="mt-2 space-y-3">
                  <div className="control-label-row">
                    <label>Shadow Blur Radius</label>
                    <span className="value-badge">{selectedElement.shadowBlur}px</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={30}
                    value={selectedElement.shadowBlur}
                    onChange={(e) => updateSelected({ shadowBlur: Number(e.target.value) })}
                    className="range-slider"
                  />
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="control-section empty-selection-card">
            <Layers size={32} className="text-gray-400 mb-2" />
            <p>Click any text element on canvas or select from layers to edit properties.</p>
          </div>
        )}

        {/* Canvas Background & Export Options */}
        <div className="control-section">
          <h3 className="section-title">Canvas & Background</h3>
          <div className="aspect-chips-grid">
            {[
              { id: "4:3", label: "4:3 Poster", dim: "800×600" },
              { id: "3:4", label: "3:4 Flex", dim: "600×800" },
              { id: "16:9", label: "16:9 Banner", dim: "960×540" },
              { id: "1:1", label: "1:1 Square", dim: "800×800" }
            ].map((r) => (
              <button
                key={r.id}
                type="button"
                className={`aspect-chip-btn ${aspectRatio === r.id ? "active" : ""}`}
                onClick={() => handleRatioChange(r.id)}
              >
                <span className="ratio-title">{r.label}</span>
                <span className="ratio-dim">{r.dim}</span>
              </button>
            ))}
          </div>

          <div className="control-group mt-3">
            <label>Background Fill</label>
            <div className="segmented-control scale-control">
              <button
                type="button"
                className={`segmented-btn ${bgType === "transparent" ? "active" : ""}`}
                onClick={() => setBgType("transparent")}
              >
                Transparent
              </button>
              <button
                type="button"
                className={`segmented-btn ${bgType === "gradient" ? "active" : ""}`}
                onClick={() => setBgType("gradient")}
              >
                Gradient
              </button>
              <button
                type="button"
                className={`segmented-btn ${bgType === "solid" ? "active" : ""}`}
                onClick={() => setBgType("solid")}
              >
                Solid
              </button>
            </div>

            {bgType === "solid" && (
              <div className="color-picker-row mt-2">
                <input
                  type="color"
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                  className="color-swatch-input"
                />
                <input
                  type="text"
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                  className="hex-input"
                />
              </div>
            )}

            {bgType === "gradient" && (
              <div className="control-group-grid mt-2">
                <div className="control-group">
                  <label>Background 1</label>
                  <div className="color-picker-row">
                    <input
                      type="color"
                      value={bgGradient1}
                      onChange={(e) => setBgGradient1(e.target.value)}
                      className="color-swatch-input"
                    />
                    <input
                      type="text"
                      value={bgGradient1}
                      onChange={(e) => setBgGradient1(e.target.value)}
                      className="hex-input"
                    />
                  </div>
                </div>
                <div className="control-group">
                  <label>Background 2</label>
                  <div className="color-picker-row">
                    <input
                      type="color"
                      value={bgGradient2}
                      onChange={(e) => setBgGradient2(e.target.value)}
                      className="color-swatch-input"
                    />
                    <input
                      type="text"
                      value={bgGradient2}
                      onChange={(e) => setBgGradient2(e.target.value)}
                      className="hex-input"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Export Resolution & Buttons */}
          <div className="control-group mt-3">
            <label>Export Resolution Scale</label>
            <div className="segmented-control scale-control">
              {[1, 2, 3, 4].map((s) => (
                <button
                  key={s}
                  type="button"
                  className={`segmented-btn ${exportScale === s ? "active" : ""}`}
                  onClick={() => setExportScale(s)}
                >
                  <span>{s}x HD</span>
                </button>
              ))}
            </div>
          </div>

          <div className="action-buttons-grid mt-3">
            <button
              type="button"
              className="btn btn-primary btn-large w-full"
              onClick={handleDownloadPng}
              disabled={isExporting}
            >
              <Download size={18} />
              <span>{isExporting ? "Exporting PNG..." : "Download Transparent PNG"}</span>
            </button>

            <button
              type="button"
              className="btn btn-secondary w-full"
              onClick={handleCopyClipboard}
            >
              <Clipboard size={16} />
              <span>Copy PNG to Clipboard</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Interactive Drag & Drop Canvas Area */}
      <main className="editor-preview-column">
        <div className="preview-container" ref={containerRef}>
          <div className="preview-header-bar">
            <div className="preview-status-badge">
              <Type size={16} />
              <span>Urdu Name Designer Canvas</span>
            </div>
            <div className="canvas-dimensions-badge">
              <span>{canvasWidth} × {canvasHeight} px</span>
              <span className="divider">•</span>
              <span className="export-dim">Interactive Drag & Drop Canvas</span>
            </div>
          </div>

          <div
            className={`canvas-viewport ${
              bgType === "transparent" ? "checkerboard-bg" : ""
            }`}
          >
            <div className="canvas-zoom-wrapper" style={{ position: "relative" }}>
              <canvas
                ref={canvasRef}
                className="main-render-canvas urdu-name-canvas"
                onMouseDown={handleCanvasMouseDown}
                onMouseMove={handleCanvasMouseMove}
                onMouseUp={handleCanvasMouseUp}
                onMouseLeave={handleCanvasMouseUp}
                style={{ cursor: isDragging ? "grabbing" : "grab" }}
                title="Drag text elements to position them"
              />

              {/* Layer Selection Badges Overlay */}
              <div className="canvas-elements-overlay">
                {elements.map((el) => {
                  const isSel = el.id === selectedId;
                  return (
                    <div
                      key={el.id}
                      className={`element-selection-ring ${isSel ? "selected" : ""}`}
                      style={{
                        position: "absolute",
                        left: `${(el.x / canvasWidth) * 100}%`,
                        top: `${(el.y / canvasHeight) * 100}%`,
                        transform: "translate(-50%, -50%)",
                        pointerEvents: "none"
                      }}
                    >
                      {isSel && (
                        <div className="element-badge-tag">
                          <span>{el.text}</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Quick Layer Bar at Bottom */}
          <div className="canvas-layers-bar">
            <span className="layers-title">Canvas Layers:</span>
            <div className="layer-pills-row">
              {elements
                .sort((a, b) => b.zIndex - a.zIndex)
                .map((el) => (
                  <button
                    key={el.id}
                    type="button"
                    className={`layer-pill-btn ${selectedId === el.id ? "active" : ""}`}
                    onClick={() => setSelectedId(el.id)}
                  >
                    <span>{el.text}</span>
                    <button
                      type="button"
                      className="pill-del-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(el.id);
                      }}
                      title="Delete element"
                    >
                      ×
                    </button>
                  </button>
                ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
