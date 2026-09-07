import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { colors, typography } from "@/assets/util";
import { getAllProjects, getSiteSettings } from "@/lib/queries";
import { SanityPicture } from "@/components/SanityPicture";
import { hasImageAsset } from "@/lib/imageUrl";

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
  const [allProjects, settings] = await Promise.all([
    getAllProjects(),
    getSiteSettings(),
  ]);

  // Show top 3 projects as "Selected Work". `year` can be unset in Sanity, so
  // the label is built from whatever is present rather than printing "null".
  const selectedWork = allProjects.slice(0, 3).map((p) => {
    const year = p.year ? String(p.year) : "";
    const inDevelopment = p.status === "In Development";
    return {
      title: p.title,
      year: inDevelopment ? [year, "In Development"].filter(Boolean).join(" — ") : year,
      slug: p.slug,
    };
  });

  // Drop the whole right-hand column when neither photo has been uploaded, so
  // the page never shows the empty outlined boxes it used to.
  const hasImages =
    hasImageAsset(settings?.portrait) || hasImageAsset(settings?.onSetImage);
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

          {/* ── Right ──
              Both slots come from Site Settings in the Studio. An empty slot
              renders nothing rather than an outlined placeholder box, and if
              neither image is set the whole column is dropped so the grid does
              not reserve half the page for empty space. */}
          {hasImages ? (
            <div className="flex flex-col px-6 md:px-12 pb-12 md:pb-20">
              {/* Spacer to align with left section label — desktop only */}
              <div
                className="hidden md:block py-10"
                style={{ borderBottom: `1px solid ${colors.border}`, opacity: 0 }}
                aria-hidden="true"
              >
                <span className="text-[9px]">—</span>
              </div>

              {/* Portrait */}
              <SanityPicture
                source={settings?.portrait}
                aspectRatio="3/4"
                sizes="(max-width: 768px) 100vw, 45vw"
                alt="Gerald Gyimah — portrait"
                className="mt-8 md:mt-10"
                priority
              />

              {/* Observational / on-set image */}
              <SanityPicture
                source={settings?.onSetImage}
                aspectRatio="16/9"
                sizes="(max-width: 768px) 100vw, 45vw"
                alt="Gerald Gyimah on set"
                className="mt-1"
                caption={settings?.onSetImage?.caption}
              />
            </div>
          ) : null}
        </div>
      </main>
      <Footer />
    </>
  );
}