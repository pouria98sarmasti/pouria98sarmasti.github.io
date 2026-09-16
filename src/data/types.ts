/** Shared types for the site's data layer. */

export interface Project {
  /** Stable slug-style id (also usable for future #/projects/:id routes). */
  id: string;
  /** Zero-padded display index, e.g. '01'. */
  index: string;
  title: string;
  description: string;
  /** 2–4 concrete technical takeaways (the only newly authored copy). */
  learnings: string[];
  category: string;
  /** External repo URL — placeholder until swapped for the real one. */
  repoUrl: string;
}

export interface SkillGroup {
  group: string;
  items: string[];
}

export interface Socials {
  email: string;
  linkedin: string;
  github: string;
  location: string;
}

export interface NavLink {
  label: string;
  /** In-page hash anchor, e.g. '#about'. */
  hash: string;
}
