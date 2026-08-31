"use client";

import { useConsent } from "@/components/consent/ConsentProvider";

export function ConsentResetLink() {
  const { reopen } = useConsent();

  return (
    <button type="button" className="legal-text-btn" onClick={reopen}>
      open the cookie banner again
    </button>
  );
}
