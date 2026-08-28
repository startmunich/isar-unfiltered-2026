import type { AnchorHTMLAttributes, ReactNode } from "react";

export type ArrowTone = "black" | "green" | "yellow";

const ARROW_SRC: Record<ArrowTone, string> = {
  black: "/images/arrow-black.png",
  green: "/images/arrow-green.png",
  yellow: "/images/arrow-yellow.png",
};

type TextLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string;
  children: ReactNode;
  icon?: boolean;
  arrow?: ArrowTone;
};

export function TextLink({
  href,
  children,
  icon = true,
  arrow = "black",
  className = "",
  ...rest
}: TextLinkProps) {
  const external = href.startsWith("http");
  const src = ARROW_SRC[arrow];

  return (
    <a
      href={href}
      className={`text-link ${className}`.trim()}
      {...(external
        ? { target: "_blank", rel: "noopener noreferrer" }
        : {})}
      {...rest}
    >
      <span className="text-link-label">{children}</span>
      {icon ? (
        <span className="text-link-icon" aria-hidden>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={src}
            alt=""
            className="text-link-arrow text-link-arrow-ghost"
          />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={src}
            alt=""
            className="text-link-arrow text-link-arrow-main"
          />
        </span>
      ) : null}
    </a>
  );
}
