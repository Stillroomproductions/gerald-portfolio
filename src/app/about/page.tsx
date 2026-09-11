import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Image from "next/image";
import Link from "next/link";
import { colors, typography } from "@/assets/util";
import { getAllProjects } from "@/lib/queries";
// import person1 from "@/assets/images/person1.jpg";
// import person2 from "@/assets/images/person2.jpg";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://geraldgyimah.com";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn more about Gerald Gyimah, a London-based writer and director exploring institutional spaces, procedural language, and unspoken pressure.",
  alternates: {
    canonical: `${siteUrl}/about`,
  },
  openGraph: {
    title: "About | Gerald Gyimah",
    description:
      "Learn more about Gerald Gyimah, a London-based writer and director exploring institutional spaces and systems.",
    url: `${siteUrl}/about`,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "About | Gerald Gyimah",
    description:
      "Learn more about Gerald Gyimah, a London-based writer and director exploring institutional spaces and systems.",
  },
};

export default async function AboutPage() {
  const allProjects = await getAllProjects();
  // Show top 3 projects as "Selected Work"
  const selectedWork = allProjects.slice(0, 3).map((p) => ({
    title: p.title,
    year: p.status === "In Development" ? `${p.year} — In Development` : String(p.year),
    slug: p.slug,
  }));
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
        {/* ── Grid ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 min-h-screen">
          {/* ── Left ── */}
          <div
            className="flex flex-col px-6 md:px-12 pb-12 md:pb-20 md:border-r"
            style={{ borderColor: colors.border }}
          >
            {/* Section label */}
            <div
              className="py-8 md:py-10"
              style={{ borderBottom: `1px solid ${colors.border}` }}
            >
              <h1
                className="text-[9px] uppercase font-normal m-0"
                style={{
                  color: colors.text.tertiary,
                  letterSpacing: typography.tracking.widest,
                }}
              >
                About — Gerald Gyimah
              </h1>
            </div>

            {/* Bio */}
            <div className="flex flex-col gap-6 mt-8 md:mt-10 max-w-md">
              <p
                className="font-light"
                style={{
                  fontSize: "14px",
                  color: colors.text.primary,
                  lineHeight: typography.leading.loose,
                }}
              >
                Gerald Gyimah is a writer and director working in fiction film
                and documentary. His work is concerned with stillness,
                institutional space, and the weight of what remains unspoken.
              </p>

              <p
                className="font-light"
                style={{
                  fontSize: "14px",
                  color: colors.text.primary,
                  lineHeight: typography.leading.loose,
                }}
              >
                He is the founder of Still Room Productions, through which he
                develops and produces independent work. He is based in London.
              </p>

              <p
                className="font-light"
                style={{
                  fontSize: "12px",
                  color: colors.text.tertiary,
                  lineHeight: typography.leading.relaxed,
                }}
              >
                Acting work is available on request.
              </p>
            </div>

            {/* Divider */}
            <div
              className="mt-12 md:mt-14 mb-0"
              style={{ borderTop: `1px solid ${colors.border}` }}
            />

            {/* Selected Work */}
            <div className="mt-8 md:mt-10">
              <p
                className="text-[9px] uppercase pb-3"
                style={{
                  color: colors.text.tertiary,
                  letterSpacing: typography.tracking.widest,
                  borderBottom: `1px solid ${colors.border}`,
                }}
              >
                Selected Work
              </p>

              {selectedWork.map((item) => (
                <Link
                  key={item.slug}
                  href={`/work/${item.slug}`}
                  className="flex justify-between gap-4 py-3 transition-colors duration-200 group"
                  style={{
                    borderBottom: `1px solid ${colors.border}`,
                    textDecoration: "none",
                  }}
                >
                  <span
                    className="text-[12px] font-light transition-colors duration-200"
                    style={{ color: colors.text.secondary }}
                  >
                    {item.title}
                  </span>
                  <span
                    className="text-[11px] tabular-nums whitespace-nowrap"
                    style={{ color: colors.text.tertiary }}
                  >
                    {item.year}
                  </span>
                </Link>
              ))}
            </div>

            {/* Still Room link */}
            <div className="mt-12 md:mt-auto pt-8 md:pt-16">
              <Link
                href="https://stillroomproductions.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[10px] uppercase transition-colors duration-200"
                style={{
                  color: colors.text.tertiary,
                  letterSpacing: typography.tracking.widest,
                  textDecoration: "none",
                }}
              >
                Still Room Productions →
              </Link>
            </div>
          </div>

          {/* ── Right ── */}
          <div className="flex flex-col px-6 md:px-12 pb-12 md:pb-20">
            {/* Spacer to align with left section label — desktop only */}
            <div
              className="hidden md:block py-10"
              style={{ borderBottom: `1px solid ${colors.border}`, opacity: 0 }}
            >
              <span className="text-[9px]">—</span>
            </div>

            {/* Portrait */}
            <div
              className="relative w-full mt-8 md:mt-10 overflow-hidden flex items-end p-4"
              style={{
                aspectRatio: "3/4",
                backgroundColor: colors.background.alt,
                border: `1px solid ${colors.border}`,
              }}
            >
              {/* <Image
                src={person1}
                alt="Gerald Gyimah — portrait"
                fill
                className="object-cover"
                priority
              /> */}
              <span
                className="relative z-10 text-[10px] uppercase"
                style={{
                  color: colors.text.tertiary,
                  letterSpacing: typography.tracking.wide,
                }}
              >
                Portrait
              </span>
            </div>

            {/* Observational / directing image */}
            <div
              className="relative w-full mt-1 overflow-hidden flex items-end p-4"
              style={{
                aspectRatio: "16/9",
                backgroundColor: colors.background.alt,
                border: `1px solid ${colors.border}`,
                borderTop: "none",
              }}
            >
              {/* <Image
                src={person2}
                alt="Gerald Gyimah — on set"
                fill
                className="object-cover"
              /> */}
              <span
                className="relative z-10 text-[10px] uppercase"
                style={{
                  color: colors.text.tertiary,
                  letterSpacing: typography.tracking.wide,
                }}
              >
                On set, undated
              </span>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}