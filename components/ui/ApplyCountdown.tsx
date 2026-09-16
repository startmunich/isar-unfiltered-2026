"use client";

import { useEffect, useState } from "react";
import { copy } from "@/lib/copy";
import {
  getRemainingTime,
  pad2,
  type RemainingTime,
} from "@/lib/apply-deadline";

type ApplyCountdownProps = {
  className?: string;
};

export function ApplyCountdown({ className = "" }: ApplyCountdownProps) {
  const [remaining, setRemaining] = useState<RemainingTime>(() =>
    getRemainingTime(),
  );

  useEffect(() => {
    const tick = () => setRemaining(getRemainingTime());
    tick();
    const id = window.setInterval(tick, 30_000);
    return () => window.clearInterval(id);
  }, []);

  const days = pad2(remaining.days);
  const hours = pad2(remaining.hours);
  const minutes = pad2(remaining.minutes);

  return (
    <div
      className={`apply-countdown ${className}`.trim()}
      aria-live="polite"
      aria-atomic="true"
    >
      <p className="apply-countdown-label">{copy.apply.countdownLabel}</p>
      <p
        className="apply-countdown-digits"
        aria-label={`${remaining.days} days, ${remaining.hours} hours, ${remaining.minutes} minutes remaining`}
      >
        <span>{days}</span>
        <span className="apply-countdown-sep" aria-hidden>
          :
        </span>
        <span>{hours}</span>
        <span className="apply-countdown-sep" aria-hidden>
          :
        </span>
        <span>{minutes}</span>
      </p>
    </div>
  );
}
