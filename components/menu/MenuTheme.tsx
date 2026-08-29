"use client";

import { useEffect } from "react";
import { gsap, ScrollTrigger, prefersReducedMotion } from "@/lib/gsap";

function frameRoot() {
  const mobile = window.matchMedia("(max-width: 1023px)").matches;
  return document.querySelector<HTMLElement>(
    mobile ? ".mobile-only" : ".desktop-only",
  );
}

function isShown(el: HTMLElement) {
  const s = getComputedStyle(el);
  return (
    s.display !== "none" &&
    s.visibility !== "hidden" &&
    el.getBoundingClientRect().height > 1
  );
}

function themeFromPoint(x: number, y: number) {
  const stack = document.elementsFromPoint(x, y);
  for (const node of stack) {
    if (!(node instanceof HTMLElement)) continue;
    if (node.closest(".menu-trigger, .menu-overlay, .parked-iu26")) continue;
    if (node.tagName === "CANVAS" || node.closest(".distortion-container")) {
      continue;
    }
    const frame = node.closest<HTMLElement>("[data-frame-theme]");
    if (frame && isShown(frame)) {
      return frame.dataset.frameTheme ?? "yellow";
    }
  }
  return null;
}

function themeAtProbe() {
  const root = frameRoot();
  const trigger = document.querySelector(".menu-trigger");
  const r = trigger?.getBoundingClientRect();
  const underMenu = themeFromPoint(
    r ? r.left + r.width / 2 : 40,
    r ? r.top + r.height / 2 : 40,
  );
  if (underMenu) return underMenu;

  const probe = window.innerHeight * 0.4;
  let theme = "yellow";
  let best = Number.POSITIVE_INFINITY;

  const scope = root ?? document;
  scope.querySelectorAll<HTMLElement>("[data-frame-theme]").forEach((frame) => {
    if (!isShown(frame)) return;
    const rect = frame.getBoundingClientRect();
    if (rect.top > probe || rect.bottom <= probe) return;
    if (rect.height < best) {
      best = rect.height;
      theme = frame.dataset.frameTheme ?? "yellow";
    }
  });

  return theme;
}

function isMobileChrome() {
  return window.matchMedia("(max-width: 1023px)").matches;
}

function chromeShouldShow() {
  if (isMobileChrome()) return true;
  if (document.documentElement.dataset.menuOpen === "true") return true;

  const root = frameRoot();
  if (!root) return true;

  const vh = window.innerHeight;
  const landing = root.querySelector<HTMLElement>("#landing");
  if (landing) {
    const rect = landing.getBoundingClientRect();
    if (rect.bottom > vh * 0.55 && rect.top < vh * 0.2) return false;
  }

  const closer = root.querySelector<HTMLElement>("#closer");
  if (closer) {
    const rect = closer.getBoundingClientRect();
    if (rect.top < vh * 0.45) return false;
  }

  return true;
}

function fadeDuration(velocity: number) {
  if (prefersReducedMotion()) return 0;
  return gsap.utils.clamp(0.12, 0.45, 220 / Math.max(Math.abs(velocity), 40));
}

export function MenuTheme() {
  useEffect(() => {
    const trigger = document.querySelector<HTMLElement>(".menu-trigger");
    const wordmark = document.querySelector<HTMLElement>(".parked-iu26");
    const chrome = [trigger, wordmark].filter(Boolean) as HTMLElement[];

    let shown: boolean | null = null;
    const mobile = isMobileChrome();
    if (mobile) {
      gsap.set(chrome, { opacity: 1 });
      if (trigger) trigger.style.pointerEvents = "auto";
      document.documentElement.dataset.menuShow = "true";
    } else {
      gsap.set(chrome, { opacity: 0 });
      if (trigger) trigger.style.pointerEvents = "none";
      document.documentElement.dataset.menuShow = "false";
    }

    const setShown = (next: boolean, velocity: number) => {
      if (next === shown) return;
      shown = next;
      document.documentElement.dataset.menuShow = next ? "true" : "false";
      if (trigger) trigger.style.pointerEvents = next ? "auto" : "none";
      gsap.to(chrome, {
        opacity: next ? 1 : 0,
        duration: fadeDuration(velocity),
        overwrite: true,
        ease: "power2.out",
      });
    };

    const apply = (velocity = 0) => {
      document.documentElement.dataset.menuOn = themeAtProbe();
      setShown(chromeShouldShow(), velocity);
    };

    apply(0);
    const mo = new MutationObserver(() => apply(0));
    mo.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-menu-open"],
    });

    if (prefersReducedMotion()) {
      const onScroll = () => apply(0);
      window.addEventListener("scroll", onScroll, { passive: true });
      return () => {
        mo.disconnect();
        window.removeEventListener("scroll", onScroll);
      };
    }

    const st = ScrollTrigger.create({
      start: 0,
      end: "max",
      invalidateOnRefresh: true,
      onUpdate: (self) => apply(self.getVelocity()),
      onRefresh: () => apply(0),
    });

    return () => {
      mo.disconnect();
      st.kill();
      gsap.killTweensOf(chrome);
    };
  }, []);

  return null;
}
