import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

export type Theme = 'light' | 'dark';
/** Preference enregistree : un theme fixe, ou le suivi du reglage systeme. */
export type ThemePreference = Theme | 'system';

interface ThemeContextType {
  /** Theme reellement applique. */
  theme: Theme;
  /** Preference choisie par l'utilisateur ('system' suit le reglage de l'OS). */
  preference: ThemePreference;
  toggleTheme: () => void;
  setTheme: (theme: ThemePreference) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = 'maths_senegal_theme';

/** Valeur par defaut definie dans le .env (VITE_THEME_DEFAULT_MODE). */
const ENV_DEFAULT: ThemePreference = (() => {
  const raw = import.meta.env.VITE_THEME_DEFAULT_MODE;
  return raw === 'light' || raw === 'dark' || raw === 'system' ? raw : 'dark';
})();

const prefersDark = (): boolean =>
  typeof window !== 'undefined' &&
  typeof window.matchMedia === 'function' &&
  window.matchMedia('(prefers-color-scheme: dark)').matches;

const resolveTheme = (preference: ThemePreference): Theme =>
  preference === 'system' ? (prefersDark() ? 'dark' : 'light') : preference;

const readStoredPreference = (): ThemePreference => {
  if (typeof window === 'undefined') return ENV_DEFAULT;
  try {
    const saved = window.localStorage.getItem(THEME_STORAGE_KEY);
    if (saved === 'light' || saved === 'dark' || saved === 'system') return saved;
  } catch {
    // localStorage indisponible (navigation privee, iframe restreinte) : on ignore.
  }
  return ENV_DEFAULT;
};

/** Applique la classe `dark` sur <html>. Partage avec le script anti-clignotement de index.html. */
const applyThemeClass = (theme: Theme) => {
  const root = document.documentElement;
  root.classList.toggle('dark', theme === 'dark');
  root.classList.toggle('light', theme === 'light');
  root.style.colorScheme = theme;
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [preference, setPreferenceState] = useState<ThemePreference>(readStoredPreference);
  const [systemIsDark, setSystemIsDark] = useState<boolean>(prefersDark);

  const theme: Theme = preference === 'system' ? (systemIsDark ? 'dark' : 'light') : preference;

  // Suit le reglage systeme tant que la preference vaut 'system'.
  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return;
    const query = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (event: MediaQueryListEvent) => setSystemIsDark(event.matches);
    query.addEventListener('change', handleChange);
    return () => query.removeEventListener('change', handleChange);
  }, []);

  useEffect(() => {
    applyThemeClass(theme);
  }, [theme]);

  useEffect(() => {
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, preference);
    } catch {
      // Stockage indisponible : la preference ne sera pas retenue, sans consequence.
    }
  }, [preference]);

  const setTheme = useCallback((next: ThemePreference) => setPreferenceState(next), []);

  const toggleTheme = useCallback(() => {
    setPreferenceState(resolveTheme(preference) === 'dark' ? 'light' : 'dark');
  }, [preference]);

  const value = useMemo(
    () => ({ theme, preference, toggleTheme, setTheme }),
    [theme, preference, toggleTheme, setTheme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
