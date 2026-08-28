import CircularGallery from "@/components/react-bits/CircularGallery";
import { copy } from "@/lib/copy";
import { listIu25Photos } from "@/lib/iu25";

export async function Lookback() {
  const items = await listIu25Photos();

  return (
    <section
      id="iu2025"
      data-frame-theme="green"
      className="lookback frame frame-green js-snap"
    >
      <h2 className="lookback-title">
        {copy.rev2.lookback.title.map((line) => (
          <span key={line}>{line}</span>
        ))}
      </h2>
      <div className="lookback-gallery">
        <CircularGallery
          items={items}
          bend={3}
          borderRadius={0}
          textColor="#fec700"
          scrollEase={0.02}
          font="900 28px zuume"
        />
      </div>
    </section>
  );
}
