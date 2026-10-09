import { ImageResponse } from "next/og";
import { site } from "@/lib/site";

export const alt = `${site.brand} — ${site.name}, Cinematographer, Director & Colourist`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Typographic title card — no remote assets, so it builds offline. */
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px 72px",
          background: "radial-gradient(ellipse at 75% 30%, #3a2614 0%, #120c07 45%, #050505 80%)",
          color: "#ece8e1",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 22, letterSpacing: 6, color: "#b9b3a9" }}>
          <span style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <span style={{ width: 12, height: 12, borderRadius: 12, background: "#c4352b" }} />
            {site.brandUpper}
          </span>
          <span>{site.url.replace(/^https?:\/\//, "").toUpperCase()}</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 168, fontWeight: 700, lineHeight: 0.86, letterSpacing: -8 }}>SUBODIT</div>
          <div style={{ fontSize: 168, fontWeight: 700, lineHeight: 0.86, letterSpacing: -8 }}>ARYA</div>
          <div style={{ marginTop: 28, fontSize: 30, letterSpacing: 4, color: "#d9a45b" }}>
            CINEMATOGRAPHER · DIRECTOR · COLOURIST
          </div>
        </div>
      </div>
    ),
    size,
  );
}
