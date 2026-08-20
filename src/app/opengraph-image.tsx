import { ImageResponse } from "next/og";

export const alt = "Koło Łowieckie „Bór”";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: 80,
          background: "linear-gradient(160deg, #0d1f14 0%, #0b0c0b 72%)",
          color: "#f3ead6",
        }}
      >
        <div
          style={{
            fontSize: 22,
            letterSpacing: 8,
            color: "#c9a227",
            textTransform: "uppercase",
          }}
        >
          Koło Łowieckie
        </div>
        <div
          style={{
            fontSize: 92,
            marginTop: 16,
            fontStyle: "italic",
            lineHeight: 1,
          }}
        >
          „Bór”
        </div>
        <div
          style={{
            marginTop: 28,
            fontSize: 28,
            color: "#cbbfa3",
            maxWidth: 760,
          }}
        >
          Las nas zobowiązuje. Gospodarka łowiecka i tradycja od 1978 roku.
        </div>
      </div>
    ),
    { ...size },
  );
}
