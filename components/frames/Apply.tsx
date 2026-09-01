"use client";

import Script from "next/script";
import { useEffect, useRef, useState } from "react";
import { copy } from "@/lib/copy";
import { requestSnapRefresh } from "@/lib/snap";
import {
  getTallyEmbedBaseUrl,
  getTallyEmbedSrc,
  normalizeTallyEmbedUrl,
  tallyFormTitle,
} from "@/lib/tally";
import { TextLink } from "@/components/ui/TextLink";

declare global {
  interface Window {
    Tally?: { loadEmbeds: () => void };
  }
}

const TALLY_SCRIPT = "https://tally.so/widgets/embed.js";
const TALLY_FALLBACK_HEIGHT = 560;
const MOBILE_EMBED_MIN_HEIGHT = 380;

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

export function ApplyIntro() {
  return (
    <section
      id="apply"
      data-frame-theme="yellow"
      className="apply-intro frame frame-yellow js-snap"
    >
      <div className="apply-intro-inner">
        <h1 className="apply-headline">{copy.apply.headline}</h1>
        <p className="apply-sub">{copy.apply.sub}</p>
        <TextLink href="#apply-form" arrow="green" className="apply-start">
          {copy.apply.start}
        </TextLink>
      </div>
    </section>
  );
}

export function ApplyForm({ tree }: { tree: "desktop" | "mobile" }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const embedRef = useRef<HTMLIFrameElement>(null);
  const [interactive, setInteractive] = useState(false);
  const [tapCopy, setTapCopy] = useState(false);
  const tallyBaseUrl = getTallyEmbedBaseUrl();
  const embedSrc = tallyBaseUrl
    ? getTallyEmbedSrc(normalizeTallyEmbedUrl(tallyBaseUrl))
    : null;

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 1023px)");
    const sync = () => setTapCopy(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    if (!embedSrc) return;

    loadTallyEmbeds();

    let layoutRefreshTimer: number | undefined;

    const scheduleLayoutRefresh = () => {
      if (window.matchMedia("(max-width: 1023px)").matches) return;
      if (layoutRefreshTimer) window.clearTimeout(layoutRefreshTimer);
      layoutRefreshTimer = window.setTimeout(() => {
        requestSnapRefresh();
      }, 160);
    };

    const applyHeight = (height: number) => {
      const iframeEl = embedRef.current;
      const wrapEl = wrapRef.current;
      if (!iframeEl || !Number.isFinite(height) || height < 120) return;

      const isMobile = window.matchMedia("(max-width: 1023px)").matches;
      const resolved = isMobile
        ? Math.max(height, MOBILE_EMBED_MIN_HEIGHT)
        : height;
      const next = `${Math.ceil(resolved)}px`;
      iframeEl.style.height = next;
      iframeEl.style.minHeight = next;
      if (wrapEl) {
        wrapEl.style.height = next;
        wrapEl.style.minHeight = next;
      }
      scheduleLayoutRefresh();
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
        scheduleLayoutRefresh();
      }
    };

    window.addEventListener("message", onMessage);
    return () => {
      if (layoutRefreshTimer) window.clearTimeout(layoutRefreshTimer);
      window.removeEventListener("message", onMessage);
    };
  }, [embedSrc]);

  const formId = tree === "mobile" ? "m-apply-form" : "apply-form";

  return (
    <section
      id={formId}
      data-frame-theme="yellow"
      className="apply-form apply-corridor frame-yellow"
    >
      <div className="apply-form-inner">
        {embedSrc ? (
          <>
            <Script
              src={TALLY_SCRIPT}
              strategy="afterInteractive"
              onLoad={loadTallyEmbeds}
            />

            {tapCopy ? (
              <>
                <h1 className="apply-headline">{copy.apply.headline}</h1>
                <p className="apply-sub">{copy.apply.sub}</p>
              </>
            ) : null}

            <div className="apply-form-guide" aria-live="polite">
              <p className="apply-form-guide-kicker">How this works</p>
              <h2 className="apply-form-guide-body">
                {interactive
                  ? copy.apply.formActive
                  : tapCopy
                    ? copy.apply.formGuideMobile
                    : copy.apply.formGuide}
              </h2>
              <p className="apply-form-guide-hint">
                {interactive
                  ? copy.apply.formActiveHint
                  : tapCopy
                    ? copy.apply.formActivateHintMobile
                    : copy.apply.formActivateHint}
              </p>
            </div>

            <div
              ref={wrapRef}
              className={`apply-embed-wrap${interactive ? " is-active" : ""}`}
              onMouseLeave={() => setInteractive(false)}
            >
              {!interactive ? (
                <button
                  type="button"
                  className="apply-embed-hit"
                  onClick={() => setInteractive(true)}
                >
                  <span className="apply-embed-hit-card">
                    <span className="apply-embed-hit-label">
                      {tapCopy
                        ? copy.apply.formActivateMobile
                        : copy.apply.formActivate}
                    </span>
                    <span className="apply-embed-hit-sub">
                      {tapCopy
                        ? copy.apply.formActivateHintMobile
                        : copy.apply.formActivateHint}
                    </span>
                  </span>
                </button>
              ) : null}
              <iframe
                ref={embedRef}
                data-tally-src={embedSrc}
                width="100%"
                height={TALLY_FALLBACK_HEIGHT}
                frameBorder={0}
                marginHeight={0}
                marginWidth={0}
                title={tallyFormTitle}
                className="apply-embed"
                loading="lazy"
                style={{ pointerEvents: interactive ? "auto" : "none" }}
              />
            </div>
          </>
        ) : (
          <p className="apply-fallback">{copy.apply.small}</p>
        )}
      </div>
    </section>
  );
}

/** @deprecated Prefer ApplyIntro + ApplyForm */
export function Apply() {
  return (
    <>
      <ApplyIntro />
      <ApplyForm tree="desktop" />
    </>
  );
}
