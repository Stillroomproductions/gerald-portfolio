import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { colors, typography } from "@/assets/util";
// import { projects } from "@/assets/data";

// ── Images ─────────────────────────────────────────────
// Swap these with your final assets — paths/names are placeholders.
import heroStill from "@/assets/images/background4.png";
import headshot from "@/assets/images/headshot.jpg";
import directingBTS from "@/assets/images/back3.jpeg";
import atmosphericStop from "@/assets/images/back1.jpeg";
import atmosphericIncidents from "@/assets/images/back2.jpeg";
import { getAllProjects } from "@/lib/queries";
export const dynamic = 'force-dynamic'
// ── Section divider ─────────────────────────────────────
function Divider() {
  return (
    <div
      style={{ borderTop: `1px solid ${colors.border}` }}
      aria-hidden="true"
    />
  );
}

// ── Section eyebrow label ───────────────────────────────
function SectionLabel({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <p
      className="text-[9px] uppercase"
      style={{
        color: colors.text.tertiary,
        letterSpacing: typography.tracking.widest,
        fontFamily: typography.fonts.primary,
        ...style
      }}
    >
      {children}
    </p>
  );
}

// ── Full-width atmospheric band ─────────────────────────
function AtmosphericBand({
  src,
  alt,
  caption,
}: {
  src: typeof atmosphericStop;
  alt: string;
  caption: string;
}) {
  return (
    <section>
      <div
        className="relative w-full overflow-hidden"
        style={{ aspectRatio: "21/9" }}
      >
        <Image src={src} alt={alt} fill className="object-cover" style={{ objectFit: "cover" }} />
        <span
          className="absolute bottom-4 left-6 text-[9px] uppercase"
          style={{
            color: "rgba(255,255,255,0.4)",
            letterSpacing: typography.tracking.widest,
          }}
        >
          {caption}
        </span>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════
// PAGE
// ═══════════════════════════════════════════════════════
export default async function Home() {
  const projects = await getAllProjects();

  return (
    <>
      <Navbar />

      <main
        style={{
          fontFamily: typography.fonts.primary,
          backgroundColor: colors.background.main,
        }}
      >
        {/* ══ 1. HERO ══════════════════════════════════════════
            Restrained, typographic. No dominant portrait —
            a small still sits low-opacity in the background. */}
        <section
          id="home"
          className="relative flex flex-col justify-center items-center px-6 md:px-12 py-28 md:py-40 min-h-[70vh] overflow-hidden text-center"
        >
          <div className="relative z-10 w-full flex flex-col items-center">
            <h1
              className="font-light leading-[1.03] tracking-[-0.025em] mt-6 mb-5 whitespace-nowrap"
              style={{
                fontSize: "clamp(48px, 10vw, 88px)",
                color: colors.text.primary,
              }}
            >
              Gerald Gyimah
            </h1>

            <p
              className="text-[12px] uppercase mb-8"
              style={{
                color: colors.text.secondary,
                letterSpacing: typography.tracking.widest,
              }}
            >
              Writer &nbsp;/&nbsp; Director
            </p>

            <p
              className="font-light max-w-xs"
              style={{
                fontSize: "13px",
                color: colors.text.tertiary,
                lineHeight: typography.leading.relaxed,
              }}
            >
              Work concerned with stillness, institutional space, and the weight
              of what remains unspoken.
            </p>
          </div>
        </section>

        <Divider />

        {/* ══ 2. FILMS ═════════════════════════════════════════ */}
        <section id="work" className="py-14 md:py-20">
          <div className="flex items-center justify-between mb-10 md:mb-12 px-6 md:px-12">
            <SectionLabel>Films</SectionLabel>
            <Link
              href="/work"
              className="text-[9px] uppercase transition-opacity duration-200 hover:opacity-50"
              style={{
                color: colors.text.tertiary,
                letterSpacing: typography.tracking.widest,
                textDecoration: "none",
              }}
            >
              View Projects List →
            </Link>
          </div>

          <div
            className="grid grid-cols-1 md:grid-cols-2 gap-px"
            style={{ backgroundColor: colors.border }}
          >
            {projects.map((project) => (
              <Link
                key={project.slug}
                href={`/work/${project.slug}`}
                className="group block"
                style={{
                  textDecoration: "none",
                  backgroundColor: colors.background.main,
                }}
              >
                <div
                  className="relative w-full overflow-hidden"
                  style={{ aspectRatio: "16/9" }}
                >
                  {/* <Image
            src={project.stills[0]}
            alt={`${project.title} — film still`}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-[1.02]"
          /> */}

                  {project.stills?.[0]?.url ? (
                    <Image
                      src={project.stills[0].url}
                      alt={project.title}
                      fill
                      className="object-cover"
                      style={{ objectFit: "cover" }}
                    />
                  ) : (
                    <div style={{
                      width: '100%',
                      height: '100%',
                      backgroundColor: '#1a1a1a',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#666',
                      fontSize: '0.75rem',
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase',
                    }}>
                      No project image
                    </div>
                  )}
                </div>

                <div
                  className="flex items-center justify-between px-4 py-3"
                  style={{ borderTop: `1px solid ${colors.border}` }}
                >
                  <span
                    className="text-[14px] font-light"
                    style={{ color: colors.text.primary }}
                  >
                    {project.title}
                  </span>
                  <div className="flex items-center gap-4">
                    {/* <span
                      className="text-[10px] tabular-nums"
                      style={{ color: colors.text.tertiary }}
                    >
                      {project.year}
                    </span> */}
                    <span
                      className="text-[11px] opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                      style={{ color: colors.text.tertiary }}
                    >
                      →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <Divider />

        {/* ══ 4. DIRECTING ═════════════════════════════════════
            Black-and-white BTS — director with crew around the monitor. */}
        <section id="directing" className="px-0 md:px-12 py-14 md:py-20">
          <SectionLabel style={{ paddingLeft: 12 }}>Directing</SectionLabel>

          <div
            className="relative w-full overflow-hidden mt-8"
            style={{ aspectRatio: "16/9" }}
          >
            <Image
              src={directingBTS}
              alt="Gerald Gyimah on set with crew, reviewing the monitor"
              fill
              className="object-cover grayscale"
              style={{ objectFit: "cover" }}
            />
          </div>
        </section>

        <Divider />

        {/* ══ 3. ABOUT ═════════════════════════════════════════
            Single professional headshot beside the bio. */}
        <section id="about" className="grid grid-cols-1 md:grid-cols-2">
          <div
            className="flex flex-col justify-center px-6 md:px-12 py-14 md:py-20 md:border-r"
            style={{ borderColor: colors.border }}
          >
            <SectionLabel>About</SectionLabel>

            <div className="flex flex-col gap-5 mt-8 max-w-sm">
              <p
                className="font-light"
                style={{
                  fontSize: "14px",
                  color: colors.text.primary,
                  lineHeight: typography.leading.loose,
                }}
              >
                Gerald Gyimah is a writer and director based in London. His work examines institutional spaces, procedural language, and the quiet pressures through which systems produce outcomes.
              </p>
              <p
                className="font-light"
                style={{
                  fontSize: "14px",
                  color: colors.text.primary,
                  lineHeight: typography.leading.loose,
                }}
              >
                His films examine how ordinary conversations, administrative processes and institutional spaces quietly determine people’s lives.
              </p>
              <p
                className="font-light"
                style={{
                  fontSize: "14px",
                  color: colors.text.primary,
                  lineHeight: typography.leading.loose,
                }}
              >
                He is the founder of Still Room Productions, through which he develops and produces independent work.
              </p>

              <Link
                href="/about"
                className="text-[11px] uppercase mt-2 transition-opacity duration-200 hover:opacity-60"
                style={{
                  color: colors.text.tertiary,
                  letterSpacing: typography.tracking.wider,
                  textDecoration: "none",
                }}
              >
                Full bio →
              </Link>
            </div>
          </div>

          <div className="relative bg-gray-300" style={{ minHeight: "300px" }}>
            <Image
              src={headshot}
              alt="Gerald Gyimah — headshot"
              fill
              className="object-cover object-top hidden"
              style={{ objectFit: "cover" }}
            />
          </div>
        </section>

        <Divider />

        {/* ══ 5. ATMOSPHERE — STOP ═════════════════════════════ */}
        <AtmosphericBand
          src={atmosphericIncidents}
          alt="STOP door"
          caption=""
        />

        <Divider />

        {/* ══ 6. ATMOSPHERE — INCIDENTS MUST BE RECORDED ══════ */}
        <AtmosphericBand
          src={atmosphericStop}
          alt="Incidents must be recorded sign"
          caption=""
        />

        <Divider />

        {/* ══ 7. CONTACT ═══════════════════════════════════════ */}
        <section id="contact" className="px-6 md:px-12 py-6 mt-6">
          <div className="flex items-start justify-between">
            <SectionLabel>Contact</SectionLabel>
            <div className="flex items-center gap-6">
              <Link
                href="/contact"
                className="text-[9px] uppercase transition-opacity duration-200 hover:opacity-50"
                style={{
                  color: colors.text.tertiary,
                  letterSpacing: typography.tracking.widest,
                  textDecoration: "none",
                }}
              >
                All enquiries →
              </Link>
              <span
                className="text-[9px] uppercase"
                style={{
                  color: colors.text.tertiary,
                  letterSpacing: typography.tracking.widest,
                }}
              >
                London, UK
              </span>
            </div>
          </div>

          <div className="flex flex-col max-w-sm">
            {[
              /* {
                label: "Representation",
                href: "",
                value: "Independent",
              }, */
              {
                label: "Email",
                href: "mailto:gerald@geraldgyimah.com",
                value: "gerald@geraldgyimah.com",
              },
              {
                label: (
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                ),
                href: "https://www.instagram.com/gerald.gyimah/",
                value: "Instagram",
              },
              {
                label: (
                  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="16" viewBox="0 0 48 24" fill="currentColor"><path d="M44.4,4.2H3.6C1.6,4.2,0,5.8,0,7.8v8.4c0,2,1.6,3.6,3.6,3.6h40.8c2,0,3.6-1.6,3.6-3.6V7.8 C48,5.8,46.4,4.2,44.4,4.2z M13.8,16.8H11l-0.8-3.9h-0.1l-0.9,3.9H6.4V7.2h2.7v5.5h0.1l1.1-5.5h2.8l1,5.5h0.1v-5.5h2.6V16.8z M23.3,16.8h-2.5v-7.3h-0.1l-1.4,7.3h-2.1l-1.3-7.3h-0.1v7.3h-2.4V7.2h3.9l1.1,6.1h0.1l1.2-6.1h3.7V16.8z M33.5,16.8h-3v-9.6h1.9 v1.5h0.1c0.4-1.2,1.6-1.7,2.8-1.7c2.6,0,3.7,1.9,3.7,4.8v0.2C39,15.6,37,16.8,33.5,16.8z M45.4,16.8h-2.3v-1.1h-0.1 c-0.5,0.9-1.5,1.3-2.6,1.3c-2,0-3.1-1.3-3.1-4v-0.5c0-3.3,1.6-5.5,4.3-5.5c1.4,0,2.1,0.6,2.4,1.4h0.1V4.5h2.4V16.8z" /><path d="M33.4,9.1c-0.8,0-1.2,0.4-1.2,1.5v3.9c0,0.9,0.4,1.3,1.2,1.3c0.9,0,1.4-0.6,1.4-2.1v-2.3C34.8,9.7,34.4,9.1,33.4,9.1z" /><path d="M42.8,10.6c0-0.9-0.4-1.4-1.1-1.4c-0.8,0-1.2,0.6-1.2,1.8v3.2c0,1,0.4,1.5,1.1,1.5c0.7,0,1.1-0.5,1.1-1.5V10.6z" /></svg>
                ),
                href: "https://pro.imdb.com/name/nm10308534/public/?ref_=ext_shr_wts",
                value: "IMDb",
              },
            ].map(({ label, href, value }, idx) => {
              const Content = (
                <>
                  <span
                    className="text-[10px] uppercase flex items-center"
                    style={{
                      color: colors.text.tertiary,
                      letterSpacing: typography.tracking.widest,
                    }}
                  >
                    {label}
                  </span>
                  <span
                    className="text-[11px] flex items-center gap-2"
                    style={{ color: colors.text.secondary }}
                  >
                    {value}
                    {href && (
                      <span
                        className="opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                        style={{ color: colors.text.tertiary }}
                      >
                        →
                      </span>
                    )}
                  </span>
                </>
              );

              return href ? (
                <Link
                  key={idx}
                  href={href}
                  target={href.startsWith("http") ? "_blank" : undefined}
                  rel={
                    href.startsWith("http") ? "noopener noreferrer" : undefined
                  }
                  className="group flex justify-between items-center py-4 transition-opacity duration-200 hover:opacity-60"
                  style={{
                    borderBottom: `1px solid ${colors.border}`,
                    textDecoration: "none",
                  }}
                >
                  {Content}
                </Link>
              ) : (
                <div
                  key={idx}
                  className="group flex justify-between items-center py-4"
                  style={{
                    borderBottom: `1px solid ${colors.border}`,
                  }}
                >
                  {Content}
                </div>
              );
            })}
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}