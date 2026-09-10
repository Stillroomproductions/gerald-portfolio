import { colors } from "@/assets/util";
import type { SanityImageObject } from "@/lib/imageUrl";

export type ProjectStatus = "Complete" | "In Development" | "Post-Production";

export interface Credit {
  role: string;
  name: string;
}

// Stills are Sanity image objects, not StaticImageData. The full object is
// carried through (asset/hotspot/crop) so `sanityImage()` can apply the crop
// and focal point the editor set in the Studio.
export interface SanityImageRef extends SanityImageObject {
  _key: string;
}

/** One festival / official selection row. Only `name` is required. */
export interface FestivalSelection {
  _key?: string;
  name: string;
  year?: string;
  award?: string;
  laurel?: SanityImageObject;
}

export interface Project {
  slug: string;
  title: string;
  year: number;
  format: string;
  duration: string;
  status: ProjectStatus;
  logline: string;
  stills: SanityImageRef[];
  cast?: Credit[];
  credits: Credit[];
  production: { company: string; country: string; language: string };
  synopsis?: string;
  releaseDate?: string;
  order?: number;
  /** Optional Vimeo/YouTube link. No video section renders without it. */
  trailerUrl?: string;
  /** Heading shown above the video. Defaults to "Trailer". */
  trailerLabel?: string;
  /** Festival run. Section is hidden when empty. */
  festivalSelections?: FestivalSelection[];
  /** Portrait marketing poster, shown whole at its natural aspect ratio. */
  poster?: SanityImageObject;
}

export const statusColor: Record<ProjectStatus, string> = {
  Complete: colors.accent.mid,
  "In Development": colors.text.tertiary,
  "Post-Production": colors.text.secondary,
};

/** Image slots managed from the Site Settings singleton in the Studio. */
export interface SiteSettings {
  portrait?: SanityImageObject;
  onSetImage?: SanityImageObject & { caption?: string };
  directingImage?: SanityImageObject;
  atmosphericImages?: (SanityImageObject & { caption?: string })[];
}
