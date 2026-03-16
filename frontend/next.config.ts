import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // ── Image Optimization ────────────────────────────────────────
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 86400, // 24h
    remotePatterns: [
      // Backend API uploads (production)
      {
        protocol: "https",
        hostname: "api.kalimhs.com",
        pathname: "/uploads/**",
      },
      // Local development
      {
        protocol: "http",
        hostname: "localhost",
        port: "5000",
        pathname: "/uploads/**",
      },
      // AWS S3 — locked to the project bucket
      {
        protocol: "https",
        hostname: "kali-mhs-assets.s3.ap-south-1.amazonaws.com",
        pathname: "/**",
      },
      // Cloudinary (if using)
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
    ],
  },

  // ── Performance ───────────────────────────────────────────────
  compress: true,
  poweredByHeader: false,
  generateEtags: true,

  // ── Security Headers ──────────────────────────────────────────
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-DNS-Prefetch-Control", value: "on" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
      // Cache static assets aggressively
      {
        source: "/_next/static/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
      // Cache images
      {
        source: "/images/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=86400, stale-while-revalidate=43200" }],
      },
    ];
  },

  // ── Redirects ─────────────────────────────────────────────────
  async redirects() {
    return [
      // Add any URL redirects here if needed in future
    ];
  },
};

export default nextConfig;
