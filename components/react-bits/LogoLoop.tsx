"use client";

import {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type Key,
  type ReactNode,
} from "react";
import { prefersReducedMotion } from "@/lib/gsap";
import "./LogoLoop.css";

const ANIMATION = { SMOOTH_TAU: 0.25, MIN_COPIES: 2, COPY_HEADROOM: 2 };

export type NodeLogoItem = {
  node: ReactNode;
  href?: string;
  title?: string;
  ariaLabel?: string;
};

export type ImageLogoItem = {
  src: string;
  alt?: string;
  href?: string;
  title?: string;
  srcSet?: string;
  sizes?: string;
  width?: number;
  height?: number;
};

export type LogoItem = NodeLogoItem | ImageLogoItem;

type LogoLoopProps = {
  logos: LogoItem[];
  speed?: number;
  direction?: "left" | "right" | "up" | "down";
  width?: number | string;
  logoHeight?: number;
  gap?: number;
  pauseOnHover?: boolean;
  hoverSpeed?: number;
  fadeOut?: boolean;
  fadeOutColor?: string;
  scaleOnHover?: boolean;
  renderItem?: (item: LogoItem, key: Key) => ReactNode;
  ariaLabel?: string;
  className?: string;
  style?: CSSProperties;
};

function toCssLength(value?: number | string) {
  if (typeof value === "number") return `${value}px`;
  return value ?? undefined;
}

function isNodeItem(item: LogoItem): item is NodeLogoItem {
  return "node" in item;
}

