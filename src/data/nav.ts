import type { NavLink } from './types';

/** Section links navigate via hash anchors only — no router, no history rewrites. */
export const NAV_LINKS: NavLink[] = [
  { label: 'Home', hash: '#home' },
  { label: 'About', hash: '#about' },
  { label: 'Projects', hash: '#projects' },
  { label: 'Skills', hash: '#skills' },
];
