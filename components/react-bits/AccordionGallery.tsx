"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import "./AccordionGallery.css";

export type AccordionItem = {
  image: string;
  alt?: string;
  n: string;
  date: string;
  body: string;
  slots?: ReadonlyArray<{
    when: string;
    where: string;
    format: string;
    length: string;
  }>;
};

type AccordionGalleryProps = {
  items: AccordionItem[];
  defaultIndex?: number;
  expandRatio?: number;
  duration?: number;
  ease?: string;
  parallax?: number;
  stagger?: number;
  trigger?: "hover" | "click";
  className?: string;
};

export default function AccordionGallery({
  items,
  defaultIndex = -1,
  expandRatio = 0.62,
  duration = 0.6,
  ease = "power3.out",
  parallax = 0.5,
  stagger = 0.06,
  trigger = "hover",
  className = "",
}: AccordionGalleryProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const panelRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const mediaRefs = useRef<Array<HTMLSpanElement | null>>([]);
  const copyRefs = useRef<Array<HTMLSpanElement | null>>([]);
  const tlRef = useRef<ReturnType<typeof gsap.timeline> | null>(null);
  const firstRunRef = useRef(true);
  const mediaSizeRef = useRef(320);
  const count = items.length;
  const start = Math.min(Math.max(defaultIndex, -1), count - 1);
  const [active, setActive] = useState(start);

  const applyLayout = useCallback(
    (animate: boolean) => {
      const panels = panelRefs.current;
      if (!panels.length) return;

      const reduced = prefersReducedMotion();
      const mobile =
        typeof window !== "undefined" &&
        window.matchMedia("(max-width: 1023px)").matches;
      const r = Math.min(Math.max(expandRatio, 0.2), 0.9);
      const grow = count > 1 ? (r * (count - 1)) / (1 - r) : 1;
      const mediaSize = mediaSizeRef.current;

      tlRef.current?.kill();
      const dur = animate && !reduced ? duration : 0;
      const tl = gsap.timeline();

      panels.forEach((panel, i) => {
        if (!panel) return;
        const isActive = i === active;
        const media = mediaRefs.current[i];
        const copy = copyRefs.current[i];
        const allClosed = active < 0;

        if (!mobile) {
          tl.to(
            panel,
            {
              flexGrow: allClosed || !isActive ? 1 : grow,
              duration: dur,
              ease,
            },
            0,
          );
        }

        if (media) {
          if (mobile) {
            tl.to(
              media,
              {
                xPercent: 0,
                yPercent: 0,
                x: 0,
                y: 0,
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                "--ag-gray": isActive || allClosed ? (isActive ? 0 : 1) : 1,
                "--ag-dim": isActive ? 0.2 : 0.42,
                duration: dur,
                ease,
              },
              0,
            );
          } else {
            const drift = Math.max(-1.5, Math.min(1.5, active - i));
            const shift = isActive ? 0 : drift * parallax * mediaSize * 0.06;
            tl.to(
              media,
              {
                xPercent: -50,
                yPercent: -50,
                x: shift,
                "--ag-gray": isActive ? 0 : 1,
                "--ag-dim": isActive ? 0.15 : 0.45,
                duration: dur,
                ease,
              },
              0,
            );
          }
        }

        if (copy) {
          if (isActive) {
            tl.to(
              copy,
              {
                opacity: 1,
                x: 0,
                duration: dur,
                ease,
                stagger: reduced ? 0 : stagger,
              },
              0,
            );
          } else {
            tl.to(
              copy,
              { opacity: 0, x: mobile ? 0 : -14, duration: dur * 0.6, ease },
              0,
            );
          }
        }
      });

      tlRef.current = tl;
    },
    [active, count, expandRatio, duration, ease, parallax, stagger],
  );

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;

    const measure = () => {
      const rect = el.getBoundingClientRect();
      const usable = Math.max(rect.width, 120);
      const size = Math.max(
        140,
        usable * Math.min(Math.max(expandRatio, 0.2), 0.9) * 1.22,
      );
      mediaSizeRef.current = size;
      el.style.setProperty("--ag-media-size", `${size}px`);
      applyLayout(!firstRunRef.current);
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [applyLayout, expandRatio]);

  useEffect(() => {
    applyLayout(!firstRunRef.current);
    firstRunRef.current = false;
  }, [applyLayout]);

  useEffect(
    () => () => {
      tlRef.current?.kill();
    },
    [],
  );

  const handleEnter = (i: number) => {
    if (trigger === "hover") setActive(i);
  };

  const handleLeave = () => {
    if (trigger === "hover") setActive(-1);
  };

  const handleClick = (i: number) => {
    setActive((current) => (current === i ? -1 : i));
  };

  const handleKeyDown = (i: number, e: KeyboardEvent) => {
    if (e.key === "ArrowRight" || e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i + 1) % count);
    } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i - 1 + count) % count);
    } else if (e.key === "Escape") {
      e.preventDefault();
      setActive(-1);
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleClick(i);
    }
  };

  return (
    <div
      ref={rootRef}
      className={`accordion-gallery${className ? ` ${className}` : ""}`}
      role="list"
      aria-label="Program days"
      onMouseLeave={handleLeave}
    >
      {items.map((item, i) => {
        const isActive = i === active;
        const squeezed = active >= 0 && !isActive;
        return (
          <button
            key={item.n}
            ref={(el) => {
              panelRefs.current[i] = el;
            }}
            type="button"
            className={`ag-panel${isActive ? " is-open" : ""}${squeezed ? " is-squeezed" : ""}`}
            onClick={() => handleClick(i)}
            onMouseEnter={() => handleEnter(i)}
            onFocus={() => setActive(i)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            role="listitem"
            aria-current={isActive ? "true" : undefined}
            aria-expanded={isActive}
            aria-label={`Day ${item.n}, ${item.date}`}
          >
            <span className="ag-panel-frame">
              <span
                className="ag-panel-media"
                ref={(el) => {
                  mediaRefs.current[i] = el;
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={item.image} alt={item.alt || ""} draggable={false} />
              </span>
              <span className="ag-panel-overlay" aria-hidden />
            </span>

            <span className="ag-closed" aria-hidden={!isActive}>
              <span className="ag-closed-kicker">DAY</span>
              <span className="ag-closed-n">{item.n}</span>
              <span className="ag-closed-date">{item.date}</span>
            </span>

            <span
              className="ag-open"
              ref={(el) => {
                copyRefs.current[i] = el;
              }}
              aria-hidden={!isActive}
            >
              <span className="ag-open-main">
                <span className="ag-open-date">{item.date}</span>
                <span className="ag-open-title">
                  DAY <em>{item.n}</em>
                </span>
                <span className="ag-open-body">{item.body}</span>
              </span>
              {item.slots?.length ? (
                <span className="ag-open-slots">
                  {item.slots.map((slot) => (
                    <span key={`${slot.when}-${slot.format}`} className="ag-slot">
                      <span className="ag-slot-format">{slot.format}</span>
                      <span className="ag-slot-meta">
                        <span>{slot.when}</span>
                        <span>{slot.where}</span>
                        <span>{slot.length}</span>
                      </span>
                    </span>
                  ))}
                </span>
              ) : null}
            </span>
          </button>
        );
      })}
    </div>
  );
}
