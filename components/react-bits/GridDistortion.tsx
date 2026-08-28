"use client";

import {
  useEffect,
  useRef,
  useState,
  type RefObject,
} from "react";
import { prefersReducedMotion } from "@/lib/gsap";
import "./GridDistortion.css";

type GridDistortionProps = {
  imageSrc: string;
  grid?: number;
  mouse?: number;
  strength?: number;
  relaxation?: number;
  className?: string;
  pointerRoot?: RefObject<HTMLElement | null>;
};

export default function GridDistortion({
  imageSrc,
  grid = 15,
  mouse = 0.1,
  strength = 0.15,
  relaxation = 0.9,
  className = "",
  pointerRoot,
}: GridDistortionProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [staticMode, setStaticMode] = useState(false);

  useEffect(() => {
    if (prefersReducedMotion()) {
      setStaticMode(true);
      return;
    }

    const coarse =
      typeof window !== "undefined" &&
      window.matchMedia("(pointer: coarse)").matches;
    if (coarse) {
      setStaticMode(true);
      return;
    }

    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;

    const ctx = canvas.getContext("2d", {
      alpha: true,
      colorSpace: "srgb",
    });
    if (!ctx) {
      setStaticMode(true);
      return;
    }

    let disposed = false;
    let raf = 0;
    let resizeObserver: ResizeObserver | null = null;
    const cells = Math.max(4, Math.round(grid));
    const vx = new Float32Array(cells * cells);
    const vy = new Float32Array(cells * cells);
    const mouseState = {
      x: 0.5,
      y: 0.5,
      prevX: 0.5,
      prevY: 0.5,
      vX: 0,
      vY: 0,
    };

    const img = new Image();
    img.decoding = "async";
    img.src = imageSrc;

    const pointerHost = pointerRoot?.current ?? wrap;

    const resize = () => {
      const rect = wrap.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = Math.max(1, Math.round(rect.width));
      const h = Math.max(1, Math.round(rect.height));
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const handlePointerMove = (e: PointerEvent) => {
      const rect = wrap.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      mouseState.vX = x - mouseState.prevX;
      mouseState.vY = y - mouseState.prevY;
      Object.assign(mouseState, { x, y, prevX: x, prevY: y });
    };

    const handlePointerLeave = () => {
      mouseState.vX = 0;
      mouseState.vY = 0;
    };

    const draw = () => {
      if (disposed) return;
      raf = window.requestAnimationFrame(draw);
      if (!img.naturalWidth) return;

      const w = wrap.clientWidth;
      const h = wrap.clientHeight;
      if (!w || !h) return;

      const iw = img.naturalWidth;
      const ih = img.naturalHeight;
      const scale = Math.min(w / iw, h / ih);
      const dw = iw * scale;
      const dh = ih * scale;
      const ox = (w - dw) / 2;
      const oy = (h - dh) / 2;
      const cellW = dw / cells;
      const cellH = dh / cells;
      const srcW = iw / cells;
      const srcH = ih / cells;
      // Same as the original WebGL pass: uv -= 0.02 * offset, offset += strength * 100 * velocity
      const amp = 0.02 * 100 * strength * dw;

      ctx.clearRect(0, 0, w, h);

      for (let j = 0; j < cells; j++) {
        for (let i = 0; i < cells; i++) {
          const idx = i + cells * j;
          const cx = (i + 0.5) / cells;
          const cy = (j + 0.5) / cells;
          const dist = Math.hypot(cx - mouseState.x, cy - mouseState.y);
          if (dist < mouse) {
            const power = Math.min(mouse / Math.max(dist, 0.0001), 10);
            vx[idx] += amp * mouseState.vX * power;
            vy[idx] += amp * mouseState.vY * power;
          }
          vx[idx] *= relaxation;
          vy[idx] *= relaxation;

          ctx.drawImage(
            img,
            i * srcW,
            j * srcH,
            srcW,
            srcH,
            ox + i * cellW + vx[idx],
            oy + j * cellH + vy[idx],
            cellW,
            cellH,
          );
        }
      }

      mouseState.vX *= 0.85;
      mouseState.vY *= 0.85;
    };

    const start = () => {
      if (disposed) return;
      resize();
      draw();
    };

    img.onload = start;
    if (img.complete) start();

    if (window.ResizeObserver) {
      resizeObserver = new ResizeObserver(() => resize());
      resizeObserver.observe(wrap);
    } else {
      window.addEventListener("resize", resize);
    }

    pointerHost.addEventListener("pointermove", handlePointerMove);
    pointerHost.addEventListener("pointerleave", handlePointerLeave);

    return () => {
      disposed = true;
      window.cancelAnimationFrame(raf);
      resizeObserver?.disconnect();
      window.removeEventListener("resize", resize);
      pointerHost.removeEventListener("pointermove", handlePointerMove);
      pointerHost.removeEventListener("pointerleave", handlePointerLeave);
    };
  }, [grid, mouse, strength, relaxation, imageSrc, pointerRoot]);

  if (staticMode) {
    return (
      <div className={`distortion-container ${className}`.trim()}>
        <img src={imageSrc} alt="" />
      </div>
    );
  }

  return (
    <div
      ref={wrapRef}
      className={`distortion-container ${className}`.trim()}
    >
      <canvas ref={canvasRef} />
    </div>
  );
}
