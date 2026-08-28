"use client";

import { type RefObject, useRef } from "react";
import { gsap, ScrollTrigger, useGSAP, prefersReducedMotion } from "@/lib/gsap";

type Setup = (ctx: {
  el: HTMLElement;
  gsap: typeof gsap;
  ScrollTrigger: typeof ScrollTrigger;
}) => void | (() => void);

/**
 * Creates a section's ScrollTriggers only when it nears the viewport.
 * Pinning/scrubbing should live inside `setup`, not on first paint of the page.
 */
export function useSectionTrigger(
  ref: RefObject<HTMLElement | null>,
  setup: Setup,
  deps: unknown[] = [],
) {
  const ran = useRef(false);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;

      if (prefersReducedMotion()) return;

      let teardown: void | (() => void);
      const run = () => {
        if (ran.current) return;
        ran.current = true;
        teardown = setup({ el, gsap, ScrollTrigger });
      };

      const probe = ScrollTrigger.create({
        trigger: el,
        start: "top bottom+=40%",
        end: "bottom top-=40%",
        onEnter: run,
        onEnterBack: run,
      });

      if (probe.isActive) run();

      return () => {
        probe.kill();
        teardown?.();
        ran.current = false;
      };
    },
    { scope: ref, dependencies: deps },
  );
}
