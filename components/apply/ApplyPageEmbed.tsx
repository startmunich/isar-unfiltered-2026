"use client";

import Link from "next/link";
import Script from "next/script";
import { useEffect, useRef } from "react";
import { copy } from "@/lib/copy";
import {
  getTallyEmbedBaseUrl,
  getTallyEmbedSrc,
  normalizeTallyEmbedUrl,
  tallyFormTitle,
} from "@/lib/tally";

declare global {
  interface Window {
    Tally?: { loadEmbeds: () => void };
  }
}

const TALLY_SCRIPT = "https://tally.so/widgets/embed.js";
const TALLY_FALLBACK_HEIGHT = 900;

function loadTallyEmbeds() {
  if (typeof window.Tally !== "undefined") {
    window.Tally.loadEmbeds();
    return;
  }

  document
    .querySelectorAll<HTMLIFrameElement>("iframe[data-tally-src]:not([src])")
    .forEach((iframe) => {
      iframe.src = iframe.dataset.tallySrc ?? "";
    });
}

function parseTallyMessage(data: unknown): {
  event?: string;
  height?: number;
} {
  if (typeof data === "string") {
    try {
      const parsed = JSON.parse(data) as {
        event?: string;
        payload?: { height?: number };
      };
      return {
        event: parsed.event,
        height: parsed.payload?.height,
      };
    } catch {
      if (data.includes("Tally.FormLoaded")) {
        return { event: "Tally.FormLoaded" };
      }
      if (data.includes("Tally.FormPageView")) {
        return { event: "Tally.FormPageView" };
      }
      return {};
    }
  }

  if (data && typeof data === "object") {
    const obj = data as {
      event?: string;
      height?: number;
      payload?: { height?: number };
    };
    return {
      event: obj.event,
      height: obj.payload?.height ?? obj.height,
    };
  }

  return {};
}

export function ApplyPageEmbed() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const embedRef = useRef<HTMLIFrameElement>(null);
  const tallyBaseUrl = getTallyEmbedBaseUrl();
  const embedSrc = tallyBaseUrl
    ? getTallyEmbedSrc(normalizeTallyEmbedUrl(tallyBaseUrl))
    : null;

  useEffect(() => {
    if (!embedSrc) return;

    loadTallyEmbeds();

    const applyHeight = (height: number) => {
      const iframeEl = embedRef.current;
      const wrapEl = wrapRef.current;
      if (!iframeEl || !Number.isFinite(height) || height < 120) return;

      const next = `${Math.ceil(height)}px`;
      iframeEl.style.height = next;
      iframeEl.style.minHeight = next;
      if (wrapEl) {
        wrapEl.style.height = next;
        wrapEl.style.minHeight = next;
      }
    };

    const onMessage = (event: MessageEvent) => {
      const iframeEl = embedRef.current;
      if (!iframeEl) return;
      if (event.source && event.source !== iframeEl.contentWindow) return;

      const { event: tallyEvent, height } = parseTallyMessage(event.data);

      if (height) applyHeight(height);

      if (
        tallyEvent === "Tally.FormLoaded" ||
        tallyEvent === "Tally.FormPageView"
      ) {
        loadTallyEmbeds();
        window.setTimeout(loadTallyEmbeds, 120);
        window.setTimeout(loadTallyEmbeds, 400);
      }
    };

    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [embedSrc]);

  return (
    <main className="apply-page" data-frame-theme="yellow">
      <header className="apply-page-bar">
        <Link href="/" className="apply-page-back">
          ← Back to home
        </Link>
      </header>

      {embedSrc ? (
        <>
          <Script
            src={TALLY_SCRIPT}
            strategy="afterInteractive"
            onLoad={loadTallyEmbeds}
          />
          <div ref={wrapRef} className="apply-page-embed-wrap">
            <iframe
              ref={embedRef}
              data-tally-src={embedSrc}
              width="100%"
              height={TALLY_FALLBACK_HEIGHT}
              frameBorder={0}
              marginHeight={0}
              marginWidth={0}
              title={tallyFormTitle}
              className="apply-page-embed"
              loading="lazy"
            />
          </div>
        </>
      ) : (
        <p className="apply-page-fallback">{copy.apply.small}</p>
      )}
    </main>
  );
}
