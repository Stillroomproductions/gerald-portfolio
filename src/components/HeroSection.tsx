import Image from "next/image";
import Link from "next/link";
import { colors, typography } from "@/assets/util";
import person1 from "@/assets/images/hero.jpg";

const meta = [
  { label: "Based", value: "London, UK" },
  { label: "Active", value: "2014 — Present" },
  { label: "Production", value: "Still Room Productions" },
];

export default function HeroSection() {
  return (
    <section
      className="min-h-screen grid grid-cols-1 md:grid-cols-2"
      style={{ fontFamily: typography.fonts.primary }}
    >
      {/* Left */}
      <div
        className="flex flex-col justify-center px-6 md:px-12 pt-28 md:pt-0 pb-12 md:pb-16 order-2 md:order-1"
        style={{ borderRight: undefined }}
      >
        {/* Eyebrow */}
        <p
          className="text-[10px] uppercase mb-5 md:mb-7"
          style={{
            color: colors.text.tertiary,
            letterSpacing: typography.tracking.widest,
          }}
        >
          Index — Gerald Gyimah
        </p>

        {/* Name */}
        <h1
          className="text-[clamp(32px,8vw,56px)] font-light leading-[1.05] tracking-[-0.02em] mb-4"
          style={{ color: colors.text.primary }}
        >
          Gerald
          <br />
          Gyimah
        </h1>

        {/* Role */}
        <p
          className="text-[12px] uppercase mb-10 md:mb-14"
          style={{
            color: colors.text.secondary,
            letterSpacing: typography.tracking.wide,
          }}
        >
          Writer &nbsp;/&nbsp; Director
        </p>

        {/* Meta */}
        <div className="flex flex-col gap-2">
          {meta.map(({ label, value }) => (
            <div
              key={label}
              className="flex gap-5 text-[11px]"
              style={{ letterSpacing: typography.tracking.wide }}
            >
              <span
                className="uppercase min-w-[80px]"
                style={{ color: colors.text.tertiary }}
              >
                {label}
              </span>
              <span style={{ color: colors.text.secondary }}>{value}</span>
            </div>
          ))}

          {/* Divider + CTA */}
          <div
            className="flex gap-5 text-[11px] mt-6 pt-6"
            style={{
              borderTop: `1px solid ${colors.border}`,
              letterSpacing: typography.tracking.wide,
            }}
          >
            <span
              className="uppercase min-w-[80px]"
              style={{ color: colors.text.tertiary }}
            >
              Latest
            </span>
            <Link
              href="/work"
              className="underline underline-offset-4 transition-opacity duration-200 hover:opacity-60"
              style={{ color: colors.text.secondary }}
            >
              See work →
            </Link>
          </div>
        </div>
      </div>

      {/* Right — Image */}
      <div
        className="flex flex-col justify-end px-6 md:px-12 pb-6 md:pb-16 pt-20 md:pt-32 order-1 md:order-2"
        style={{ borderLeft: undefined }}
      >
        <div
          className="relative w-full mb-3 overflow-hidden"
          style={{
            aspectRatio: "4/5",
            backgroundColor: colors.background.alt,
            border: `1px solid ${colors.border}`,
          }}
        >
          <Image
            src={person1}
            alt="An empty institutional corridor"
            fill
            className="object-cover"
            priority
          />

          {/* Image label */}
          <span
            className="absolute bottom-3 left-3 text-[10px] uppercase"
            style={{
              color: colors.text.tertiary,
              letterSpacing: typography.tracking.widest,
            }}
          >
            Gerald Gyimah
          </span>
        </div>

        <p
          className="text-[11px]"
          style={{
            color: colors.text.tertiary,
            letterSpacing: typography.tracking.wide,
          }}
        >
          Waiting Room, undated.
        </p>
      </div>
    </section>
  );
}