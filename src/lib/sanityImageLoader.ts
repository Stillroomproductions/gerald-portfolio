'use client'

/**
 * Global next/image loader, wired up via `images.loader` in next.config.ts.
 *
 * Sanity's CDN already resizes and format-negotiates the images we request, so
 * routing them through Next's own optimizer means encoding each one twice. On
 * a cold cache that second pass is slow enough to time out, leaving the slot
 * blank — which is what the wide homepage bands were doing.
 *
 * This hands resizing to Sanity instead. The `src` we build already carries the
 * crop rectangle, so only the width the browser asked for is swapped in.
 *
 * It must live in its own file and be referenced by path: Next inlines it into
 * the client bundle at build time, which is why the loader cannot simply be
 * passed as a prop from a server component.
 */
export default function sanityImageLoader({
  src,
  width,
  quality,
}: {
  src: string
  width: number
  quality?: number
}): string {
  // Non-Sanity sources (none today, but the OG route and any future local
  // asset) are returned untouched rather than being given bogus params.
  if (!src.includes('cdn.sanity.io')) return src

  try {
    const url = new URL(src)
    url.searchParams.set('w', String(width))
    url.searchParams.set('auto', 'format')
    if (quality) url.searchParams.set('q', String(quality))
    return url.toString()
  } catch {
    return src
  }
}
