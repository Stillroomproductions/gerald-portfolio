import Image from "next/image";
import { colors } from "@/assets/util";
import {
  sanityImage,
  imageDimensions,
  type SanityImageObject,
} from "@/lib/imageUrl";

/**
 * One Sanity image, cropped to a fixed slot with the editor's focal point.
 *
 * Every image slot on the site goes through here so hotspot behaviour is
 * identical everywhere: the URL is built from the image object (which applies
 * the crop rectangle set in the Studio) and `objectPosition` is driven by the
 * hotspot, so the marked point survives whatever shape the slot forces.
 *
 * Returns null when there is no image, so an empty slot collapses instead of
 * leaving a grey box on the page. Callers that need a whole section to
 * disappear should check the source before rendering the section wrapper.
 */
export function SanityPicture({
  source,
  aspectRatio,
  sizes,
  width = 1600,
  alt = "",
  className,
  priority,
  grayscale,
  caption,
}: {
  source?: SanityImageObject | null;
  /** CSS aspect-ratio for the slot, e.g. "16/9". Omit to fill the parent. */
  aspectRatio?: string;
  /** Responsive sizes hint. Always pass one — it controls what gets downloaded. */
  sizes: string;
  /** Widest rendered size, used to cap the URL the CDN builds. */
  width?: number;
  /** Used when the editor has not set alt text in the Studio. */
  alt?: string;
  className?: string;
  priority?: boolean;
  grayscale?: boolean;
  caption?: string;
}) {
  const image = sanityImage(source, width, alt);
  if (!image) return null;

  return (
    <div
      className={`relative w-full overflow-hidden ${className ?? ""}`}
      style={{
        aspectRatio,
        backgroundColor: colors.background.alt,
      }}
    >
      <Image
        src={image.src}
        alt={image.alt}
        fill
        sizes={sizes}
        priority={priority}
        className={`object-cover${grayscale ? " grayscale" : ""}`}
        style={{ objectFit: "cover", objectPosition: image.objectPosition }}
      />
      {caption ? (
        <span
          className="absolute bottom-4 left-6 text-[9px] uppercase"
          style={{ color: "rgba(255,255,255,0.65)", letterSpacing: "0.14em" }}
        >
          {caption}
        </span>
      ) : null}
    </div>
  );
}

/**
 * A Sanity image shown whole at its own aspect ratio — never cropped.
 *
 * Use this where the framing of the photograph itself matters and a fixed slot
 * would cut into it. Because the intrinsic size comes from the asset reference,
 * the browser reserves the right space and the image keeps exactly the shape it
 * was uploaded at. The hotspot is irrelevant here: nothing is being cropped, so
 * there is no focal point to preserve.
 */
export function SanityImageWhole({
  source,
  sizes,
  alt = "",
  className,
  priority,
  caption,
}: {
  source?: SanityImageObject | null;
  sizes: string;
  alt?: string;
  className?: string;
  priority?: boolean;
  caption?: string;
}) {
  const image = sanityImage(source, 1600, alt);
  const dimensions = imageDimensions(source);
  if (!image) return null;

  const { width, height } = dimensions ?? { width: 1600, height: 2000 };

  return (
    <div className={`relative w-full ${className ?? ""}`}>
      <Image
        src={image.src}
        alt={image.alt}
        width={width}
        height={height}
        sizes={sizes}
        priority={priority}
        className="h-auto w-full"
      />
      {caption ? (
        <span
          className="absolute bottom-4 left-6 text-[9px] uppercase"
          style={{ color: "rgba(255,255,255,0.65)", letterSpacing: "0.14em" }}
        >
          {caption}
        </span>
      ) : null}
    </div>
  );
}

/**
 * A poster shown whole at its natural shape.
 *
 * Deliberately not `fill`/`object-cover`: the brief is that a poster is never
 * stretched, never cropped and never used as a hero. The intrinsic size comes
 * from the asset reference, so the browser reserves the right space and the
 * image keeps whatever aspect ratio was uploaded.
 */
export function SanityPoster({
  source,
  sizes,
  alt = "",
  maxWidth = 420,
}: {
  source?: SanityImageObject | null;
  sizes: string;
  alt?: string;
  maxWidth?: number;
}) {
  const image = sanityImage(source, 1000, alt);
  const dimensions = imageDimensions(source);
  if (!image) return null;

  // Fall back to a 2:3 portrait only when the reference carries no dimensions;
  // a real asset always does, so this never distorts an actual upload.
  const { width, height } = dimensions ?? { width: 1400, height: 2100 };

  return (
    <Image
      src={image.src}
      alt={image.alt}
      width={width}
      height={height}
      sizes={sizes}
      className="h-auto w-full"
      style={{ maxWidth: `${maxWidth}px` }}
    />
  );
}
