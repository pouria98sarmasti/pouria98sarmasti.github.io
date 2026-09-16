import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';

export type ThemeMode = 'light' | 'dark' | 'system';
export type ResolvedTheme = 'light' | 'dark';

const STORAGE_KEY = 'pouria-dev-theme';
const DARK_QUERY = '(prefers-color-scheme: dark)';

interface ThemeContextValue {
  /** The user's stored preference (system = follow the OS). */
  mode: ThemeMode;
  /** The actually applied theme after resolving `system` against the OS. */
  resolved: ResolvedTheme;
  setMode: (mode: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

function readStoredMode(): ThemeMode {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw === 'light' || raw === 'dark' || raw === 'system') return raw;
  } catch {
    /* private mode / blocked storage — fall through to system */
  }
  return 'system';
}

function prefersDark(): boolean {
  return window.matchMedia(DARK_QUERY).matches;
}

function applyTheme(resolved: ResolvedTheme): void {
  // Dark is the default look (no class), light opts in via `html.light`
  // so first paint before hydration never flashes the wrong theme when the
  // inline boot script in index.html already set the class.
  document.documentElement.classList.toggle('light', resolved === 'light');
  document.documentElement.classList.toggle('dark', resolved === 'dark');
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<ThemeMode>(() =>
    typeof window === 'undefined' ? 'system' : readStoredMode(),
  );
  const [osDark, setOsDark] = useState<boolean>(() =>
    typeof window === 'undefined' ? true : prefersDark(),
  );

  // Track OS changes so `system` mode follows them live.
  useEffect(() => {
    const mq = window.matchMedia(DARK_QUERY);
    const onChange = (e: MediaQueryListEvent): void => setOsDark(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  const resolved: ResolvedTheme = mode === 'system' ? (osDark ? 'dark' : 'light') : mode;

  useEffect(() => {
    applyTheme(resolved);
  }, [resolved]);

  const setMode = useCallback((next: ThemeMode): void => {
    setModeState(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* storage unavailable — theme still applies for this session */
    }
  }, []);

  const value = useMemo(() => ({ mode, resolved, setMode }), [mode, resolved, setMode]);
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used inside <ThemeProvider>');
  return ctx;
}
