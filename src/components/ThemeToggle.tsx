import { useTheme } from '../hooks/useTheme';
import type { ThemeMode } from '../hooks/useTheme';
import { useLanguage } from '../i18n/LanguageContext';

/**
 * Theme switcher — three explicit options (Light / System / Dark) instead of
 * a blind cycle toggle, so the current state is always visible and each
 * target is one tap away. Segmented-pill styling matches the site's rounded
 * pill language; 40px targets balance header density with tap comfort, and
 * the mobile menu reuses the same component at full 44px+ row height via
 * the `variant="menu"` prop.
 */
export function ThemeToggle({ variant = 'nav' }: { variant?: 'nav' | 'menu' }) {
  const { mode, setMode } = useTheme();
  const { t } = useLanguage();

  const options: { value: ThemeMode; label: string; icon: React.ReactNode }[] = [
    {
      value: 'light',
      label: t.theme.light,
      icon: (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <circle cx="8" cy="8" r="3.2" stroke="currentColor" strokeWidth="1.5" />
          <path
            d="M8 1.2v1.6M8 13.2v1.6M1.2 8h1.6M13.2 8h1.6M3.2 3.2l1.1 1.1M11.7 11.7l1.1 1.1M12.8 3.2l-1.1 1.1M4.3 11.7l-1.1 1.1"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      ),
    },
    {
      value: 'system',
      label: t.theme.system,
      icon: (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <rect x="1.8" y="2.8" width="12.4" height="8.4" rx="1.4" stroke="currentColor" strokeWidth="1.5" />
          <path d="M6 13.4h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      ),
    },
    {
      value: 'dark',
      label: t.theme.dark,
      icon: (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path
            d="M13.8 9.6A5.8 5.8 0 0 1 6.4 2.2a5.8 5.8 0 1 0 7.4 7.4Z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
        </svg>
      ),
    },
  ];

  if (variant === 'menu') {
    return (
      <div role="group" aria-label={t.theme.label} className="flex flex-col gap-1">
        {options.map((opt) => {
          const active = mode === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => setMode(opt.value)}
              aria-pressed={active}
              className={`flex min-h-11 cursor-pointer items-center gap-3 rounded-xl border px-4 py-2.5 text-sm font-semibold transition-colors duration-200 ${
                active
                  ? 'border-accent bg-accent/10 text-fg'
                  : 'border-hairline text-fg-muted hover:border-accent hover:text-fg'
              }`}
            >
              <span aria-hidden="true" className={active ? 'text-accent' : ''}>
                {opt.icon}
              </span>
              {opt.label}
              {active && (
                <span aria-hidden="true" className="ms-auto text-xs font-bold text-accent">
                  ●
                </span>
              )}
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div
      role="group"
      aria-label={t.theme.label}
      className="flex items-center gap-0.5 rounded-full border border-hairline bg-surface/70 p-1 backdrop-blur-md"
    >
      {options.map((opt) => {
        const active = mode === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => setMode(opt.value)}
            aria-pressed={active}
            title={`${t.theme.label}: ${opt.label}`}
            aria-label={`${t.theme.label}: ${opt.label}`}
            className={`grid h-10 w-10 cursor-pointer place-items-center rounded-full transition-colors duration-200 ${
              active ? 'bg-accent/15 text-accent' : 'text-fg-muted hover:text-fg'
            }`}
          >
            {opt.icon}
          </button>
        );
      })}
    </div>
  );
}
