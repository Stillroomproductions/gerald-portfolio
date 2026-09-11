import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// ── Canonical base URL ────────────────────────────────────────────────────────
// Driven entirely by NEXT_PUBLIC_SITE_URL in .env.local — update that one var
// when the canonical domain (www vs non-www) is confirmed in Vercel.
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://geraldgyimah.com";

// ── Root Metadata ─────────────────────────────────────────────────────────────
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),

  title: {
    default: "Gerald Gyimah — Writer / Director",
    template: "%s | Gerald Gyimah",
  },

  description:
    "Gerald Gyimah is a London-based writer and director making films about institutional space, procedural language, and unspoken pressure. Founder, Still Room Productions.",

  keywords: [
    // Tier 1 — Branded (winnable #1, low competition)
    "Gerald Gyimah",
    "Gerald Gyimah director",
    "Gerald Gyimah writer director",
    "Still Room Productions",
    "Gerald Gyimah films",
    "Gerald Gyimah IMDb",
    // Tier 2 — Niche descriptive (winnable with strong on-page content)
    "institutional space filmmaker",
    "procedural drama short film",
    "British writer director London",
    "independent film production company London",
    "short film about bureaucracy",
    "filmmaker exploring institutions",
    "emerging UK film director",
    "London based writer director portfolio",
    // Tier 3 — Long-tail per-film (near-zero competition, high intent)
    "On Record short film Gerald Gyimah",
    "Protocol short film 2026",
    "The Consultation short film",
    "Assessment short film director",
    "Gerald Gyimah Breakable",
    "Gerald Gyimah EastEnders director",
    "Gerald Gyimah London based filmmaker",
  ],

  authors: [{ name: "Gerald Gyimah", url: siteUrl }],
  creator: "Gerald Gyimah",
  publisher: "Still Room Productions",
  category: "Film Production",

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },

  openGraph: {
    type: "website",
    locale: "en_GB",
    url: siteUrl,
    siteName: "Still Room Productions",
    title: "Gerald Gyimah — Writer / Director",
    description:
      "Gerald Gyimah is a London-based writer and director making films about institutional space, procedural language, and unspoken pressure. Founder, Still Room Productions.",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Gerald Gyimah — Writer / Director",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Gerald Gyimah — Writer / Director",
    description:
      "Gerald Gyimah is a London-based writer and director making films about institutional space, procedural language, and unspoken pressure. Founder, Still Room Productions.",
    images: ["/opengraph-image"],
  },

  alternates: {
    canonical: siteUrl,
  },

  // Google Search Console verification — set NEXT_PUBLIC_GSC_VERIFICATION in .env.local
  ...(process.env.NEXT_PUBLIC_GSC_VERIFICATION
    ? { verification: { google: process.env.NEXT_PUBLIC_GSC_VERIFICATION } }
    : {}),
};

// ── JSON-LD Schemas ───────────────────────────────────────────────────────────

const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  "@id": `${siteUrl}/#gerald-gyimah`,
  name: "Gerald Gyimah",
  jobTitle: "Writer/Director",
  description:
    "London-based writer and director making films about institutional space, procedural language, and unspoken pressure.",
  url: siteUrl,
  worksFor: {
    "@type": "Organization",
    "@id": `${siteUrl}/#still-room-productions`,
    name: "Still Room Productions",
  },
  sameAs: [
    "https://www.imdb.com/name/nm10308534/",
    "https://www.instagram.com/gerald.gyimah/",
    "https://oldvic.ac.uk/student/gerald-gyimah/"
  ],
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${siteUrl}/#still-room-productions`,
  name: "Still Room Productions",
  url: "https://www.stillroomproductions.com",
  founder: {
    "@type": "Person",
    "@id": `${siteUrl}/#gerald-gyimah`,
    name: "Gerald Gyimah",
  },
  address: {
    "@type": "PostalAddress",
    addressLocality: "London",
    addressCountry: "GB",
  },
  sameAs: [
    "https://www.stillroomproductions.com",
    "https://www.instagram.com/stillroomproductions",
    "https://www.youtube.com/@stillroomprod",
    "https://www.tiktok.com/@stillroomproductions"
  ],
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${siteUrl}/#website`,
  url: siteUrl,
  name: "Gerald Gyimah",
  description:
    "Portfolio of London-based writer and director Gerald Gyimah — Still Room Productions.",
  inLanguage: "en-GB",
  publisher: {
    "@type": "Person",
    "@id": `${siteUrl}/#gerald-gyimah`,
    name: "Gerald Gyimah",
  },
};

function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

// ── Layout ────────────────────────────────────────────────────────────────────

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en-GB"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <JsonLd data={personSchema} />
        <JsonLd data={organizationSchema} />
        <JsonLd data={websiteSchema} />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
