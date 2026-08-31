import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "ISAR Unfiltered 2026 — Munich, 27–30 September";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function TwitterImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#02462e",
          color: "#fec700",
          padding: "64px 72px",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 28,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            opacity: 0.9,
          }}
        >
          Bits & Pretzels Scholarship
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div
            style={{
              fontSize: 92,
              fontWeight: 900,
              lineHeight: 0.9,
              letterSpacing: "-0.02em",
              textTransform: "uppercase",
            }}
          >
            ISAR
            <br />
            Unfiltered
          </div>
          <div style={{ fontSize: 32, letterSpacing: "0.04em" }}>
            Munich · 27–30 September 2026
          </div>
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 24,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
          }}
        >
          isarunfiltered.eu
        </div>
      </div>
    ),
    { ...size },
  );
}
