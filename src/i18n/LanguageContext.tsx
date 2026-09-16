import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { dictionaries } from './dictionaries';
import type { Dictionary, Lang } from './dictionaries';

const STORAGE_KEY = 'pouria-dev-lang';

interface LanguageContextValue {
  lang: Lang;
  t: Dictionary;
  setLang: (lang: Lang) => void;
  toggleLang: () => void;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

function readInitialLang(): Lang {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw === 'en' || raw === 'fa') return raw;
  } catch {
    /* storage unavailable — fall through to browser detection */
  }
  if (typeof window !== 'undefined' && window.navigator.language.toLowerCase().startsWith('fa')) {
    return 'fa';
  }
  return 'en';
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() =>
    typeof window === 'undefined' ? 'en' : readInitialLang(),
  );

  const setLang = useCallback((next: Lang): void => {
    setLangState(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* storage unavailable — language still applies for this session */
    }
  }, []);

  const toggleLang = useCallback((): void => {
    setLangState((prev) => {
      const next: Lang = prev === 'en' ? 'fa' : 'en';
      try {
        window.localStorage.setItem(STORAGE_KEY, next);
      } catch {
        /* ignore */
      }
      return next;
    });
  }, []);

  // Keep <html lang/dir>, the tab title and the meta description in sync.
  // dir=rtl on the root is what mirrors the whole layout for Persian.
  useEffect(() => {
    const dict = dictionaries[lang];
    document.documentElement.lang = lang;
    document.documentElement.dir = dict.dir;
    document.title = dict.meta.title;
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute('content', dict.meta.description);
  }, [lang]);

  const value = useMemo(
    () => ({ lang, t: dictionaries[lang], setLang, toggleLang }),
    [lang, setLang, toggleLang],
  );
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used inside <LanguageProvider>');
  return ctx;
}
