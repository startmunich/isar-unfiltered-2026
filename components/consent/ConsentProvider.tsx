"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type ConsentChoice = "essential" | "analytics";

type ConsentContextValue = {
  ready: boolean;
  choice: ConsentChoice | null;
  setChoice: (next: ConsentChoice) => void;
  reopen: () => void;
};

const STORAGE_KEY = "iu26-consent";

const ConsentContext = createContext<ConsentContextValue | null>(null);

export function useConsent() {
  const ctx = useContext(ConsentContext);
  if (!ctx) {
    throw new Error("useConsent must be used inside ConsentProvider");
  }
  return ctx;
}

export function ConsentProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [choice, setChoiceState] = useState<ConsentChoice | null>(null);
  const [forceBanner, setForceBanner] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw === "essential" || raw === "analytics") {
        setChoiceState(raw);
      }
    } catch {
      /* ignore */
    }
    setReady(true);
  }, []);

  const setChoice = useCallback((next: ConsentChoice) => {
    setChoiceState(next);
    setForceBanner(false);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* ignore */
    }
  }, []);

  const reopen = useCallback(() => {
    setForceBanner(true);
  }, []);

  const value = useMemo(
    () => ({
      ready,
      choice: forceBanner ? null : choice,
      setChoice,
      reopen,
    }),
    [ready, choice, forceBanner, setChoice, reopen],
  );

  return (
    <ConsentContext.Provider value={value}>{children}</ConsentContext.Provider>
  );
}
