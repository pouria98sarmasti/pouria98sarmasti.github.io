import { useLanguage } from '../i18n/LanguageContext';

/**
 * Language toggle — shows the *other* language's name (فارسی / English) so
 * the target is recognisable even if you can't read the current script.
 * The globe mark is decorative; the visible label is the accessible name.
 */
export function LanguageToggle({ variant = 'nav' }: { variant?: 'nav' | 'menu' }) {
  const { lang, toggleLang, t } = useLanguage();

  if (variant === 'menu') {
    return (
      <button
        type="button"
        onClick={toggleLang}
        aria-label={`${t.language.label} — ${t.language.toggleTo}`}
        className="flex min-h-11 w-full cursor-pointer items-center gap-3 rounded-xl border border-hairline px-4 py-2.5 text-sm font-semibold text-fg-muted transition-colors duration-200 hover:border-accent hover:text-fg"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <circle cx="8" cy="8" r="6.2" stroke="currentColor" strokeWidth="1.5" />
          <path
            d="M1.8 8h12.4M8 1.8c-3.6 3.4-3.6 9 0 12.4M8 1.8c3.6 3.4 3.6 9 0 12.4"
            stroke="currentColor"
            strokeWidth="1.2"
          />
        </svg>
        {t.language.toggleTo}
        <span className="ms-auto text-xs font-medium text-fg-faint">
          {lang === 'en' ? 'EN → FA' : 'FA → EN'}
        </span>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={toggleLang}
      aria-label={`${t.language.label} — ${t.language.toggleTo}`}
      title={`${t.language.label} — ${t.language.toggleTo}`}
      className="inline-flex h-10 cursor-pointer items-center gap-2 rounded-full border border-hairline bg-surface/70 px-4 text-sm font-bold text-fg-muted backdrop-blur-md transition-colors duration-200 hover:border-accent hover:text-fg"
    >
      <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <circle cx="8" cy="8" r="6.2" stroke="currentColor" strokeWidth="1.5" />
        <path
          d="M1.8 8h12.4M8 1.8c-3.6 3.4-3.6 9 0 12.4M8 1.8c3.6 3.4 3.6 9 0 12.4"
          stroke="currentColor"
          strokeWidth="1.2"
        />
      </svg>
      {t.language.toggleTo}
    </button>
  );
}
