import type { MouseEvent } from 'react';
import { scrollToHash } from './scrollToHash';
import { useLanguage } from '../i18n/LanguageContext';

interface CtaButtonProps {
  className?: string;
  onNavigate?: () => void;
}

/**
 * "Get in touch" — compact pill (text-sm, px-4 py-2). Scrolls to #contact
 * (no mailto:); plain anchor keeps it working without JS. Accent-outline
 * style reads as primary action against the dark canvas; press feedback
 * via active:translate-y; hover glow uses the accent.
 * Hover text is theme-aware: near-black on the vivid dark-mode orange,
 * white on the deepened light-mode orange (both ≥ 4.5:1).
 */
export function CtaButton({ className = '', onNavigate }: CtaButtonProps) {
  const { t } = useLanguage();

  const handleClick = (e: MouseEvent<HTMLAnchorElement>): void => {
    e.preventDefault();
    onNavigate?.();
    // Scroll on the next frame: hiding the mobile menu overlay mid-animation
    // cancels an in-progress smooth scroll, so the menu closes first.
    requestAnimationFrame(() => scrollToHash('#contact'));
  };

  return (
    <a
      href="#contact"
      onClick={handleClick}
      className={`group inline-flex cursor-pointer items-center gap-2 rounded-full border border-accent/60 bg-accent/10 px-4 py-2 text-sm font-bold text-fg no-underline transition duration-200 hover:border-accent hover:bg-accent hover:text-base hover:shadow-[0_0_20px_rgba(255,77,28,0.35)] light:hover:text-white light:hover:shadow-[0_0_20px_rgba(196,58,12,0.3)] active:translate-y-0 active:scale-[0.98] ${className}`}
    >
      {t.cta}
      {/* Arrow badge, proportionally smaller than the original design.
          Mirrored under dir=rtl so "forward" points the right way. */}
      <span
        aria-hidden="true"
        className="grid h-5 w-5 place-items-center rounded-full bg-accent text-xs text-white transition-colors duration-200 group-hover:bg-white group-hover:text-accent rtl:-scale-x-100"
      >
        →
      </span>
    </a>
  );
}
