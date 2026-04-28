import { ImageResponse } from "next/og"

export const size = { width: 1200, height: 630 }
export const contentType = "image/png"
export const alt = "3Dиво — магазин 3D-виробів в Україні"

export default async function Image() {
  const fontRes = await fetch(
    "https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiJ-Ek-_EeA.woff"
  )
  const fontData = await fontRes.arrayBuffer()

  return new ImageResponse(
    (
      <div
        style={{
          background: "#0D1B2A",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "Inter",
          position: "relative",
        }}
      >
        {/* Top gradient bar */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "8px",
            background: "linear-gradient(to right, #1A8FE3, #F5821F)",
          }}
        />

        {/* Blue glow blob */}
        <div
          style={{
            position: "absolute",
            top: "-80px",
            left: "-80px",
            width: "400px",
            height: "400px",
            borderRadius: "50%",
            background: "#1A8FE3",
            opacity: 0.07,
            filter: "blur(80px)",
          }}
        />

        {/* Orange glow blob */}
        <div
          style={{
            position: "absolute",
            bottom: "-60px",
            right: "-60px",
            width: "350px",
            height: "350px",
            borderRadius: "50%",
            background: "#F5821F",
            opacity: 0.1,
            filter: "blur(80px)",
          }}
        />

        {/* Site name */}
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            marginBottom: "24px",
          }}
        >
          <span style={{ fontSize: "96px", fontWeight: 800, color: "#1A8FE3" }}>3D</span>
          <span style={{ fontSize: "96px", fontWeight: 800, color: "#F5821F" }}>иво</span>
        </div>

        {/* Tagline */}
        <div
          style={{
            fontSize: "30px",
            color: "rgba(255,255,255,0.65)",
            textAlign: "center",
            maxWidth: "760px",
            lineHeight: 1.4,
            marginBottom: "48px",
          }}
        >
          Унікальні вироби з 3D-друку — готові до відправки по всій Україні
        </div>

        {/* Pills */}
        <div style={{ display: "flex", gap: "16px" }}>
          <div
            style={{
              background: "#1A8FE3",
              color: "white",
              padding: "12px 28px",
              borderRadius: "100px",
              fontSize: "20px",
              fontWeight: 600,
            }}
          >
            В наявності
          </div>
          <div
            style={{
              border: "2px solid rgba(245,130,31,0.6)",
              color: "#F5821F",
              padding: "12px 28px",
              borderRadius: "100px",
              fontSize: "20px",
              fontWeight: 600,
            }}
          >
            Швидка відправка
          </div>
          <div
            style={{
              border: "2px solid rgba(255,255,255,0.15)",
              color: "rgba(255,255,255,0.6)",
              padding: "12px 28px",
              borderRadius: "100px",
              fontSize: "20px",
              fontWeight: 600,
            }}
          >
            Доставка по Україні
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [{ name: "Inter", data: fontData, style: "normal", weight: 800 }],
    }
  )
}
