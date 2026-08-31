"use client";

import Link from "next/link";
import { useConsent } from "@/components/consent/ConsentProvider";

export function ConsentBanner() {
  const { ready, choice, setChoice } = useConsent();

  if (!ready || choice !== null) return null;

  return (
    <div className="consent-banner" role="dialog" aria-label="Cookie consent">
      <div className="consent-banner-inner">
        <p className="consent-banner-copy">
          We use essential cookies to run this site. Analytics (Google Analytics)
          only runs if you opt in.{" "}
          <Link href="/datenschutz">Datenschutz</Link>
        </p>
        <div className="consent-banner-actions">
          <button
            type="button"
            className="consent-btn consent-btn-ghost"
            onClick={() => setChoice("essential")}
          >
            Essential only
          </button>
          <button
            type="button"
            className="consent-btn consent-btn-solid"
            onClick={() => setChoice("analytics")}
          >
            Accept analytics
          </button>
        </div>
      </div>
    </div>
  );
}
