import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { colors, typography } from "@/assets/util";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://geraldgyimah.com";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with Gerald Gyimah — London-based writer and director. Available for commissions, collaboration, and press enquiries via Still Room Productions.",
  alternates: {
    canonical: `${siteUrl}/contact`,
  },
  openGraph: {
    title: "Contact | Gerald Gyimah",
    description:
      "Get in touch with Gerald Gyimah — London-based writer and director. Available for commissions, collaboration, and press enquiries via Still Room Productions.",
    url: `${siteUrl}/contact`,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact | Gerald Gyimah",
    description:
      "Get in touch with Gerald Gyimah — London-based writer and director. Available for commissions, collaboration, and press enquiries via Still Room Productions.",
  },
};


const enquiries = [
  {
    label: "General",
    href: "mailto:hello@geraldgyimah.com",
    value: "hello@geraldgyimah.com",
  },
  {
    label: "Press",
    href: "mailto:press@geraldgyimah.com",
    value: "press@geraldgyimah.com",
  },
  {
    label: "Still Room Productions",
    href: "https://stillroomproductions.com",
    value: "stillroomproductions.com",
  },
];

const links = [
  { label: "IMDb", href: "https://pro.imdb.com/name/nm10308534/public/?ref_=ext_shr_wts", value: "/geraldgyimah" },
  { label: "Vimeo", href: "https://vimeo.com", value: "/geraldgyimah" },
  { label: "Instagram", href: "https://www.instagram.com/gerald.gyimah/", value: "@gerald.gyimah" },
];

function ContactRow({
  label,
  href,
  value,
}: {
  label: string;
  href: string;
  value: string;
}) {
  return (
    <Link
      href={href}
      target={href.startsWith("http") ? "_blank" : undefined}
      rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
      className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-4 py-4 transition-colors duration-200 group"
      style={{
        borderBottom: `1px solid ${colors.border}`,
        textDecoration: "none",
      }}
    >
      <span
        className="text-[10px] uppercase"
        style={{
          color: colors.text.tertiary,
          letterSpacing: typography.tracking.widest,
        }}
      >
        {label}
      </span>
      <span
        className="text-[11px] transition-colors duration-200 flex items-center gap-2"
        style={{
          color: colors.text.secondary,
          letterSpacing: typography.tracking.wide,
        }}
      >
        {value}
        <span
          className="opacity-0 group-hover:opacity-100 transition-opacity duration-200"
          style={{ color: colors.text.tertiary }}
        >
          →
        </span>
      </span>
    </Link>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p
      className="text-[9px] uppercase pb-3"
      style={{
        color: colors.text.tertiary,
        letterSpacing: typography.tracking.widest,
        borderBottom: `1px solid ${colors.border}`,
      }}
    >
      {children}
    </p>
  );
}

export default function ContactPage() {
  return (
    <>
      <Navbar />
      <main
        className="min-h-screen pt-[72px]"
        style={{
          backgroundColor: colors.background.main,
          fontFamily: typography.fonts.primary,
        }}
      >
        {/* ── Page header ── */}
        <div
          className="flex items-end justify-between px-6 md:px-12 py-10"
          style={{ borderBottom: `1px solid ${colors.border}` }}
        >
          <h1
            className="text-[10px] uppercase font-normal m-0"
            style={{
              color: colors.text.tertiary,
              letterSpacing: typography.tracking.widest,
            }}
          >
            Contact
          </h1>
          <span
            className="text-[10px] uppercase"
            style={{
              color: colors.text.tertiary,
              letterSpacing: typography.tracking.widest,
            }}
          >
            London, UK
          </span>
        </div>

        {/* ── Columns ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 px-6 md:px-12 py-10 md:py-16 gap-0">
          {/* Left — Enquiries */}
          <div
            className="pb-12 md:pb-0 md:pr-16 md:border-r"
            style={{ borderColor: colors.border }}
          >
            <SectionLabel>{/* Representation &amp; */}Enquiries</SectionLabel>

            <p
              className="font-light mt-8 mb-10 max-w-sm"
              style={{
                fontSize: "14px",
                color: colors.text.secondary,
                lineHeight: typography.leading.loose,
              }}
            >
              For enquiries regarding projects, commissions, collaboration, or
              press — please use the contacts below.
            </p>

            <div className="flex flex-col">
              {enquiries.map((item) => (
                <ContactRow
                  key={item.label}
                  label={item.label}
                  href={item.href}
                  value={item.value}
                />
              ))}
            </div>
          </div>

          {/* Right — Links */}
          <div className="pt-12 md:pt-0 md:pl-16">
            <SectionLabel>Links</SectionLabel>

            <div className="flex flex-col mt-8">
              {links.map((item) => (
                <ContactRow
                  key={item.label}
                  label={item.label}
                  href={item.href}
                  value={item.value}
                />
              ))}
            </div>

            {/* Location block */}
            <div
              className="mt-12 md:mt-16 pt-8"
              style={{ borderTop: `1px solid ${colors.border}` }}
            >
              <p
                className="text-[9px] uppercase mb-4"
                style={{
                  color: colors.text.tertiary,
                  letterSpacing: typography.tracking.widest,
                }}
              >
                Location
              </p>
              <p
                className="font-light"
                style={{
                  fontSize: "13px",
                  color: colors.text.secondary,
                  lineHeight: typography.leading.relaxed,
                }}
              >
                London, United Kingdom
                <br />
                Available for projects internationally.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}