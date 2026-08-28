"use client";

import { useLenis } from "lenis/react";
import type Lenis from "lenis";
import type { VirtualScrollData } from "lenis";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger, prefersReducedMotion } from "@/lib/gsap";
import { SNAP_REFRESH_EVENT } from "@/lib/snap";

/**
 * Desktop snap via Lenis.scrollTo only (no ScrollTrigger.snap — fights Lenis).
 * All DOM queries scoped to `.desktop-only` — mobile tree shares duplicate IDs.
 *
 * Free-scroll corridors (snap at edges only):
 * - #apply-form: Tally embed
 * - #intro: pinned GSAP scrub timeline
 */
function easeInOutCubic(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

const CORRIDOR_EDGE = 32;
const REST_MERGE = 48;

type ZoneBounds = { top: number; bottom: number; exit: number };

type SnapContext = {
  root: HTMLElement;
  lenis: Lenis;
};

function zoneBounds(el: HTMLElement, lenis: Lenis): ZoneBounds {
  const y = lenis.scroll;
  const top = el.getBoundingClientRect().top + y;
  const bottom = top + el.offsetHeight;
  const exit = Math.max(top, bottom - window.innerHeight);
  return { top, bottom, exit };
}

function getApplyCorridorBounds(ctx: SnapContext): ZoneBounds | null {
  const el = ctx.root.querySelector<HTMLElement>("#apply-form");
  return el ? zoneBounds(el, ctx.lenis) : null;
}

/** Intro corridor matches ScrollTrigger pin range, not raw offsetHeight. */
function getIntroBounds(ctx: SnapContext): ZoneBounds | null {
  const intro = ctx.root.querySelector<HTMLElement>("#intro");
  if (!intro) return null;

  const pin = ScrollTrigger.getAll().find((t) => t.trigger === intro && t.pin);

  if (pin) {
    const vh = window.innerHeight;
    const top = pin.start;
    const bottom = pin.end;
    const exit = Math.max(top, bottom - vh);
    return { top, bottom, exit };
  }

  return zoneBounds(intro, ctx.lenis);
}

/** Free Lenis scroll inside a zone; snap only at true edges. */
function shouldFreeScrollZone(
  scrollY: number,
  deltaY: number,
  bounds: ZoneBounds | null,
) {
  if (!bounds) return false;

  const { top, exit, bottom } = bounds;

  if (scrollY < top - CORRIDOR_EDGE || scrollY > exit + CORRIDOR_EDGE) {
    return false;
  }

  const corridor = exit - top;
  const hasInterior = corridor > CORRIDOR_EDGE * 2;

  // Section fits ~one viewport — pass wheel to Lenis so the form stays usable
  if (!hasInterior) {
    return (
      scrollY >= top - CORRIDOR_EDGE && scrollY <= bottom + CORRIDOR_EDGE
    );
  }

  if (deltaY < 0 && scrollY <= top + CORRIDOR_EDGE) return false;
  if (deltaY > 0 && scrollY >= exit - CORRIDOR_EDGE) return false;
  return true;
}

function shouldFreeScrollCorridor(
  scrollY: number,
  deltaY: number,
  ctx: SnapContext,
) {
  return shouldFreeScrollZone(
    scrollY,
    deltaY,
    getApplyCorridorBounds(ctx),
  );
}

function shouldFreeScrollIntro(
  scrollY: number,
  deltaY: number,
  ctx: SnapContext,
) {
  return shouldFreeScrollZone(scrollY, deltaY, getIntroBounds(ctx));
}

function shouldFreeScroll(
  scrollY: number,
  deltaY: number,
  ctx: SnapContext,
  wheelTarget?: EventTarget | null,
) {
  if (
    shouldFreeScrollCorridor(scrollY, deltaY, ctx) ||
    shouldFreeScrollIntro(scrollY, deltaY, ctx)
  ) {
    return true;
  }

  if (!(wheelTarget instanceof Element)) return false;
  if (!wheelTarget.closest(".apply-form, .apply-embed-hit")) return false;

  const bounds = getApplyCorridorBounds(ctx);
  if (!bounds) return false;

  const { top, exit, bottom } = bounds;
  if (scrollY < top - CORRIDOR_EDGE || scrollY > bottom + CORRIDOR_EDGE) {
    return false;
  }

  const hasInterior = exit - top > CORRIDOR_EDGE * 2;
  if (!hasInterior) return true;

  if (scrollY >= exit - CORRIDOR_EDGE && deltaY > 0) return false;
  return true;
}

function collectRests(ctx: SnapContext) {
  const { root, lenis } = ctx;
  const y = lenis.scroll;
  const max = Math.round(lenis.limit);
  const raw: number[] = [];

  const push = (n: number) => {
    raw.push(Math.round(Math.max(0, Math.min(n, max))));
  };

  root.querySelectorAll<HTMLElement>(".js-snap").forEach((el) => {
    push(el.getBoundingClientRect().top + y);
  });

  const form = root.querySelector<HTMLElement>("#apply-form");
  if (form) {
    const { top, exit } = zoneBounds(form, lenis);
    push(top);
    if (exit - top > REST_MERGE) push(exit);
  }

  const introBounds = getIntroBounds(ctx);
  if (introBounds) {
    push(introBounds.top);
    if (introBounds.exit - introBounds.top > REST_MERGE) {
      push(introBounds.exit);
    }
  }

  const uniq: number[] = [];
  for (const p of raw.sort((a, b) => a - b)) {
    if (!uniq.length || p - uniq[uniq.length - 1]! > REST_MERGE) uniq.push(p);
  }
  return uniq;
}

export function SnapSections() {
  const lenis = useLenis();

  useGSAP(
    () => {
      if (prefersReducedMotion() || !lenis) return;

      const mm = gsap.matchMedia();
      mm.add("(min-width: 1024px)", () => {
        const root = document.querySelector<HTMLElement>(".desktop-only");
        if (!root) return;

        const ctx: SnapContext = { root, lenis };

        let busy = false;
        let acc = 0;
        let accTimer = 0;
        let unlockTimer = 0;
        let refreshTimer = 0;
        let rests = collectRests(ctx);
        const prevVirtual = lenis.options.virtualScroll;

        const refreshRests = () => {
          rests = collectRests(ctx);
        };

        const snapTo = (target: number) => {
          const current = lenis.scroll;
          if (Math.abs(target - current) < 8) return;

          busy = true;
          acc = 0;
          const dist = Math.abs(target - current);
          const duration = gsap.utils.clamp(
            0.55,
            0.85,
            (dist / window.innerHeight) * 0.7,
          );

          window.clearTimeout(unlockTimer);
          unlockTimer = window.setTimeout(() => {
            busy = false;
          }, duration * 1000 + 160);

          lenis.scrollTo(target, {
            duration,
            easing: easeInOutCubic,
            lock: true,
            programmatic: true,
            onComplete: () => {
              busy = false;
              window.clearTimeout(unlockTimer);
              ScrollTrigger.update();
            },
          });
        };

        const go = (dir: 1 | -1) => {
          if (busy) return;
          if (document.documentElement.dataset.menuOpen === "true") return;

          refreshRests();
          const current = lenis.scroll;
          const target =
            dir === 1
              ? rests.find((t) => t > current + 24)
              : [...rests].reverse().find((t) => t < current - 24);

          if (target == null) return;
          snapTo(target);
        };

        const onSnapRefresh = () => {
          const saved = lenis.scroll;
          refreshRests();
          ScrollTrigger.refresh();
          requestAnimationFrame(() => {
            lenis.scrollTo(saved, {
              immediate: true,
              force: true,
              lock: false,
            });
            refreshRests();
            ScrollTrigger.update();
          });
        };

        const scheduleRefresh = () => {
          window.clearTimeout(refreshTimer);
          refreshTimer = window.setTimeout(onSnapRefresh, 200);
        };

        lenis.options.virtualScroll = (data: VirtualScrollData) => {
          if (prevVirtual?.(data) === false) return false;

          const target = data.event.target;
          const inGallery =
            target instanceof Element &&
            target.closest(".circular-gallery");
          const wheel = data.event as WheelEvent;
          const sideways =
            inGallery &&
            Math.abs(wheel.deltaX || 0) > Math.abs(wheel.deltaY || data.deltaY);

          if (sideways) return false;

          if (
            shouldFreeScroll(lenis.scroll, data.deltaY, ctx, data.event.target)
          ) {
            return true;
          }

          if (data.event.cancelable) data.event.preventDefault();

          if (busy || document.documentElement.dataset.menuOpen === "true") {
            return false;
          }

          acc += data.deltaY;
          window.clearTimeout(accTimer);
          accTimer = window.setTimeout(() => {
            acc = 0;
          }, 140);

          if (Math.abs(acc) < 42) return false;

          const dir: 1 | -1 = acc > 0 ? 1 : -1;
          acc = 0;
          go(dir);
          return false;
        };

        const onKey = (e: KeyboardEvent) => {
          if (document.documentElement.dataset.menuOpen === "true") return;
          const tag = (e.target as HTMLElement | null)?.tagName;
          if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;

          let deltaY = 0;
          if (
            e.key === "ArrowDown" ||
            e.key === "PageDown" ||
            (e.key === " " && !e.shiftKey)
          ) {
            deltaY = 1;
          } else if (
            e.key === "ArrowUp" ||
            e.key === "PageUp" ||
            (e.key === " " && e.shiftKey)
          ) {
            deltaY = -1;
          } else {
            return;
          }

          if (shouldFreeScroll(lenis.scroll, deltaY, ctx, e.target)) {
            return;
          }

          e.preventDefault();
          go(deltaY > 0 ? 1 : -1);
        };

        window.addEventListener("keydown", onKey);
        window.addEventListener(SNAP_REFRESH_EVENT, scheduleRefresh);
        ScrollTrigger.addEventListener("refresh", refreshRests);

        refreshRests();
        requestAnimationFrame(refreshRests);

        return () => {
          lenis.options.virtualScroll = prevVirtual;
          window.removeEventListener("keydown", onKey);
          window.removeEventListener(SNAP_REFRESH_EVENT, scheduleRefresh);
          ScrollTrigger.removeEventListener("refresh", refreshRests);
          window.clearTimeout(accTimer);
          window.clearTimeout(unlockTimer);
          window.clearTimeout(refreshTimer);
        };
      });

      return () => mm.revert();
    },
    { dependencies: [lenis] },
  );

  return null;
}
