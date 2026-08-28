"use client";

import React, { useEffect, useRef, useState } from "react";
import SplitType from "split-type";
import { gsap, ScrollTrigger, useGSAP, prefersReducedMotion } from "@/lib/gsap";

export interface SplitTextProps {
  text: string;
  className?: string;
  delay?: number;
  duration?: number;
  ease?: string | ((t: number) => number);
  splitType?: "chars" | "words" | "lines" | "words, chars";
  from?: gsap.TweenVars;
  to?: gsap.TweenVars;
  threshold?: number;
  rootMargin?: string;
  tag?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span";
  textAlign?: React.CSSProperties["textAlign"];
  onLetterAnimationComplete?: () => void;
  /** Animate on mount instead of on scroll. */
  immediate?: boolean;
}

const SplitText: React.FC<SplitTextProps> = ({
  text,
  className = "",
  delay = 50,
  duration = 1.25,
  ease = "power3.out",
  splitType = "chars",
  from = { opacity: 0, y: 40 },
  to = { opacity: 1, y: 0 },
  threshold = 0.1,
  rootMargin = "-100px",
  tag = "p",
  textAlign = "center",
  onLetterAnimationComplete,
  immediate = false,
}) => {
  const ref = useRef<HTMLElement>(null);
  const animationCompletedRef = useRef(false);
  const onCompleteRef = useRef(onLetterAnimationComplete);
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    onCompleteRef.current = onLetterAnimationComplete;
  }, [onLetterAnimationComplete]);

  useEffect(() => {
    if (document.fonts.status === "loaded") {
      setFontsLoaded(true);
    } else {
      document.fonts.ready.then(() => setFontsLoaded(true));
    }
  }, []);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el || !text || !fontsLoaded) return;
      if (animationCompletedRef.current) return;

      if (prefersReducedMotion()) {
        gsap.set(el, { opacity: 1 });
        return;
      }

      const types =
        splitType === "words, chars"
          ? "words,chars"
          : splitType;

      const split = new SplitType(el, {
        types,
        tagName: "span",
      });

      const targets =
        (splitType.includes("chars") && split.chars?.length
          ? split.chars
          : splitType.includes("words") && split.words?.length
            ? split.words
            : split.lines) ?? [];

      if (!targets.length) return;

      const startPct = (1 - threshold) * 100;
      const marginMatch = /^(-?\d+(?:\.\d+)?)(px|em|rem|%)?$/.exec(rootMargin);
      const marginValue = marginMatch ? parseFloat(marginMatch[1]) : 0;
      const marginUnit = marginMatch ? marginMatch[2] || "px" : "px";
      const sign =
        marginValue === 0
          ? ""
          : marginValue < 0
            ? `-=${Math.abs(marginValue)}${marginUnit}`
            : `+=${marginValue}${marginUnit}`;
      const start = `top ${startPct}%${sign}`;

      gsap.fromTo(
        targets,
        { ...from },
        {
          ...to,
          duration,
          ease,
          stagger: delay / 1000,
          scrollTrigger: immediate
            ? undefined
            : {
                trigger: el,
                start,
                once: true,
                fastScrollEnd: true,
              },
          delay: immediate ? 0.12 : 0,
          onComplete: () => {
            animationCompletedRef.current = true;
            onCompleteRef.current?.();
          },
          force3D: true,
        },
      );

      return () => {
        ScrollTrigger.getAll().forEach((st) => {
          if (st.trigger === el) st.kill();
        });
        split.revert();
      };
    },
    {
      dependencies: [
        text,
        delay,
        duration,
        ease,
        splitType,
        JSON.stringify(from),
        JSON.stringify(to),
        threshold,
        rootMargin,
        fontsLoaded,
        immediate,
      ],
      scope: ref,
    },
  );

  const style: React.CSSProperties = {
    textAlign,
    wordWrap: "break-word",
    willChange: "transform, opacity",
  };
  const classes = `split-parent overflow-hidden inline-block whitespace-normal ${className}`;

  return React.createElement(tag || "p", { ref, style, className: classes }, text);
};

export default SplitText;
