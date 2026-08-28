import type { ReactNode } from "react";

type ResponsiveFrameProps = {
  mobile: ReactNode;
  desktop: ReactNode;
};

/**
 * Renders both trees; CSS visibility avoids hydration mismatch.
 * Canonical hash IDs (#intro, #apply-form, etc.) live on the desktop tree only.
 * Mobile in-page links use #m-apply-form. DOM logic must scope to .desktop-only / .mobile-only.
 */
export function ResponsiveFrame({ mobile, desktop }: ResponsiveFrameProps) {
  return (
    <>
      <div className="mobile-only">{mobile}</div>
      <div className="desktop-only">{desktop}</div>
    </>
  );
}
