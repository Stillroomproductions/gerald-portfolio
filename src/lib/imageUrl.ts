import { createImageUrlBuilder, type SanityImageSource } from '@sanity/image-url'
import { dataset, projectId } from '@/sanity/env'

/**
 * Shared image helpers so every slot crops Sanity images the same way.
 *
 * Sanity's "hotspot" is the point the editor marks as the part of the picture
 * that must stay in frame; "crop" is an optional trim around it. Queries that
 * select `asset->url` throw both away — the raw asset URL is the untouched
 * upload, so a hotspot set in the Studio changes nothing on the site. Building
 * the URL from the image object instead lets Sanity apply the crop server-side,
 * and `hotspotPosition` handles the focal point for whatever aspect ratio the
 * slot forces.
 */

const builder = createImageUrlBuilder({ projectId, dataset })

export interface SanityHotspot {
  x: number
  y: number
  height: number
  width: number
}

export interface SanityCrop {
  top: number
  bottom: number
  left: number
  right: number
}

/** A Sanity image object as returned by the `...` spread in a GROQ projection. */
export interface SanityImageObject {
  _key?: string
  alt?: string
  asset?: { _ref?: string; _type?: string; url?: string }
  hotspot?: SanityHotspot
  crop?: SanityCrop
  /** Legacy field from queries that projected `asset->url` directly. */
  url?: string
}

/** True when the value is something we can build an image URL for. */
export function hasImageAsset(source?: SanityImageObject | null): boolean {
  if (!source) return false
  return Boolean(source.asset?._ref || source.asset?.url || source.url)
}

/**
 * CSS object-position matching the image's hotspot.
 * Falls back to dead centre when no hotspot has been set in Sanity.
 */
export function hotspotPosition(source?: SanityImageObject | null): string {
  const hotspot = source?.hotspot
  if (!hotspot || typeof hotspot.x !== 'number' || typeof hotspot.y !== 'number') {
    return '50% 50%'
  }
  const clamp = (n: number) => Math.min(100, Math.max(0, n * 100))
  return `${clamp(hotspot.x).toFixed(1)}% ${clamp(hotspot.y).toFixed(1)}%`
}

/**
 * Build an image URL at a given width, applying the editor's crop rectangle.
 * Falls back to any pre-resolved `url` when the asset reference is missing.
 */
export function imageUrl(source?: SanityImageObject | null, width = 1200): string | null {
  if (!hasImageAsset(source)) return null
  try {
    const url = builder
      .image(source as SanityImageSource)
      .width(width)
      // `auto('format')` lets Sanity's CDN content-negotiate WebP/AVIF, which
      // matters because several source stills are multi-megabyte PNGs. Sanity's
      // default quality already beats an explicit q=80 on these files, so no
      // quality override is set here.
      .auto('format')
      .url()
    if (url) return url
  } catch {
    // fall through to the pre-resolved URL below
  }
  return source?.url || source?.asset?.url || null
}

export interface ResolvedImage {
  src: string
  objectPosition: string
  alt: string
}

/**
 * Everything a component needs to render one Sanity image correctly.
 * Returns null when there is no usable image, so callers can render a
 * placeholder instead of a broken <img>.
 */
export function sanityImage(
  source?: SanityImageObject | null,
  width = 1200,
  fallbackAlt = ''
): ResolvedImage | null {
  const src = imageUrl(source, width)
  if (!src) return null
  return {
    src,
    objectPosition: hotspotPosition(source),
    alt: source?.alt || fallbackAlt,
  }
}

/**
 * A social share image at exactly 1200x630.
 *
 * `fit('crop')` with `.crop('focalpoint')` tells Sanity to crop around the
 * editor's hotspot instead of the centre, so a face marked in the Studio stays
 * in the share card. Returns null when there is no usable image.
 */
export function ogImageUrl(source?: SanityImageObject | null): string | null {
  if (!hasImageAsset(source)) return null
  try {
    const image = builder
      .image(source as SanityImageSource)
      .width(1200)
      .height(630)
      .fit('crop')
    const hotspot = source?.hotspot
    const positioned =
      hotspot && typeof hotspot.x === 'number' && typeof hotspot.y === 'number'
        ? image.crop('focalpoint').focalPoint(hotspot.x, hotspot.y)
        : image
    return positioned.auto('format').url() || null
  } catch {
    return null
  }
}

/**
 * The image's natural pixel dimensions, read from the asset reference.
 *
 * Sanity encodes them in the asset `_ref`, e.g.
 * `image-<hash>-1400x2000-jpg`, so no extra request is needed. Used by slots
 * that must respect the upload's real shape instead of forcing an aspect
 * ratio — the poster, which is shown whole and never cropped.
 */
export function imageDimensions(
  source?: SanityImageObject | null
): { width: number; height: number } | null {
  const ref = source?.asset?._ref
  const match = ref?.match(/-(\d+)x(\d+)-/)
  if (!match) return null
  const width = Number(match[1])
  const height = Number(match[2])
  if (!width || !height) return null
  return { width, height }
}
