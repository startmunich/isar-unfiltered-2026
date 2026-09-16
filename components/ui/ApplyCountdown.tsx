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

const UNITS = [
  { key: "days", label: "day" },
  { key: "hours", label: "hour" },
  { key: "minutes", label: "min" },
  { key: "seconds", label: "sec" },
] as const;

export function ApplyCountdown({ className = "" }: ApplyCountdownProps) {
  const [remaining, setRemaining] = useState<RemainingTime>(() =>
    getRemainingTime(),
  );

  useEffect(() => {
    const tick = () => setRemaining(getRemainingTime());
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, []);

  const values = {
    days: pad2(remaining.days),
    hours: pad2(remaining.hours),
    minutes: pad2(remaining.minutes),
    seconds: pad2(remaining.seconds),
  };

  return (
    <div
      className={`apply-countdown ${className}`.trim()}
      aria-live="polite"
      aria-atomic="true"
    >
      <p className="apply-countdown-label">{copy.apply.countdownLabel}</p>
      <div
        className="apply-countdown-row"
        aria-label={`${remaining.days} days, ${remaining.hours} hours, ${remaining.minutes} minutes, ${remaining.seconds} seconds remaining`}
      >
        {UNITS.map((unit, i) => (
          <div key={unit.key} className="apply-countdown-unit">
            {i > 0 ? (
              <span className="apply-countdown-sep" aria-hidden>
                :
              </span>
            ) : null}
            <div className="apply-countdown-block">
              <span className="apply-countdown-digit">{values[unit.key]}</span>
              <span className="apply-countdown-unit-label">{unit.label}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
