/** Applications close Mon 21 Sep 2026 23:59 Europe/Berlin (CEST = UTC+2). */
export const APPLY_DEADLINE_MS = Date.parse("2026-09-21T23:59:00+02:00");

export type RemainingTime = {
  days: number;
  hours: number;
  minutes: number;
};

export function getRemainingTime(nowMs = Date.now()): RemainingTime {
  const left = Math.max(0, APPLY_DEADLINE_MS - nowMs);
  const totalMinutes = Math.floor(left / 60_000);
  const days = Math.floor(totalMinutes / (24 * 60));
  const hours = Math.floor((totalMinutes % (24 * 60)) / 60);
  const minutes = totalMinutes % 60;
  return { days, hours, minutes };
}

export function pad2(n: number): string {
  return String(Math.max(0, n)).padStart(2, "0");
}
