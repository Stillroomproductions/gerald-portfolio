import type { MetadataRoute } from "next";
import { client } from "@/lib/sanity";

// ── Revalidation ──────────────────────────────────────────────────────────────
// Sitemap is regenerated at most once per hour, so newly published Sanity films
// appear automatically without a full redeploy.
export const revalidate = 3600;

interface SitemapProject {
  slug: string;
  _updatedAt?: string;
}

async function getProjectSlugs(): Promise<SitemapProject[]> {
  try {
    return await client.fetch<SitemapProject[]>(
      `*[_type == "project"] | order(order asc) { "slug": slug.current, _updatedAt }`,
      {},
      { next: { revalidate: 3600 } }
    );
  } catch {
    // If Sanity is unreachable at build/revalidation time, return no film
    // routes rather than a hardcoded list. A stale list goes wrong in both
    // directions — it drops new films and advertises removed ones as 404s —
    // and the static routes below still keep the sitemap from being empty.
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://geraldgyimah.com";

  const now = new Date();

  // ── Static routes ─────────────────────────────────────────────────────────
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: siteUrl,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 1.0,
    },
    {
      url: `${siteUrl}/work`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${siteUrl}/about`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${siteUrl}/contact`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.6,
    },
  ];

  // ── Dynamic film routes ────────────────────────────────────────────────────
  const projects = await getProjectSlugs();
  const filmRoutes: MetadataRoute.Sitemap = projects.map((project) => ({
    url: `${siteUrl}/work/${project.slug}`,
    lastModified: project._updatedAt ? new Date(project._updatedAt) : now,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  return [...staticRoutes, ...filmRoutes];
}
