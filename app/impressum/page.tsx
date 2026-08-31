import type { Metadata } from "next";
import Link from "next/link";
import { LegalShell } from "@/components/legal/LegalShell";

export const metadata: Metadata = {
  title: "Impressum",
  description:
    "Legal notice for ISAR Unfiltered — STARTmunich e.V., Munich.",
  alternates: { canonical: "/impressum" },
};

export default function ImpressumPage() {
  return (
    <LegalShell title="Impressum">
      <h2>Information in accordance with § 5 DDG</h2>
      <p>
        STARTmunich e.V.
        <br />
        Arcisstrasse 21
        <br />
        80333 Munich
        <br />
        <a href="mailto:info@startmunich.de">info@startmunich.de</a>
      </p>

      <h2>Registry Entry</h2>
      <p>
        Entry in Vereinsregister.
        <br />
        Register court: München
        <br />
        Register number: 18536
      </p>

      <h2>Disclaimer</h2>

      <h3>Liability for Content</h3>
      <p>
        The content of our pages was created with the utmost care. However, we
        cannot guarantee the correctness, completeness, or topicality of the
        content. According to § 7 (1) DDG, as a service provider, we are
        responsible for our own content on these pages in accordance with
        general laws. According to § 7 DDG and Article 8 of the Digital Services
        Act (DSA), however, we are not obliged to monitor transmitted or stored
        third-party information or to investigate circumstances that indicate
        illegal activity. Obligations to remove or block the use of information
        in accordance with general laws remain unaffected. However, liability in
        this respect is only possible from the time of knowledge of a concrete
        violation of the law. As soon as we become aware of such infringements,
        we will remove this content immediately.
      </p>

      <h3>Liability for Links</h3>
      <p>
        Our website contains links to third-party websites over whose content we
        have no control. Therefore, we cannot take any responsibility for those
        external contents. The respective provider or operator of the websites
        is always responsible for its content. The linked websites were checked
        for possible legal infringements at the time of the linking. Illegal
        contents were not identifiable at the time of the linking. However, a
        permanent control of the content of the linked websites is not
        reasonable without concrete evidence of an infringement. We will remove
        such links immediately upon becoming aware of any violations of the law.
      </p>

      <h3>Copyright</h3>
      <p>
        The content and works on this website created by the site operators are
        subject to German copyright law. Duplication, processing, distribution
        and any form of commercialization of such material beyond the scope of
        the copyright law shall require the prior written consent of its
        respective author or creator. Downloads and copies of this website is
        only permitted for private, non-commercial use. Insofar as the content
        on this website was not created by the operator, the copyrights of third
        parties are respected. In particular, contents of third parties are
        marked as such. Should you nonetheless become aware of a copyright
        infringement, please inform us about it. As soon as we become aware of
        any infringements of the law, we will remove such content immediately.
      </p>

      <p className="legal-back">
        <Link href="/">← Back to ISAR Unfiltered</Link>
      </p>
    </LegalShell>
  );
}
