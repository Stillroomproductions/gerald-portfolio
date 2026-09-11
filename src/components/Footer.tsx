import Link from "next/link";
import { colors, typography } from "@/assets/util";

export default function Footer() {
  return (
    <footer
      className="flex items-center justify-between px-12 py-5 mt-6"
      style={{
        borderTop: `1px solid ${colors.border}`,
        fontFamily: typography.fonts.primary,
      }}
    >
      <span
        className="text-[10px] uppercase"
        style={{
          color: colors.text.tertiary,
          letterSpacing: typography.tracking.wide,
        }}
      >
        © Gerald Gyimah {new Date().getFullYear()}
      </span>

      <Link
        href="/contact"
        className="text-[10px] uppercase transition-colors duration-200"
        style={{
          color: colors.text.tertiary,
          letterSpacing: typography.tracking.wide,
        }}
      >
        Still Room Productions
      </Link>
    </footer>
  );
}
