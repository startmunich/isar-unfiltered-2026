import { SnapSections } from "@/components/frames/SnapSections";
import { DesktopHome } from "@/components/home/DesktopHome";
import { MobileHome } from "@/components/home/MobileHome";
import { ResponsiveFrame } from "@/components/layout/ResponsiveFrame";
import { HomeJsonLd } from "@/components/seo/HomeJsonLd";
import { listIu25Photos } from "@/lib/iu25";
import { listPartnerLogos } from "@/lib/partners";

export default async function Home() {
  const partnerLogos = await listPartnerLogos();
  const lookbackItems = await listIu25Photos();

  return (
    <>
      <HomeJsonLd />
      <SnapSections />
      <main>
        <ResponsiveFrame
          mobile={
            <MobileHome
              partnerLogos={partnerLogos}
              lookbackItems={lookbackItems}
            />
          }
          desktop={<DesktopHome partnerLogos={partnerLogos} />}
        />
      </main>
    </>
  );
}
