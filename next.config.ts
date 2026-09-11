import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,

  // ── Performance ───────────────────────────────────────────────────────────
  compress: true,
  poweredByHeader: false,

  // ── Images ────────────────────────────────────────────────────────────────
  images: {
    // cdn.sanity.io required for Sanity-hosted stills
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
      },
    ],
    // Serve modern formats where the browser supports them
    formats: ["image/avif", "image/webp"],
  },

  // ── Security headers ──────────────────────────────────────────────────────
  // NOTE: If Vercel already handles www → non-www (or vice-versa) redirects
  // at the edge, do NOT add a redirect here — it would create a loop.
  // These headers apply to all routes served by Next.js.
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
