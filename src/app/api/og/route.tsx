import { ImageResponse } from "next/og";
import connectDB from "@/lib/mongodb";
import Hero from "@/models/Hero";
import Navbar from "@/models/Navbar";
import sharp from "sharp";

export const runtime = "nodejs";

async function processImageToBase64(url: string): Promise<string | null> {
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    const arrayBuffer = await res.arrayBuffer();
    const inputBuffer = Buffer.from(arrayBuffer);
    const contentType = (res.headers.get("content-type") || "").toLowerCase();
    let pngBuffer: Buffer;
    if (
      contentType.includes("webp") ||
      url.toLowerCase().endsWith(".webp") ||
      !contentType.includes("png")
    ) {
      pngBuffer = await sharp(inputBuffer).toFormat("png").toBuffer();
    } else {
      pngBuffer = inputBuffer;
    }
    return `data:image/png;base64,${pngBuffer.toString("base64")}`;
  } catch (err) {
    console.warn("OG Image: Image fetch/conversion failed for", url, err);
    return null;
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const titleParam = searchParams.get("title");
    const descriptionParam = searchParams.get("description");
    const typeParam = searchParams.get("type") || "Portfolio";
    const imageParam = searchParams.get("image");

    let title = titleParam;
    let description = descriptionParam;
    let name = "Muhammad Qomarudin";
    let tagline =
      "I build fast, beautiful, and highly scalable web applications, designing interfaces that feel alive and responsive.";
    let imageUrl = imageParam;
    let logoUrl: string | null = null;

    // Fetch Hero and Navbar models from database
    try {
      await connectDB();
      const hero = (await Hero.findOne({}).lean()) as any;
      const navbar = (await Navbar.findOne({}).lean()) as any;
      if (hero) {
        if (hero.name) name = hero.name;
        if (!description && hero.tagline) tagline = hero.tagline;
        if (!imageUrl && hero.imageUrl) imageUrl = hero.imageUrl;
      }
      if (navbar) {
        logoUrl = navbar.imageUrl || navbar.darkImageUrl || null;
      }
    } catch (err) {
      console.error("OG Image: Failed to fetch Hero/Navbar data", err);
    }

    // Safely handle external image fetching & WebP conversion to PNG base64 for Satori
    let validImageUrl: string | null = null;
    if (imageUrl) {
      validImageUrl = await processImageToBase64(imageUrl);
    }

    let validLogoUrl: string | null = null;
    if (logoUrl) {
      validLogoUrl = await processImageToBase64(logoUrl);
    }

    const displayTitle = title || `${name} — Portfolio`;
    const displayDescription = description || tagline;

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
    let domain = "MASQOMAR.COM";
    try {
      const parsedUrl = new URL(siteUrl);
      domain = parsedUrl.hostname.toUpperCase().replace(/^WWW\./, "");
    } catch {
      // fallback domain
    }

    return new ImageResponse(
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          backgroundColor: "#ffffff",
          fontFamily: "sans-serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Top Gradient Accent Line */}
        <div
          style={{
            height: "5px",
            width: "100%",
            background:
              "linear-gradient(90deg, #3b82f6 0%, #10b981 50%, #6366f1 100%)",
          }}
        />

        {/* Main Upper Body */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "row",
            padding: "40px 60px",
            alignItems: "center",
            justifyContent: "space-between",
            position: "relative",
          }}
        >
          {/* Left Content Column */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              width: "580px",
              gap: "20px",
            }}
          >
            {/* Brand Logo / Name Header */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
              }}
            >
              {validLogoUrl ? (
                <img
                  src={validLogoUrl}
                  width="36"
                  height="36"
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "50%",
                    objectFit: "cover",
                  }}
                />
              ) : (
                <div
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "50%",
                    backgroundColor: "#000000",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#ffffff",
                    fontWeight: 900,
                    fontSize: "20px",
                  }}
                >
                  ▲
                </div>
              )}
              <span
                style={{
                  fontSize: "22px",
                  fontWeight: 800,
                  color: "#0f172a",
                  letterSpacing: "-0.5px",
                }}
              >
                {name}
              </span>
            </div>

            {/* Category / Badge Pill */}
            <div style={{ display: "flex" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  backgroundColor: "#d1fae5",
                  borderRadius: "9999px",
                  padding: "6px 18px",
                }}
              >
                <span
                  style={{
                    fontSize: "15px",
                    fontWeight: 700,
                    color: "#059669",
                  }}
                >
                  {typeParam === "Portfolio"
                    ? "Full-stack Developer"
                    : typeParam}
                </span>
              </div>
            </div>

            {/* Main Headline Title */}
            <h1
              style={{
                fontSize: displayTitle.length > 35 ? "40px" : "48px",
                fontWeight: 800,
                lineHeight: 1.15,
                color: "#000000",
                margin: 0,
                letterSpacing: "-1px",
                display: "-webkit-box",
                WebkitLineClamp: 2,
                overflow: "hidden",
              }}
            >
              {displayTitle}
            </h1>

            {/* Description Paragraph */}
            <p
              style={{
                fontSize: "18px",
                lineHeight: 1.5,
                color: "#64748b",
                margin: 0,
                display: "-webkit-box",
                WebkitLineClamp: 2,
                overflow: "hidden",
              }}
            >
              {displayDescription}
            </p>

            {/* Action Button */}
            <div style={{ display: "flex", marginTop: "4px" }}>
              <div
                style={{
                  backgroundColor: "#3b82f6",
                  color: "#ffffff",
                  borderRadius: "10px",
                  padding: "12px 24px",
                  fontWeight: 700,
                  fontSize: "16px",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                {typeParam === "Blog"
                  ? "Read Article"
                  : typeParam === "Project"
                    ? "View Project"
                    : "Explore Portfolio"}
              </div>
            </div>
          </div>

          {/* Right Side Visual Container with Glow Circles */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
              width: "450px",
              height: "370px",
            }}
          >
            {/* Top-Left Soft Mint Glow Circle */}
            <div
              style={{
                position: "absolute",
                top: "0px",
                left: "10px",
                width: "220px",
                height: "220px",
                borderRadius: "50%",
                backgroundColor: "#ccfbf1",
                opacity: 0.8,
              }}
            />
            {/* Bottom-Right Soft Blue Glow Circle */}
            <div
              style={{
                position: "absolute",
                bottom: "0px",
                right: "10px",
                width: "240px",
                height: "240px",
                borderRadius: "50%",
                backgroundColor: "#dbeafe",
                opacity: 0.8,
              }}
            />

            {/* Dark Rounded Image Card */}
            <div
              style={{
                width: "400px",
                height: "320px",
                borderRadius: "24px",
                backgroundColor: "#000000",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
                position: "relative",
                boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
              }}
            >
              {validImageUrl ? (
                <img
                  src={validImageUrl}
                  alt={displayTitle}
                  width="400"
                  height="320"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              ) : (
                /* 3D Geometric Art Graphic matching design sample */
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "100%",
                    height: "100%",
                    backgroundColor: "#050505",
                    position: "relative",
                  }}
                >
                  {/* Perspective Line Grid */}
                  <div
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <div
                      style={{
                        width: "100%",
                        height: "1px",
                        backgroundColor: "rgba(255,255,255,0.15)",
                      }}
                    />
                    <div
                      style={{
                        height: "100%",
                        width: "1px",
                        backgroundColor: "rgba(255,255,255,0.15)",
                        position: "absolute",
                      }}
                    />
                  </div>

                  {/* Central 3D Cross Structure */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      position: "relative",
                      width: "120px",
                      height: "120px",
                    }}
                  >
                    {/* Metallic pillar vertical */}
                    <div
                      style={{
                        position: "absolute",
                        width: "36px",
                        height: "110px",
                        background:
                          "linear-gradient(180deg, #e2e8f0 0%, #94a3b8 50%, #475569 100%)",
                        borderRadius: "4px",
                        boxShadow: "0 0 20px rgba(255,255,255,0.2)",
                      }}
                    />
                    {/* Metallic pillar horizontal */}
                    <div
                      style={{
                        position: "absolute",
                        width: "110px",
                        height: "36px",
                        background:
                          "linear-gradient(90deg, #e2e8f0 0%, #94a3b8 50%, #475569 100%)",
                        borderRadius: "4px",
                        boxShadow: "0 0 20px rgba(255,255,255,0.2)",
                      }}
                    />
                    {/* Center block core with warm glow */}
                    <div
                      style={{
                        position: "absolute",
                        width: "44px",
                        height: "44px",
                        background:
                          "linear-gradient(135deg, #ffffff 0%, #f97316 100%)",
                        borderRadius: "6px",
                        boxShadow: "0 0 15px rgba(249, 115, 22, 0.6)",
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Domain & Title Banner Bar */}
        <div
          style={{
            height: "90px",
            backgroundColor: "#f8fafc",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "0 60px",
            borderTop: "1px solid #e2e8f0",
          }}
        >
          <span
            style={{
              fontSize: "14px",
              fontWeight: 700,
              color: "#64748b",
              letterSpacing: "1.5px",
              textTransform: "uppercase",
            }}
          >
            {domain}
          </span>
          <span
            style={{
              fontSize: "20px",
              fontWeight: 800,
              color: "#0f172a",
              marginTop: "2px",
            }}
          >
            {displayTitle}
          </span>
        </div>
      </div>,
      {
        width: 1200,
        height: 630,
      },
    );
  } catch (e: any) {
    console.error("OG Image generation failed:", e);
    return new Response("Failed to generate OG image", { status: 500 });
  }
}
