"use client";

import { ReactLenis, type LenisRef } from "lenis/react";
import { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger, prefersReducedMotion } from "@/lib/gsap";

const MOBILE_QUERY = "(max-width: 1023px)";

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<LenisRef>(null);
  const [reduced, setReduced] = useState(false);
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== "undefined"
      ? window.matchMedia(MOBILE_QUERY).matches
      : false,
  );

  useEffect(() => {
    setReduced(prefersReducedMotion());
  }, []);

  useEffect(() => {
    const mq = window.matchMedia(MOBILE_QUERY);
    const sync = () => setIsMobile(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    // Mobile uses native scroll so horizontal carousels stay swipeable.
    if (reduced || isMobile) return;

    const onScroll = () => ScrollTrigger.update();

    const update = (time: number) => {
      lenisRef.current?.lenis?.raf(time * 1000);
    };

    gsap.ticker.add(update);
    gsap.ticker.lagSmoothing(0);

    let attached: NonNullable<LenisRef["lenis"]> | undefined;

    const tryAttach = () => {
      const lenis = lenisRef.current?.lenis;
      if (!lenis || attached === lenis) return;
      attached = lenis;
      lenis.on("scroll", onScroll);
    };

    tryAttach();
    const poll = window.setInterval(tryAttach, 50);
    window.setTimeout(() => window.clearInterval(poll), 2000);

    const refresh = () => ScrollTrigger.refresh();
    void document.fonts?.ready.then(refresh);
    window.addEventListener("load", refresh);

    return () => {
      window.clearInterval(poll);
      attached?.off("scroll", onScroll);
      gsap.ticker.remove(update);
      window.removeEventListener("load", refresh);
    };
  }, [reduced, isMobile]);

  if (reduced || isMobile) {
    return <>{children}</>;
  }

  return (
    <ReactLenis
      root
      ref={lenisRef}
      options={{
        autoRaf: false,
        lerp: 0.1,
        syncTouch: false,
        smoothWheel: true,
        anchors: true,
      }}
    >
      {children}
    </ReactLenis>
  );
}
