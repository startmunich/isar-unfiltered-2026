"use client";

import Image from "next/image";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type MouseEvent,
} from "react";
import { applyHref, mobileApplyFormHref } from "@/lib/copy";
import { sqLogos, SQ_LOGO_SIZE } from "@/lib/logos";
import { publicMenuItems } from "@/lib/site";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { useLenis } from "lenis/react";
import { useViewportProfile } from "@/hooks/useViewportProfile";

type MenuContextValue = {
  open: boolean;
  setOpen: (next: boolean) => void;
};

const MenuContext = createContext<MenuContextValue | null>(null);

export function useMenu() {
  const ctx = useContext(MenuContext);
  if (!ctx) {
    throw new Error("useMenu must be used inside MenuProvider");
  }
  return ctx;
}

export function MenuProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const value = useMemo(() => ({ open, setOpen }), [open]);
  return <MenuContext.Provider value={value}>{children}</MenuContext.Provider>;
}

function frameRoot(profile: "mobile" | "desktop") {
  return document.querySelector<HTMLElement>(
    profile === "mobile" ? ".mobile-only" : ".desktop-only",
  );
}

function hashFromHref(href: string) {
  if (href.startsWith("#")) return href;
  if (href.startsWith("/#")) return href.slice(1);
  try {
    const url = new URL(href, window.location.origin);
    if (url.pathname === "/" && url.hash) return url.hash;
  } catch {
    /* ignore */
  }
  return null;
}

export function FullMenu() {
  const { open, setOpen } = useMenu();
  const profile = useViewportProfile();
  const applyLink = profile === "mobile" ? mobileApplyFormHref : applyHref;
  const close = useCallback(() => setOpen(false), [setOpen]);
  const lenis = useLenis();

  const scrollToInPage = useCallback(
    (href: string) => {
      const hash = hashFromHref(href);
      if (!hash || !profile) return false;

      const root = frameRoot(profile);
      if (!root) return false;

      // Features live inside the Intro pin on desktop; jump into that corridor.
      if (
        hash === "#features" &&
        profile === "desktop" &&
        !prefersReducedMotion()
      ) {
        const intro = root.querySelector<HTMLElement>("#intro");
        if (intro) {
          const top = intro.offsetTop + intro.offsetHeight * 0.35;
          close();
          window.setTimeout(() => {
            if (lenis) lenis.scrollTo(top, { immediate: false });
            else window.scrollTo({ top, behavior: "smooth" });
          }, 40);
          return true;
        }
      }

      const el = root.querySelector<HTMLElement>(hash);
      if (!el) return false;

      close();
      window.setTimeout(() => {
        if (profile === "desktop" && lenis) {
          lenis.scrollTo(el, { offset: 0, immediate: false });
        } else {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 40);
      return true;
    },
    [close, lenis, profile],
  );

  const onNavClick = useCallback(
    (e: MouseEvent<HTMLAnchorElement>, href: string) => {
      if (scrollToInPage(href)) {
        e.preventDefault();
        return;
      }
      close();
    },
    [close, scrollToInPage],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [close]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    document.documentElement.dataset.menuOpen = open ? "true" : "false";
    if (open) lenis?.stop();
    else lenis?.start();
    return () => {
      document.body.style.overflow = "";
      delete document.documentElement.dataset.menuOpen;
      lenis?.start();
    };
  }, [open, lenis]);

  useEffect(() => {
    if (prefersReducedMotion() || !open) return;
    const links = document.querySelectorAll("[data-menu-link]");
    gsap.fromTo(
      links,
      { yPercent: 40, opacity: 0 },
      {
        yPercent: 0,
        opacity: 1,
        stagger: 0.06,
        duration: 0.55,
        ease: "power3.out",
      },
    );
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="menu-overlay"
      role="dialog"
      aria-modal="true"
      aria-label="Menu"
    >
      <nav className="menu-overlay-nav">
        {publicMenuItems().map((item) => {
          const href = item.label === "Apply" ? applyLink : item.href;
          return (
            <a
              key={item.href}
              data-menu-link
              href={href}
              onClick={(e) => onNavClick(e, href)}
              className="menu-overlay-link"
            >
              {item.label}
            </a>
          );
        })}
      </nav>
      <div className="menu-overlay-mark" aria-hidden>
        <Image
          src={sqLogos.yellowOnGreen}
          alt=""
          width={SQ_LOGO_SIZE}
          height={SQ_LOGO_SIZE}
          sizes="(max-width: 1023px) 22vw, 28vw"
          className="menu-overlay-logo"
        />
      </div>
    </div>
  );
}

export function MenuTrigger() {
  const { open, setOpen } = useMenu();
  const rootRef = useRef<HTMLButtonElement>(null);

  useGSAP(
    () => {
      const bars = rootRef.current?.querySelectorAll<HTMLElement>(".menu-bar");
      if (!bars || bars.length < 2) return;

      const reduced = prefersReducedMotion();
      const h = bars[0].offsetHeight;
      const styles = rootRef.current
        ? getComputedStyle(rootRef.current)
        : null;
      const gap = styles ? parseFloat(styles.rowGap || styles.gap) || 0 : 0;
      const offset = (h + gap) / 2;
      const duration = reduced ? 0 : 0.42;

      gsap.to(bars[0], {
        y: open ? offset : 0,
        rotation: open ? 45 : 0,
        duration,
        ease: "power3.inOut",
        transformOrigin: "50% 50%",
      });
      gsap.to(bars[1], {
        y: open ? -offset : 0,
        rotation: open ? -45 : 0,
        duration,
        ease: "power3.inOut",
        transformOrigin: "50% 50%",
      });
    },
    { dependencies: [open], scope: rootRef },
  );

  return (
    <button
      ref={rootRef}
      type="button"
      className="menu-trigger"
      aria-label={open ? "Close menu" : "Open menu"}
      aria-expanded={open}
      onClick={() => setOpen(!open)}
    >
      <span className="menu-bar" />
      <span className="menu-bar" />
    </button>
  );
}

export function ParkedWordmark() {
  const wrapRef = useRef<HTMLParagraphElement>(null);
  const fitRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const fit = fitRef.current;
    if (!wrap || !fit) return;

    const place = () => {
      const trigger = document.querySelector<HTMLElement>(".menu-trigger");
      if (!trigger) return;

      const r = trigger.getBoundingClientRect();
      const styles = getComputedStyle(trigger);
      const gap = parseFloat(styles.rowGap || styles.gap) || 0;
      wrap.style.left = `${r.left}px`;
      wrap.style.width = `${r.width}px`;
      wrap.style.top = `${r.bottom + gap}px`;

      fit.style.transform = "none";
      const textW = fit.getBoundingClientRect().width;
      if (textW > 0 && r.width > 0) {
        fit.style.transform = `scaleX(${r.width / textW})`;
      }
    };

    const fonts = document.fonts?.ready ?? Promise.resolve();
    void fonts.then(place);

    const ro = new ResizeObserver(place);
    const trigger = document.querySelector(".menu-trigger");
    if (trigger) ro.observe(trigger);
    ro.observe(document.documentElement);
    window.addEventListener("resize", place);

    return () => {
      ro.disconnect();
      window.removeEventListener("resize", place);
    };
  }, []);

  return (
    <p id="parked-iu26" ref={wrapRef} className="parked-iu26" aria-hidden>
      <span ref={fitRef} className="parked-iu26-fit">
        #IU26
      </span>
    </p>
  );
}
