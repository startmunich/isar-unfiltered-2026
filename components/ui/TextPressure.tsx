"use client";

import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "@/lib/gsap";

type Point = { x: number; y: number };

type TextPressureProps = {
  text?: string;
  flex?: boolean;
  width?: boolean;
  weight?: boolean;
  italic?: boolean;
  textColor?: string;
  minFontSize?: number;
  fitChars?: number;
  radius?: number;
  className?: string;
};

function dist(a: Point, b: Point) {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  return Math.sqrt(dx * dx + dy * dy);
}

function getAttr(
  distance: number,
  maxDist: number,
  minVal: number,
  maxVal: number,
) {
  const val = maxVal - Math.abs((maxVal * distance) / maxDist);
  return Math.max(minVal, val + minVal);
}

export function TextPressure({
  text = "Hello!",
  flex = false,
  width = true,
  weight = true,
  italic = false,
  textColor = "#fec700",
  minFontSize = 24,
  fitChars,
  radius,
  className = "",
}: TextPressureProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const spansRef = useRef<(HTMLSpanElement | null)[]>([]);
  const mouseRef = useRef<Point>({ x: -9999, y: -9999 });
  const cursorRef = useRef<Point>({ x: -9999, y: -9999 });
  const primedRef = useRef(false);
  const visibleRef = useRef(true);

  const chars = text.split("");
  const reduced = prefersReducedMotion();
  void minFontSize;
  void fitChars;

  useEffect(() => {
    const container = containerRef.current;
    if (!container || reduced) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        visibleRef.current = entry.isIntersecting;
      },
      { rootMargin: "10% 0px" },
    );
    io.observe(container);
    return () => io.disconnect();
  }, [reduced]);

  useEffect(() => {
    if (reduced) return;

    const arm = (x: number, y: number) => {
      cursorRef.current.x = x;
      cursorRef.current.y = y;
      if (!primedRef.current) {
        mouseRef.current.x = x;
        mouseRef.current.y = y;
        primedRef.current = true;
      }
    };
    const onMove = (e: MouseEvent) => arm(e.clientX, e.clientY);
    const onTouch = (e: TouchEvent) => {
      const t = e.touches[0];
      if (!t) return;
      arm(t.clientX, t.clientY);
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("touchmove", onTouch, { passive: true });

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("touchmove", onTouch);
    };
  }, [reduced]);

  useEffect(() => {
    if (reduced) return;

    let raf = 0;
    const animate = () => {
      mouseRef.current.x += (cursorRef.current.x - mouseRef.current.x) / 8;
      mouseRef.current.y += (cursorRef.current.y - mouseRef.current.y) / 8;

      const title = titleRef.current;
      if (title && visibleRef.current) {
        const hidden = title.closest(".features-overlay");
        const isHidden =
          hidden instanceof HTMLElement &&
          (hidden.style.visibility === "hidden" ||
            getComputedStyle(hidden).visibility === "hidden");

        if (!isHidden) {
          const titleRect = title.getBoundingClientRect();
          const maxDist = (radius ?? titleRect.width / 2) || 1;

          spansRef.current.forEach((span) => {
            if (!span) return;
            const rect = span.getBoundingClientRect();
            const center = {
              x: rect.x + rect.width / 2,
              y: rect.y + rect.height / 2,
            };
            const d = dist(mouseRef.current, center);
            const wdth = width ? getAttr(d, maxDist, 88, 112) : 100;
            const wght = weight ? Math.floor(getAttr(d, maxDist, 500, 900)) : 900;
            const italVal = italic ? getAttr(d, maxDist, 0, 1) : 0;
            const scaleX = width
              ? Math.max(0.88, Math.min(1.12, wdth / 100))
              : 1;

            span.style.fontWeight = String(Math.min(900, Math.max(500, wght)));
            span.style.transform = `scaleX(${scaleX}) skewX(${(-italVal * 8).toFixed(2)}deg)`;
          });
        }
      }

      raf = requestAnimationFrame(animate);
    };

    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, [reduced, width, weight, italic, radius]);

  return (
    <div
      ref={containerRef}
      className={`text-pressure ${className}`.trim()}
      style={{ position: "relative", width: "100%", height: "100%" }}
    >
      <h2
        ref={titleRef}
        className={`text-pressure-title${flex ? " is-flex" : ""}`}
        style={{
          fontFamily: "var(--font-display)",
          textTransform: "uppercase",
          margin: 0,
          textAlign: "left",
          userSelect: "none",
          whiteSpace: "nowrap",
          fontWeight: 900,
          color: textColor,
        }}
      >
        {chars.map((char, i) => (
          <span
            key={`${char}-${i}`}
            ref={(el) => {
              spansRef.current[i] = el;
            }}
            data-char={char}
            style={{
              display: "inline-block",
              color: textColor,
              transformOrigin: "center bottom",
            }}
          >
            {char === " " ? "\u00A0" : char}
          </span>
        ))}
      </h2>
    </div>
  );
}
