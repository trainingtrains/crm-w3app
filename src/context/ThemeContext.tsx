/* =============================================================
   ENTERPRISE CRM — THEME CONTEXT
   2 Themes: bright (default) | dark
   Persists to localStorage. Applies CSS vars on mount.
   ============================================================= */

import {
  createContext, useContext, useState, useEffect, useMemo, type ReactNode,
} from 'react';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

import { brightTheme, applyThemeVars, type AppTheme } from '../theme';

// ─── Context Type ─────────────────────────────────────────────────────────────
interface ThemeContextType {
  theme: AppTheme;
  mode: 'light' | 'dark';
  isDark: boolean;
  toggleTheme: () => void;
  setTheme: (t: AppTheme) => void;
}

const ThemeContext = createContext<ThemeContextType | null>(null);

const STORAGE_KEY = 'crm_theme';

// ─── Provider ────────────────────────────────────────────────────────────────
export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setThemeState] = useState<AppTheme>(() => {
    // Read persisted preference on first render
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved === 'dark' ? 'dark' : 'bright';
  });

  // Apply CSS vars whenever theme changes
  useEffect(() => {
    applyThemeVars(theme);
  }, [theme]);

  const setTheme = (t: AppTheme) => {
    setThemeState(t);
    localStorage.setItem(STORAGE_KEY, t);
  };

  const toggleTheme = () => {
    setTheme(theme === 'bright' ? 'dark' : 'bright');
  };

  const mode = theme === 'dark' ? 'dark' : 'light';
  const isDark = theme === 'dark';

  // const muiTheme = useMemo(
  //   () => (theme === 'dark' ? brightTheme : brightTheme),
  //   [theme],
  // );

  const value = useMemo<ThemeContextType>(
    () => ({ theme, mode, isDark, toggleTheme, setTheme }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [theme],
  );

  return (
    <ThemeContext.Provider value={value}>
      <MuiThemeProvider theme={brightTheme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
};

// ─── Hook ─────────────────────────────────────────────────────────────────────
export const useAppTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useAppTheme must be used inside ThemeProvider');
  return ctx;
};