export const LogoLoop = memo(function LogoLoop({
  logos,
  speed = 120,
  direction = "left",
  width = "100%",
  logoHeight = 28,
  gap = 32,
  pauseOnHover,
  hoverSpeed,
  fadeOut = false,
  fadeOutColor,
  scaleOnHover = false,
  renderItem,
  ariaLabel = "Partner logos",
  className,
  style,
}: LogoLoopProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const seqRef = useRef<HTMLUListElement>(null);

  const [seqWidth, setSeqWidth] = useState(0);
  const [seqHeight, setSeqHeight] = useState(0);
  const [copyCount, setCopyCount] = useState(ANIMATION.MIN_COPIES);
  const [hovered, setHovered] = useState(false);
  const offsetRef = useRef(0);
  const velocityRef = useRef(0);
  const lastTimeRef = useRef<number | null>(null);
  const hoveredRef = useRef(false);
  const targetVelocityRef = useRef(0);
  const hoverSpeedRef = useRef<number | undefined>(0);

  const effectiveHoverSpeed = useMemo(() => {
    if (hoverSpeed !== undefined) return hoverSpeed;
    if (pauseOnHover === true) return 0;
    if (pauseOnHover === false) return undefined;
    return 0;
  }, [hoverSpeed, pauseOnHover]);

  const vertical = direction === "up" || direction === "down";

  const targetVelocity = useMemo(() => {
    const magnitude = Math.abs(speed);
    const dirMul = vertical
      ? direction === "up"
        ? 1
        : -1
      : direction === "left"
        ? 1
        : -1;
    return magnitude * dirMul * (speed < 0 ? -1 : 1);
  }, [speed, direction, vertical]);

  const updateDimensions = useCallback(() => {
    const containerWidth = containerRef.current?.clientWidth ?? 0;
    const sequenceRect = seqRef.current?.getBoundingClientRect();
    const sequenceWidth = sequenceRect?.width ?? 0;
    const sequenceHeight = sequenceRect?.height ?? 0;

    if (vertical) {
      const parentHeight =
        containerRef.current?.parentElement?.clientHeight ?? 0;
      if (containerRef.current && parentHeight > 0) {
        const targetHeight = Math.ceil(parentHeight);
        if (containerRef.current.style.height !== `${targetHeight}px`) {
          containerRef.current.style.height = `${targetHeight}px`;
        }
      }
      if (sequenceHeight > 0) {
        setSeqHeight(Math.ceil(sequenceHeight));
        const viewport =
          containerRef.current?.clientHeight ?? parentHeight ?? sequenceHeight;
        const copiesNeeded =
          Math.ceil(viewport / sequenceHeight) + ANIMATION.COPY_HEADROOM;
        setCopyCount(Math.max(ANIMATION.MIN_COPIES, copiesNeeded));
      }
    } else if (sequenceWidth > 0) {
      setSeqWidth(Math.ceil(sequenceWidth));
      const copiesNeeded =
        Math.ceil(containerWidth / sequenceWidth) + ANIMATION.COPY_HEADROOM;
      setCopyCount(Math.max(ANIMATION.MIN_COPIES, copiesNeeded));
    }
  }, [vertical]);

  useEffect(() => {
    updateDimensions();
    const nodes = [containerRef.current, seqRef.current].filter(
      Boolean,
    ) as HTMLElement[];
    if (!window.ResizeObserver) {
      window.addEventListener("resize", updateDimensions);
      return () => window.removeEventListener("resize", updateDimensions);
    }
    const observers = nodes.map((node) => {
      const observer = new ResizeObserver(updateDimensions);
      observer.observe(node);
      return observer;
    });
    return () => observers.forEach((observer) => observer.disconnect());
  }, [updateDimensions, logos, gap, logoHeight]);

  useEffect(() => {
    const images = seqRef.current?.querySelectorAll("img") ?? [];
    if (!images.length) {
      updateDimensions();
      return;
    }
    let remaining = images.length;
    const onDone = () => {
      remaining -= 1;
      if (remaining <= 0) updateDimensions();
    };
    images.forEach((img) => {
      if (img.complete) onDone();
      else {
        img.addEventListener("load", onDone, { once: true });
        img.addEventListener("error", onDone, { once: true });
      }
    });
  }, [updateDimensions, logos, gap, logoHeight]);

  hoveredRef.current = hovered;
  targetVelocityRef.current = targetVelocity;
  hoverSpeedRef.current = effectiveHoverSpeed;

  useEffect(() => {
    const track = trackRef.current;
    if (!track || prefersReducedMotion()) return;

    const seqSize = vertical ? seqHeight : seqWidth;
    if (seqSize > 0) {
      offsetRef.current = ((offsetRef.current % seqSize) + seqSize) % seqSize;
      track.style.transform = vertical
        ? `translate3d(0, ${-offsetRef.current}px, 0)`
        : `translate3d(${-offsetRef.current}px, 0, 0)`;
    }

    let raf = 0;
    const animate = (timestamp: number) => {
      if (lastTimeRef.current == null) lastTimeRef.current = timestamp;
      const dt = Math.max(0, timestamp - lastTimeRef.current) / 1000;
      lastTimeRef.current = timestamp;

      const target =
        hoveredRef.current && hoverSpeedRef.current !== undefined
          ? hoverSpeedRef.current
          : targetVelocityRef.current;

      const ease = 1 - Math.exp(-dt / ANIMATION.SMOOTH_TAU);
      velocityRef.current += (target - velocityRef.current) * ease;

      if (seqSize > 0) {
        let next = offsetRef.current + velocityRef.current * dt;
        next = ((next % seqSize) + seqSize) % seqSize;
        offsetRef.current = next;
        track.style.transform = vertical
          ? `translate3d(0, ${-next}px, 0)`
          : `translate3d(${-next}px, 0, 0)`;
      }

      raf = window.requestAnimationFrame(animate);
    };

    raf = window.requestAnimationFrame(animate);
    return () => {
      window.cancelAnimationFrame(raf);
      lastTimeRef.current = null;
    };
  }, [seqWidth, seqHeight, vertical]);

  const cssVariables = useMemo(
    () =>
      ({
        "--logo-loop-gap": `${gap}px`,
        "--logo-loop-logoHeight": `${logoHeight}px`,
        ...(fadeOutColor
          ? { "--logo-loop-fadeColor": fadeOutColor }
          : {}),
      }) as CSSProperties,
    [gap, logoHeight, fadeOutColor],
  );

  const rootClassName = [
    "logo-loop",
    vertical ? "logo-loop--vertical" : "logo-loop--horizontal",
    fadeOut && "logo-loop--fade",
    scaleOnHover && "logo-loop--scale-hover",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const renderLogoItem = useCallback(
    (item: LogoItem, key: string) => {
      if (renderItem) {
        return (
          <li className="logo-loop__item" key={key} role="listitem">
            {renderItem(item, key)}
          </li>
        );
      }

      const content = isNodeItem(item) ? (
        <span
          className="logo-loop__node"
          aria-hidden={!!item.href && !item.ariaLabel}
        >
          {item.node}
        </span>
      ) : (
        <img
          src={item.src}
          srcSet={item.srcSet}
          sizes={item.sizes}
          width={item.width}
          height={item.height}
          alt={item.alt ?? ""}
          title={item.title}
          loading="lazy"
          decoding="async"
          draggable={false}
        />
      );

      const label = isNodeItem(item)
        ? (item.ariaLabel ?? item.title)
        : (item.alt ?? item.title);

      const inner = item.href ? (
        <a
          className="logo-loop__link"
          href={item.href}
          aria-label={label || "logo link"}
          target="_blank"
          rel="noreferrer noopener"
        >
          {content}
        </a>
      ) : (
        content
      );

      return (
        <li className="logo-loop__item" key={key} role="listitem">
          {inner}
        </li>
      );
    },
    [renderItem],
  );

  const lists = useMemo(
    () =>
      Array.from({ length: copyCount }, (_, copyIndex) => (
        <ul
          className="logo-loop__list"
          key={`copy-${copyIndex}`}
          role="list"
          aria-hidden={copyIndex > 0}
          ref={copyIndex === 0 ? seqRef : undefined}
        >
          {logos.map((item, itemIndex) =>
            renderLogoItem(item, `${copyIndex}-${itemIndex}`),
          )}
        </ul>
      )),
    [copyCount, logos, renderLogoItem],
  );

  const widthCss = toCssLength(width);
  const containerStyle: CSSProperties = {
    width: vertical
      ? widthCss === "100%"
        ? undefined
        : widthCss
      : (widthCss ?? "100%"),
    ...cssVariables,
    ...style,
  };

  return (
    <div
      ref={containerRef}
      className={rootClassName}
      style={containerStyle}
      role="region"
      aria-label={ariaLabel}
    >
      <div
        className="logo-loop__track"
        ref={trackRef}
        onMouseEnter={() => {
          if (effectiveHoverSpeed !== undefined) setHovered(true);
        }}
        onMouseLeave={() => {
          if (effectiveHoverSpeed !== undefined) setHovered(false);
        }}
      >
        {lists}
      </div>
    </div>
  );
});

export default LogoLoop;
