import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import Image from "next/image";
import { colors, typography } from "@/assets/util";
import { getAllProjects, getProjectBySlug } from "@/lib/queries";
import type { Credit } from "@/lib/types";
import { SanityPicture, SanityPoster } from "@/components/SanityPicture";
import { hasImageAsset, ogImageUrl, sanityImage } from "@/lib/imageUrl";
import { videoEmbedUrl } from "@/lib/videoEmbed";

// ── Helpers ────────────────────────────────────────────────────────────────

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://geraldgyimah.com";

// ── Static generation ──────────────────────────────────────────────────────
// Tell Next.js all valid slugs at build time so /work/[slug] pages are
// statically generated. Falls back to dynamic rendering if Sanity is down.
export async function generateStaticParams() {
  const projects = await getAllProjects();
  return projects.map((p) => ({ slug: p.slug }));
}

// ── Per-film metadata ──────────────────────────────────────────────────────
// Each film gets its own unique title, description, canonical URL, and OG
// image pulled from Sanity. This prevents duplicate meta descriptions across
// film pages — a real risk without generateMetadata.
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    return {
      title: "Film Not Found",
      robots: { index: false, follow: false },
    };
  }

  // Prefer synopsis (SEO-tuned, ≤160 chars) → logline → generic fallback
  const description =
    project.synopsis ||
    project.logline ||
    `${project.title} — a ${project.format?.toLowerCase() ?? "short film"} written and directed by Gerald Gyimah. Still Room Productions, London.`;

  // OG image: the first Sanity still cropped to 1200×630, or the static
  // site-level OG image as fallback. Built through the URL builder so the
  // share card is framed by the hotspot rather than centre-cropped.
  const ogStill = project.stills?.find(hasImageAsset);
  const ogImage =
    (ogStill && ogImageUrl(ogStill)) || `${siteUrl}/opengraph-image`;

  const canonicalUrl = `${siteUrl}/work/${slug}`;

  return {
    title: project.title,
    description,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title: `${project.title} | Gerald Gyimah`,
      description,
      url: canonicalUrl,
      type: "website",
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: `${project.title} — directed by Gerald Gyimah`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${project.title} | Gerald Gyimah`,
      description,
      images: [ogImage],
    },
  };
}

// ── JSON-LD: CreativeWork schema for each film ─────────────────────────────
// Using CreativeWork rather than Movie — short indie festival films don't
// reliably qualify for Movie rich results, and CreativeWork is more accurate.
function buildFilmSchema(project: {
  title: string;
  logline?: string;
  synopsis?: string;
  format?: string;
  year?: number;
  releaseDate?: string;
  slug: string;
  production?: { company?: string; country?: string };
}) {
  const description =
    project.synopsis ||
    project.logline ||
    `${project.title}, directed by Gerald Gyimah.`;

  return {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.title,
    description,
    url: `${siteUrl}/work/${project.slug}`,
    ...(project.releaseDate ? { datePublished: project.releaseDate } : {}),
    ...(project.year ? { copyrightYear: project.year } : {}),
    inLanguage: "en-GB",
    countryOfOrigin: {
      "@type": "Country",
      name: "United Kingdom",
    },
    director: {
      "@type": "Person",
      "@id": `${siteUrl}/#gerald-gyimah`,
      name: "Gerald Gyimah",
    },
    productionCompany: {
      "@type": "Organization",
      "@id": `${siteUrl}/#still-room-productions`,
      name: "Still Room Productions",
    },
  };
}


// ---------- sub-components ----------

/** One label/value row. Renders nothing when the field is unset in Sanity. */
function MetaRow({
  label,
  value,
}: {
  label: string;
  value?: string;
}) {
  if (!value) return null;
  return (
    <div
      className="flex items-baseline justify-between gap-4 py-3"
      style={{ borderBottom: `1px solid ${colors.border}` }}
    >
      <p
        className="text-[10px] uppercase whitespace-nowrap"
        style={{
          color: colors.text.tertiary,
          letterSpacing: typography.tracking.widest,
        }}
      >
        {label}
      </p>
      <p
        className="text-[13px] text-right"
        style={{
          color: colors.text.primary,
          letterSpacing: typography.tracking.normal,
        }}
      >
        {value}
      </p>
    </div>
  );
}

