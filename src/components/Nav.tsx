import type { MouseEvent } from 'react';
import { NAV_LINKS } from '../data/nav';
import { CtaButton } from './CtaButton';
import { ThemeToggle } from './ThemeToggle';
import { LanguageToggle } from './LanguageToggle';
import { scrollToHash } from './scrollToHash';
import { useLanguage } from '../i18n/LanguageContext';

interface NavProps {
  onOpenMenu: () => void;
  menuOpen: boolean;
}

export function Nav({ onOpenMenu, menuOpen }: NavProps) {
  const { t } = useLanguage();

  // Link labels come from the dictionary; hashes stay in data/nav so the
  // section contract lives in one place.
  const labels: Record<string, string> = {
    '#home': t.nav.home,
    '#about': t.nav.about,
    '#projects': t.nav.projects,
    '#skills': t.nav.skills,
  };

  const handleNavClick = (e: MouseEvent<HTMLAnchorElement>, hash: string): void => {
    scrollToHash(hash, e);
  };

  return (
    <nav className="fixed inset-x-0 top-0 z-10 flex items-center justify-between bg-gradient-to-b from-black/55 to-transparent px-5 py-4 light:from-white/80 md:px-[3.5vw] md:py-5">
      <a
        href="#home"
        onClick={(e) => handleNavClick(e, '#home')}
        className="cursor-pointer text-xl font-extrabold tracking-tight no-underline"
      >
        Pouria<span className="text-accent">.</span>dev
      </a>

      {/* Desktop links */}
      <ul className="hidden list-none items-center gap-8 md:flex">
        {NAV_LINKS.map((link) => (
          <li key={link.hash}>
            <a
              href={link.hash}
              onClick={(e) => handleNavClick(e, link.hash)}
              className="cursor-pointer text-[0.95rem] font-medium text-fg-muted no-underline transition-colors duration-200 hover:text-fg"
            >
              {labels[link.hash] ?? link.label}
            </a>
          </li>
        ))}
      </ul>

      <div className="flex items-center gap-2 sm:gap-3">
        {/* Desktop: theme + language controls sit left of the CTA */}
        <div className="hidden items-center gap-2 md:flex">
          <ThemeToggle />
          <LanguageToggle />
        </div>
        <div className="hidden md:block">
          <CtaButton />
        </div>

        {/* Hamburger — visible below md; 44px square for touch-target rule */}
        <button
          type="button"
          onClick={onOpenMenu}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          aria-label={t.menu.open}
          className="grid h-11 w-11 cursor-pointer place-items-center rounded-full border border-hairline bg-surface/70 text-fg backdrop-blur-md transition-colors duration-200 hover:border-accent md:hidden"
        >
          <span className="sr-only">{t.menu.open}</span>
          <svg width="18" height="14" viewBox="0 0 18 14" fill="none" aria-hidden="true">
            <path d="M1 1h16M1 7h16M1 13h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
      </div>
    </nav>
  );
}
