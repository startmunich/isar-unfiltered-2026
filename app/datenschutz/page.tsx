import type { Metadata } from "next";
import Link from "next/link";
import { LegalShell } from "@/components/legal/LegalShell";
import { ConsentResetLink } from "@/components/consent/ConsentResetLink";
import { GA_MEASUREMENT_ID } from "@/lib/site-url";

export const metadata: Metadata = {
  title: "Datenschutz",
  description:
    "Privacy policy for ISAR Unfiltered — cookies, Google Analytics, and your choices.",
  alternates: { canonical: "/datenschutz" },
};

export default function DatenschutzPage() {
  return (
    <LegalShell title="Datenschutz">
      <h2>Privacy</h2>
      <p>
        The use of our website is generally possible without providing personal
        data. If personal data (e.g. name, address or e-mail address) is
        collected on our website, this is always done on a voluntary basis to
        the extent it is possible. This data will not be passed on to third
        parties without your explicit consent. We would like to point out that
        data transmission over the Internet (e.g. communication by e-mail) can
        be subject to security vulnerabilities. A complete protection of the
        data against access by third parties is not possible. The use of
        published postal addresses, telephone or fax numbers and email addresses
        for marketing purposes is prohibited. The operators of this website
        explicitly reserve the right to take legal action against unsolicited
        mailing or e-mailing of spam and other similar advertising materials.
      </p>

      <h2>Controller</h2>
      <p>
        STARTmunich e.V.
        <br />
        Arcisstrasse 21, 80333 Munich
        <br />
        <a href="mailto:info@startmunich.de">info@startmunich.de</a>
      </p>

      <h2>Essential cookies</h2>
      <p>
        We store a small preference in your browser (
        <code>iu26-consent</code>) so we remember whether you allowed analytics.
        This is required to honour your choice and does not track you across
        sites.
      </p>

      <h2>Google Analytics</h2>
      <p>
        If you choose “Accept analytics”, we load Google Analytics (measurement
        ID <code>{GA_MEASUREMENT_ID}</code>) provided by Google Ireland Limited.
        Google may process usage data (for example page views, device/browser
        information, and approximate location) on servers that can be outside
        the EU. Analytics cookies and scripts are{" "}
        <strong>not</strong> loaded until you opt in.
      </p>
      <p>
        Legal basis for analytics (when accepted): your consent under Art. 6 (1)
        lit. a GDPR / § 25 (1) TDDDG.
      </p>

      <h2>Application form (Tally)</h2>
      <p>
        Our application form may be embedded from Tally. Data you enter there is
        processed by Tally according to their terms and privacy policy. Completing
        the form is voluntary.
      </p>

      <h2>Withdraw or change consent</h2>
      <p>
        You can change your analytics preference at any time:{" "}
        <ConsentResetLink />. You can also clear site data for this domain in
        your browser settings.
      </p>

      <p className="legal-back">
        <Link href="/">← Back to ISAR Unfiltered</Link>
        {" · "}
        <Link href="/impressum">Impressum</Link>
      </p>
    </LegalShell>
  );
}
