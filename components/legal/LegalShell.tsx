import Link from "next/link";
import type { ReactNode } from "react";

export function LegalShell({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <main className="legal-page">
      <div className="legal-page-inner">
        <p className="legal-kicker">
          <Link href="/">ISAR Unfiltered</Link>
        </p>
        <h1 className="legal-title">{title}</h1>
        <div className="legal-body">{children}</div>
      </div>
    </main>
  );
}
