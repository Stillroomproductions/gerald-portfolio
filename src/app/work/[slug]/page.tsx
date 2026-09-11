import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import Image from "next/image";
import { colors, typography } from "@/assets/util";
// import { projects, statusColor, Project } from "@/assets/data";
import { getAllProjects, getProjectBySlug } from "@/lib/queries";

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

  // OG image: use the first Sanity still cropped to 1200×630, or the static
  // site-level OG image as fallback.
  const ogImage =
    project.stills && project.stills.length > 0 && project.stills[0].url
      ? `${project.stills[0].url}?w=1200&h=630&fit=crop&q=85`
      : `${siteUrl}/opengraph-image`;

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

function MetaRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
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

function StillPlaceholder({ index }: { index: number }) {
  return (
    <div
      className="flex items-center justify-center"
      style={{
        aspectRatio: "16/10",
        backgroundColor: colors.background.alt,
        border: `1px solid ${colors.border}`,
      }}
    >
      <span
        className="text-[10px] uppercase"
        style={{
          color: colors.text.tertiary,
          letterSpacing: typography.tracking.widest,
        }}
      >
        Still {String(index).padStart(2, "0")}
      </span>
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
  const projects = await getAllProjects();
  const project = projects.find((p) => p.slug === slug);

  if (!project) {
    return (
      <>
        <Navbar />
        <main
          className="min-h-screen pt-[72px] flex items-center justify-center"
          style={{
            backgroundColor: colors.background.main,
            fontFamily: typography.fonts.primary,
          }}
        >
          <div className="text-center px-6">
            <p
              className="text-[10px] uppercase mb-4"
              style={{
                color: colors.text.tertiary,
                letterSpacing: typography.tracking.widest,
              }}
            >
              Project not found
            </p>
            <Link
              href="/work"
              className="text-[11px] uppercase underline underline-offset-4"
              style={{
                color: colors.text.secondary,
                letterSpacing: typography.tracking.wider,
              }}
            >
              ← Return to index
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const validStills = project.stills?.filter((s: any) => s.url) || null;
  const stills = validStills && validStills.length > 0 ? validStills : null;

  const formatDuration = (d?: any) => {
    if (!d) return d;
    const str = String(d).trim();
    if (/^\d+$/.test(str)) return `${str} mins`;
    if (/^\d+\s*min(s)?$/i.test(str)) return `${str.replace(/min(s)?$/i, '').trim()} mins`;
    return str;
  };

  const processCredits = (credits?: any[]) => {
    if (!credits) return [];
    const directors = credits.filter((c: any) => c.role?.toLowerCase() === 'director');
    const writers = credits.filter((c: any) => c.role?.toLowerCase() === 'writer');
    const shouldCombine = directors.length === 1 && writers.length === 1 && directors[0].name === writers[0].name;
    const processed: { role: string; name: string }[] = [];
    
    if (shouldCombine) {
      processed.push({ role: 'Written & Directed by', name: directors[0].name });
    }
    
    credits.forEach((c: any) => {
      if (!c.role) return;
      const roleLower = c.role.toLowerCase();
      if (shouldCombine && (roleLower === 'director' || roleLower === 'writer')) return;
      
      let roleName = c.role;
      if (roleLower === 'cast') roleName = 'Starring';
      
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
            {/* Stills grid — same size images as before, just visible immediately */}
            {stills ? (
              <div
                className="grid grid-cols-1 sm:grid-cols-2"
                style={{ gap: "1px", backgroundColor: colors.border }}
              >
                {stills.map((src: any, i: number) => {
                  return (
                    <div
                      key={i}
                      className="relative overflow-hidden"
                      style={{
                        aspectRatio: "16/10",
                        backgroundColor: colors.background.alt,
                      }}
                    >
                      <Image
                        src={src.url}
                        alt={`${project.title} — still ${i + 1}`}
                        fill
                        priority={i === 0}
                        className="object-cover"
                        style={{ objectFit: "cover" }}
                      />
                    </div>
                  );
                })}
              </div>
            ) : (
              <div
                className="grid grid-cols-1 sm:grid-cols-2"
                style={{ gap: "1px", backgroundColor: colors.border }}
              >
                {[1, 2].map((n) => (
                  <StillPlaceholder key={n} index={n} />
                ))}
              </div>
            )}

            {/* Trailer */}
            {/* @ts-ignore */}
            {project.trailerUrl && (
              <div
                className="relative w-full"
                style={{ aspectRatio: "16/9", backgroundColor: colors.background.alt }}
              >
                <iframe
                  /* @ts-ignore */
                  src={project.trailerUrl}
                  className="absolute top-0 left-0 w-full h-full border-0"
                  allow="autoplay; fullscreen; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            )}
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

              {/* Short paragraph */}
              {/* @ts-ignore */}
              {project.shortParagraph && (
                <p
                  className="font-light text-[14px]"
                  style={{
                    color: colors.text.secondary,
                    lineHeight: typography.leading.loose,
                  }}
                >
                  {/* @ts-ignore */}
                  {project.shortParagraph}
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


              {/* Awards */}
              {/* @ts-ignore */}
              {Array.isArray(project.awards) && project.awards.length > 0 && (
                <div>
                  <SidebarLabel>Awards & Laurels</SidebarLabel>
                  {/* @ts-ignore */}
                  {project.awards.map((award: any, i: number) => (
                    <div
                      key={i}
                      className="py-2 text-[11px]"
                      style={{
                        color: colors.text.secondary,
                        borderBottom: `1px solid ${colors.border}`,
                      }}
                    >
                      {award.title}
                    </div>
                  ))}
                </div>
              )}

              {/* Press Kit PDF */}
              {/* @ts-ignore */}
              {project.pressKitUrl && (
                <a
                  /* @ts-ignore */
                  href={project.pressKitUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block text-[10px] uppercase transition-opacity duration-200 hover:opacity-60 self-start"
                  style={{
                    color: colors.text.primary,
                    letterSpacing: typography.tracking.widest,
                    borderBottom: `1px solid ${colors.border}`,
                    paddingBottom: "4px",
                  }}
                >
                  Download Press Kit ↓
                </a>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}