function SidebarLabel({ children }: { children: React.ReactNode }) {
  return (
    <p
      className="text-[10px] uppercase pb-3 mb-0"
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

function CreditRow({ role, name }: { role: string; name: string }) {
  return (
    <div
      className="flex justify-between py-2 text-[12px]"
      style={{ borderBottom: `1px solid ${colors.border}` }}
    >
      <span style={{ color: colors.text.tertiary }}>{role}</span>
      <span style={{ color: colors.text.secondary }}>{name}</span>
    </div>
  );
}

// ---------- page ----------

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  // notFound() sends a real HTTP 404. The page previously rendered its own
  // "not found" message with a 200 status, which invites search engines to
  // index every mistyped URL as a valid page.
  if (!project) {
    notFound();
  }

  const validStills = project.stills?.filter(hasImageAsset) ?? [];
  const stills = validStills.length > 0 ? validStills : null;

  // Only a recognised Vimeo/YouTube link produces an embed; anything else
  // renders no video section at all.
  const trailer = videoEmbedUrl(project.trailerUrl);
  const festivals = project.festivalSelections?.filter((f) => f?.name) ?? [];

  const formatDuration = (d?: string) => {
    if (!d) return d;
    const str = String(d).trim();
    if (/^\d+$/.test(str)) return `${str} mins`;
    if (/^\d+\s*min(s)?$/i.test(str)) return `${str.replace(/min(s)?$/i, '').trim()} mins`;
    return str;
  };

  const processCredits = (credits?: Credit[]) => {
    if (!credits) return [];
    const directors = credits.filter((c) => c.role?.toLowerCase() === 'director');
    const writers = credits.filter((c) => c.role?.toLowerCase() === 'writer');
    const shouldCombine = directors.length === 1 && writers.length === 1 && directors[0].name === writers[0].name;
    const processed: Credit[] = [];

    if (shouldCombine) {
      processed.push({ role: 'Written & Directed by', name: directors[0].name });
    }

    credits.forEach((c) => {
      if (!c.role) return;
      const roleLower = c.role.toLowerCase();
      if (shouldCombine && (roleLower === 'director' || roleLower === 'writer')) return;

      const roleName = roleLower === 'cast' ? 'Starring' : c.role;
      processed.push({ role: roleName, name: c.name });
    });

    return processed;
  };

  const displayDuration = formatDuration(project.duration);
  const displayStatus = project.status?.toLowerCase() === 'complete' ? 'Completed' : project.status;
  const processedCredits = processCredits(project.credits);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(buildFilmSchema(project)),
        }}
      />
      <Navbar />
      <main
        style={{
          backgroundColor: colors.background.main,
          fontFamily: typography.fonts.primary,
        }}
      >
        {/* ── Header: back link + title ── */}
        <div
          className="px-6 md:px-12 pt-[88px] pb-6 md:pt-[100px] md:pb-6"
          style={{ borderBottom: `1px solid ${colors.border}` }}
        >
          <Link
            href="/work"
            className="inline-block text-[10px] uppercase mb-3 transition-colors duration-200"
            style={{
              color: colors.text.tertiary,
              letterSpacing: typography.tracking.widest,
              textDecoration: "none",
            }}
          >
            ← Work Index
          </Link>
          <h1
            className="font-light tracking-[-0.02em]"
            style={{
              fontSize: "clamp(28px, 3.2vw, 42px)",
              color: colors.text.primary,
              lineHeight: typography.leading.tight,
            }}
          >
            {project.title}
          </h1>
        </div>

        <div className="flex flex-col md:flex-row">
          {/* ── Images (primary content, shown first) ── */}
          <div className="order-1 md:order-1 md:flex-1">
            {/* Stills grid. Each slot is a fixed 16:10 crop, so the hotspot
                set in the Studio decides what survives the crop. Nothing is
                rendered at all when a film has no stills. */}
            {stills ? (
              <div
                className="grid grid-cols-1 sm:grid-cols-2"
                style={{ gap: "1px", backgroundColor: colors.border }}
              >
                {stills.map((still, i) => (
                  <SanityPicture
                    key={still._key ?? i}
                    source={still}
                    aspectRatio="16/10"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    alt={`${project.title} — still ${i + 1}`}
                    priority={i === 0}
                  />
                ))}
              </div>
            ) : null}

            {/* ── Trailer / teaser ──
                Only rendered when the editor has added a recognised Vimeo or
                YouTube link. No autoplay — the visitor presses play. */}
            {trailer ? (
              <section className="px-6 md:px-8 py-10">
                <SidebarLabel>{project.trailerLabel || "Trailer"}</SidebarLabel>
                <div
                  className="relative w-full mt-6"
                  style={{ aspectRatio: "16/9", backgroundColor: colors.background.alt }}
                >
                  <iframe
                    src={trailer}
                    title={`${project.title} — ${(project.trailerLabel || "trailer").toLowerCase()}`}
                    className="absolute top-0 left-0 w-full h-full border-0"
                    allow="fullscreen; picture-in-picture"
                    referrerPolicy="strict-origin-when-cross-origin"
                    loading="lazy"
                    allowFullScreen
                  />
                </div>
              </section>
            ) : null}

            {/* ── Festivals / official selections ──
                Hidden entirely when no festivals have been added. */}
            {festivals.length > 0 ? (
              <section className="px-6 md:px-8 py-10">
                <SidebarLabel>Festivals &amp; Official Selections</SidebarLabel>
                <ul className="list-none mt-6 flex flex-col">
                  {festivals.map((festival, i) => {
                    const laurel = sanityImage(festival.laurel, 200, "");
                    return (
                      <li
                        key={festival._key ?? `${festival.name}-${i}`}
                        className="flex items-center gap-4 py-3"
                        style={{ borderBottom: `1px solid ${colors.border}` }}
                      >
                        {laurel ? (
                          // Laurels are shown whole, never cropped — a laurel
                          // with its edges cut off looks broken. `width`/`height`
                          // here are an upper bound; the CSS keeps the real
                          // aspect ratio.
                          <Image
                            src={laurel.src}
                            alt={laurel.alt}
                            width={120}
                            height={40}
                            className="h-10 w-auto flex-shrink-0"
                            style={{ objectFit: "contain" }}
                          />
                        ) : null}
                        <div className="flex flex-col gap-1">
                          <span
                            className="text-[13px]"
                            style={{ color: colors.text.primary }}
                          >
                            {[festival.name, festival.year]
                              .filter(Boolean)
                              .join(" — ")}
                          </span>
                          <span
                            className="text-[10px] uppercase"
                            style={{
                              color: colors.text.tertiary,
                              letterSpacing: typography.tracking.widest,
                            }}
                          >
                            {festival.award || "Official Selection"}
                          </span>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </section>
            ) : null}

            {/* ── Poster ──
                Portrait artwork shown whole at its natural aspect ratio:
                never stretched, never cropped, never used as a hero. */}
            {hasImageAsset(project.poster) ? (
              <section className="px-6 md:px-8 py-10">
                <SidebarLabel>Poster</SidebarLabel>
                <div className="mt-6">
                  <SanityPoster
                    source={project.poster}
                    sizes="(max-width: 768px) 80vw, 420px"
                    alt={`${project.title} — poster`}
                  />
                </div>
              </section>
            ) : null}
          </div>

          {/* ── Info sidebar ── */}
          <div
            className="order-2 md:order-2 md:w-[400px] md:flex-shrink-0"
            style={{ borderLeft: `1px solid ${colors.border}` }}
          >
            <div className="px-6 md:px-8 pb-8 pt-6 md:pt-4 flex flex-col gap-10">
              {/* Meta */}
              <div>
                <SidebarLabel>Details</SidebarLabel>
                <MetaRow label="Format" value={project.format} />
                <MetaRow label="Duration" value={displayDuration} />
                <MetaRow label="Status" value={displayStatus} />
              </div>

              {/* Logline */}
              {project.logline && (
                <p
                  className="font-light text-[16px]"
                  style={{
                    color: colors.text.primary,
                    lineHeight: typography.leading.relaxed,
                    borderLeft: `1px solid ${colors.border}`,
                    paddingLeft: "16px",
                  }}
                >
                  {project.logline}
                </p>
              )}

              {/* Cast */}
              {project.cast && project.cast.length > 0 && (
                <div>
                  <SidebarLabel>Cast</SidebarLabel>
                  {project.cast.map((c, i) => (
                    <CreditRow key={`cast-${c.role}-${i}`} role={c.role} name={c.name} />
                  ))}
                </div>
              )}

              {/* Credits */}
              {processedCredits && processedCredits.length > 0 && (
                <div>
                  <SidebarLabel>Credits</SidebarLabel>
                  {processedCredits.map((c, i) => (
                    <CreditRow key={`credit-${c.role}-${i}`} role={c.role} name={c.name} />
                  ))}
                </div>
              )}

              {/* Production */}
              {project.production && (project.production.company || project.production.country || project.production.language) && (
                <div>
                  <SidebarLabel>Production</SidebarLabel>
                  {project.production.company && <CreditRow role="Company" name={project.production.company} />}
                  {project.production.country && <CreditRow role="Country" name={project.production.country} />}
                  {project.production.language && <CreditRow role="Language" name={project.production.language} />}
                </div>
              )}


              {/* Festival selections are rendered in the main column above,
                  alongside the stills, trailer and poster. */}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}