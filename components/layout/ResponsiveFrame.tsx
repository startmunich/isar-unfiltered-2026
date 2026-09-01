import type { ReactNode } from "react";

type ResponsiveFrameProps = {
  mobile: ReactNode;
  desktop: ReactNode;
};

/**
 * Renders both trees; CSS visibility avoids hydration mismatch.
 * Hash IDs are mirrored on both trees. DOM logic must scope to .desktop-only / .mobile-only.
 */
export function ResponsiveFrame({ mobile, desktop }: ResponsiveFrameProps) {
  return (
    <>
      <div className="mobile-only">{mobile}</div>
      <div className="desktop-only">{desktop}</div>
    </>
  );
}
