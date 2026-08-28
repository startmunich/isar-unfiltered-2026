/** Desktop Lenis snap system — custom event to refresh rests without scroll jumps. */
export const SNAP_REFRESH_EVENT = "iu26:snap-refresh";

export function requestSnapRefresh() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(SNAP_REFRESH_EVENT));
}
