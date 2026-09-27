import { useEffect, useRef, useState } from "react";
import type { TextSettings } from "../types/editor";
import { renderTextToCanvas } from "../utils/renderTextToCanvas";
import { ensureFontLoaded } from "../services/fontLoader";

export function useCanvasRenderer(settings: TextSettings, fontFamily: string) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [dimensions, setDimensions] = useState<{ width: number; height: number }>({ width: 0, height: 0 });
  const [isRendering, setIsRendering] = useState<boolean>(false);
  const [fontLoaded, setFontLoaded] = useState<boolean>(false);

  // Trigger font loading when fontFamily changes
  useEffect(() => {
    let active = true;
    setFontLoaded(false);

    ensureFontLoaded(fontFamily).then(() => {
      if (active) {
        setFontLoaded(true);
      }
    });

    return () => {
      active = false;
    };
  }, [fontFamily]);

  // Render canvas whenever settings, fontFamily, or fontLoaded state updates
  useEffect(() => {
    let isCancelled = false;
    setIsRendering(true);

    const performRender = async () => {
      // Ensure font is ready in document.fonts before measuring and drawing
      await ensureFontLoaded(fontFamily);
      await document.fonts.ready;

      if (isCancelled) return;

      try {
        const rendered = renderTextToCanvas(settings, fontFamily, 1);

        if (canvasRef.current) {
          const targetCtx = canvasRef.current.getContext("2d");
          if (targetCtx) {
            canvasRef.current.width = rendered.width;
            canvasRef.current.height = rendered.height;
            targetCtx.clearRect(0, 0, rendered.width, rendered.height);
            targetCtx.drawImage(rendered, 0, 0);
          }
        }

        setDimensions({ width: rendered.width, height: rendered.height });
      } catch (err) {
        console.error("Canvas render error:", err);
      } finally {
        if (!isCancelled) {
          setIsRendering(false);
        }
      }
    };

    const animId = requestAnimationFrame(performRender);

    return () => {
      isCancelled = true;
      cancelAnimationFrame(animId);
    };
  }, [settings, fontFamily, fontLoaded]);

  return { canvasRef, dimensions, isRendering };
}
