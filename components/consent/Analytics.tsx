"use client";

import { GoogleAnalytics } from "@next/third-parties/google";
import { useConsent } from "@/components/consent/ConsentProvider";
import { GA_MEASUREMENT_ID } from "@/lib/site-url";

export function Analytics() {
  const { ready, choice } = useConsent();

  if (!ready || choice !== "analytics" || !GA_MEASUREMENT_ID) {
    return null;
  }

  return <GoogleAnalytics gaId={GA_MEASUREMENT_ID} />;
}
