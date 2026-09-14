/**
 * Turn a Vimeo or YouTube link into an embed URL.
 *
 * The editor pastes whatever the share button gave them — a watch link, a
 * youtu.be short link, a Vimeo player link, sometimes with a query string.
 * This normalises those into the player URL for an <iframe>.
 *
 * Returns null for anything not recognised, so a malformed or unsupported
 * link renders no video section rather than an empty player. That also means
 * the value interpolated into `src` is always one we constructed from a
 * validated id, never raw editor input.
 */
export function videoEmbedUrl(rawUrl?: string | null): string | null {
  if (!rawUrl) return null

  let url: URL
  try {
    url = new URL(rawUrl.trim())
  } catch {
    return null
  }

  if (url.protocol !== 'http:' && url.protocol !== 'https:') return null

  const host = url.hostname.replace(/^www\./i, '').toLowerCase()

  // ── YouTube ───────────────────────────────────────────────────────────────
  // youtube.com/watch?v=ID, youtu.be/ID, youtube.com/embed/ID, /shorts/ID
  if (host === 'youtube.com' || host === 'm.youtube.com' || host === 'youtube-nocookie.com') {
    const id =
      url.searchParams.get('v') ||
      url.pathname.match(/^\/(?:embed|shorts|v)\/([A-Za-z0-9_-]{6,})/)?.[1]
    if (!id || !/^[A-Za-z0-9_-]{6,}$/.test(id)) return null
    // youtube-nocookie avoids setting tracking cookies before playback.
    return `https://www.youtube-nocookie.com/embed/${id}?rel=0`
  }

  if (host === 'youtu.be') {
    const id = url.pathname.slice(1)
    if (!/^[A-Za-z0-9_-]{6,}$/.test(id)) return null
    return `https://www.youtube-nocookie.com/embed/${id}?rel=0`
  }

  // ── Vimeo ─────────────────────────────────────────────────────────────────
  // vimeo.com/ID, vimeo.com/ID/HASH (unlisted), player.vimeo.com/video/ID
  if (host === 'vimeo.com' || host === 'player.vimeo.com') {
    const parts = url.pathname.split('/').filter(Boolean)
    const videoIndex = parts[0] === 'video' ? 1 : 0
    const id = parts[videoIndex]
    if (!id || !/^\d+$/.test(id)) return null

    // An unlisted Vimeo video needs its private hash to embed.
    const hash = parts[videoIndex + 1]
    const query = hash && /^[A-Za-z0-9]+$/.test(hash) ? `?h=${hash}` : ''
    return `https://player.vimeo.com/video/${id}${query}`
  }

  return null
}
