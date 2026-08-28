"use client";

import { useEffect, useState } from "react";

export type ViewportProfile = "mobile" | "desktop";

const QUERY = "(max-width: 1023px)";

export function useViewportProfile(): ViewportProfile | null {
  const [profile, setProfile] = useState<ViewportProfile | null>(null);

  useEffect(() => {
    const mq = window.matchMedia(QUERY);
    const sync = () => setProfile(mq.matches ? "mobile" : "desktop");
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  return profile;
}

export function isMobileViewport() {
  if (typeof window === "undefined") return false;
  return window.matchMedia(QUERY).matches;
}
