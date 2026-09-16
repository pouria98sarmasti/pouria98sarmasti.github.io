import { useEffect, useRef } from 'react';
import type { MouseEvent, TouchEvent } from 'react';
import { NAV_LINKS } from '../data/nav';
import { CtaButton } from './CtaButton';
import { ThemeToggle } from './ThemeToggle';
import { LanguageToggle } from './LanguageToggle';
import { scrollToHash } from './scrollToHash';
import type { NavLink } from '../data/types';
import { useLanguage } from '../i18n/LanguageContext';

interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
}

/**
 * Accessible animated mobile menu:
 * - Stays mounted while animating; `inert` when closed blocks focus/click/AT
 *   (the animatable equivalent of `hidden`).
 * - Panel: fade + slide, 300ms ease-out (skill motion guidance: 300-400ms,
 *   transform/opacity only). Links stagger in with per-index delays.
 * - `motion-reduce:` variants render the final state instantly.
 * - Closes on link tap, Escape, and backdrop click; traps focus while open
 *   and restores it to the hamburger on close.
 * - Touch: swipe-to-close (right→left in LTR English, left→right in RTL
 *   Persian); the ✕ close button stays as the explicit alternative.
 */
export function MobileMenu({ open, onClose }: MobileMenuProps) {
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const { t } = useLanguage();

  const labels: Record<string, string> = {
    '#home': t.nav.home,
    '#about': t.nav.about,
    '#projects': t.nav.projects,
    '#skills': t.nav.skills,
  };

  // Escape to close + simple focus trap while open.
  useEffect(() => {
    if (!open) return;

    const previouslyFocused = document.activeElement as HTMLElement | null;
    const first = dialogRef.current?.querySelector<HTMLElement>('a, button');
    first?.focus();

    const onKeyDown = (e: globalThis.KeyboardEvent): void => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        onClose();
        return;
      }
      if (e.key !== 'Tab' || !dialogRef.current) return;

      const focusables = Array.from(
        dialogRef.current.querySelectorAll<HTMLElement>('a, button'),
      ).filter((el) => !el.hasAttribute('disabled'));
      if (focusables.length === 0) return;

      const firstEl = focusables[0];
      const lastEl = focusables[focusables.length - 1];
      const active = document.activeElement;

      if (e.shiftKey && active === firstEl) {
        e.preventDefault();
        lastEl.focus();
      } else if (!e.shiftKey && active === lastEl) {
        e.preventDefault();
        firstEl.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      previouslyFocused?.focus?.(); // restore focus to the hamburger
    };
  }, [open, onClose]);

  const handleLinkClick = (e: MouseEvent<HTMLAnchorElement>, hash: string): void => {
    scrollToHash(hash, e);
    onClose();
  };

  // Backdrop click: only when the tap lands on the overlay itself,
  // not on the panel content.
  const handleBackdropClick = (e: MouseEvent<HTMLDivElement>): void => {
    if (e.target === dialogRef.current) onClose();
  };

  // Swipe-to-close (touch only, complements the close button): in LTR a
  // right→left swipe closes the menu, in RTL a left→right swipe does.
  // Distance-based on touchend with no preventDefault, so vertical panel
  // scrolling and normal taps are completely unaffected.
  const SWIPE_MIN_X = 80;
  const touchOrigin = useRef<{ x: number; y: number } | null>(null);

  const handleTouchStart = (e: TouchEvent<HTMLDivElement>): void => {
    const touch = e.touches[0];
    touchOrigin.current = touch ? { x: touch.clientX, y: touch.clientY } : null;
  };

  const handleTouchEnd = (e: TouchEvent<HTMLDivElement>): void => {
    const origin = touchOrigin.current;
    touchOrigin.current = null;
    if (!origin || !open) return;
    const touch = e.changedTouches[0];
    if (!touch) return;
    const dx = touch.clientX - origin.x;
    const dy = touch.clientY - origin.y;
    // Must be a predominantly horizontal swipe, in the closing direction.
    if (Math.abs(dx) < SWIPE_MIN_X || Math.abs(dx) < Math.abs(dy) * 1.5) return;
    const closing = t.dir === 'rtl' ? dx > 0 : dx < 0;
    if (closing) onClose();
  };

  const handleTouchCancel = (): void => {
    touchOrigin.current = null;
  };

  return (
    <div
      id="mobile-menu"
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label={t.menu.label}
      inert={!open}
      onClick={handleBackdropClick}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchCancel}
      className={`fixed inset-0 z-20 bg-black/95 backdrop-blur-md transition-opacity duration-300 ease-out light:bg-white/95 md:hidden motion-reduce:transition-none ${
        open ? 'opacity-100' : 'pointer-events-none opacity-0'
      }`}
    >
      {/* Panel slides down ~16px while fading; reverse on close.
          Scrollable so theme/language rows stay reachable on short screens. */}
      <div
        className={`flex h-full flex-col overflow-y-auto transition-transform duration-300 ease-out motion-reduce:transition-none ${
          open ? 'translate-y-0' : '-translate-y-4'
        }`}
      >
        <div className="flex items-center justify-between px-5 py-4">
          <span className="text-xl font-extrabold tracking-tight">
            Pouria<span className="text-accent">.</span>dev
          </span>
          <button
            type="button"
            onClick={onClose}
            aria-label={t.menu.close}
            className="grid h-11 w-11 cursor-pointer place-items-center rounded-full border border-hairline bg-surface/70 text-fg transition-colors hover:border-accent"
          >
            <span className="sr-only">{t.menu.close}</span>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <nav aria-label="Mobile" className="flex flex-col gap-1 px-6 pt-10">
          {NAV_LINKS.map((link: NavLink, i: number) => (
            <a
              key={link.hash}
              href={link.hash}
              onClick={(e) => handleLinkClick(e, link.hash)}
              style={{ transitionDelay: open ? `${i * 60}ms` : '0ms' }}
              className={`cursor-pointer border-b border-hairline py-4 text-2xl font-bold text-fg no-underline transition-all duration-300 ease-out hover:text-accent motion-reduce:transition-none ${
                open ? 'translate-y-0 opacity-100' : 'translate-y-3 opacity-0'
              }`}
            >
              {labels[link.hash] ?? link.label}
            </a>
          ))}
          <div
            style={{ transitionDelay: open ? `${NAV_LINKS.length * 60}ms` : '0ms' }}
            className={`mt-8 transition-all duration-300 ease-out motion-reduce:transition-none ${
              open ? 'translate-y-0 opacity-100' : 'translate-y-3 opacity-0'
            }`}
          >
            <CtaButton onNavigate={onClose} />
          </div>
          {/* Theme + language controls live inside the menu on mobile, where
              the header toggles are hidden */}
          <div
            style={{ transitionDelay: open ? `${(NAV_LINKS.length + 1) * 60}ms` : '0ms' }}
            className={`mt-6 flex flex-col gap-3 pb-10 transition-all duration-300 ease-out motion-reduce:transition-none ${
              open ? 'translate-y-0 opacity-100' : 'translate-y-3 opacity-0'
            }`}
          >
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-fg-faint">
              {t.theme.label}
            </p>
            <ThemeToggle variant="menu" />
            <LanguageToggle variant="menu" />
          </div>
        </nav>
      </div>
    </div>
  );
}
