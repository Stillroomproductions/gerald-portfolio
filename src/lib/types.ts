import { colors } from "@/assets/util";
export type ProjectStatus = "Complete" | "In Development" | "Post-Production";

export interface Credit {
  role: string;
  name: string;
}

// Stills are now Sanity image references, not StaticImageData
export interface SanityImageRef {
  _key: string;
  url: string;
  alt?: string;
  hotspot?: { x: number; y: number; height: number; width: number };
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
}

export const statusColor: Record<ProjectStatus, string> = {
  Complete: colors.accent.mid,
  "In Development": colors.text.tertiary,
  "Post-Production": colors.text.secondary,
};