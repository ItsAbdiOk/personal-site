import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Abdirahman Mohamed — AI Engineer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#FAFAF8",
          padding: "80px",
          fontFamily: "serif",
        }}
      >
        {/* Top: eyebrow */}
        <div
          style={{
            fontSize: 22,
            fontWeight: 500,
            color: "#767672",
            letterSpacing: 3,
            textTransform: "uppercase",
            display: "flex",
          }}
        >
          AI ENGINEER · LONDON
        </div>

        {/* Middle: name + tagline */}
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div
            style={{
              fontSize: 96,
              color: "#1A1A18",
              lineHeight: 1.05,
              letterSpacing: -1,
              display: "flex",
            }}
          >
            Abdirahman Mohamed
          </div>
          <div
            style={{
              fontSize: 44,
              color: "#1A1A18",
              lineHeight: 1.2,
              display: "flex",
              flexWrap: "wrap",
              gap: "0 14px",
            }}
          >
            <span>Building things at the edge of</span>
            <span style={{ fontStyle: "italic", color: "#6E6E68" }}>language</span>
            <span>and machine.</span>
          </div>
        </div>

        {/* Bottom: footer with hairline */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 20,
          }}
        >
          <div
            style={{
              width: "100%",
              height: 1,
              background: "#E8E8E4",
              display: "flex",
            }}
          />
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: 22,
              color: "#767672",
              fontFamily: "sans-serif",
            }}
          >
            <span>abdirahmanmohamed.dev</span>
            <span>MSc AI · Queen Mary University of London</span>
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
