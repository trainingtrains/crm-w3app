/* =============================================================
   ENTERPRISE CRM — THEME REGISTRY
   Only 2 themes: bright (default) | dark
   ============================================================= */

export { brightTheme } from './brightTheme';
export { darkTheme }   from './darkTheme';

export type AppTheme = 'bright' | 'dark';

// CSS variable sets applied to :root for each theme
// These power all CSS var() references across the app
export const applyThemeVars = (theme: AppTheme): void => {
  const root = document.documentElement;

  if (theme === 'dark') {
    // ── Dark Theme Variables ──────────────────────────────────────────────
    root.setAttribute('data-theme', 'dark');

    root.style.setProperty('--background',      '#0f1117');
    root.style.setProperty('--surface',         '#1a1f2e');
    root.style.setProperty('--surface-alt',     '#222840');
    root.style.setProperty('--border',          'rgba(255, 255, 255, 0.10)');
    root.style.setProperty('--border-focus',    'rgba(255, 255, 255, 0.25)');
    root.style.setProperty('--text-primary',    '#e8edf8');
    root.style.setProperty('--text-secondary',  '#8892b0');
    root.style.setProperty('--text-disabled',   '#4a5568');
    root.style.setProperty('--app-theme-color', '#0f1117');

    root.style.setProperty('--clr-green',       '#43a047');
    root.style.setProperty('--clr-green-hover', '#388e3c');
    root.style.setProperty('--clr-green-light', 'rgba(67, 160, 71, 0.12)');

    root.style.setProperty('--clr-blue',        '#1e88e5');
    root.style.setProperty('--clr-blue-hover',  '#1976d2');
    root.style.setProperty('--clr-blue-light',  'rgba(30, 136, 229, 0.12)');

    root.style.setProperty('--clr-red',         '#e53935');
    root.style.setProperty('--clr-red-hover',   '#d32f2f');
    root.style.setProperty('--clr-red-light',   'rgba(229, 57, 53, 0.12)');

    root.style.setProperty('--highlight-border', '#1e88e5');
    root.style.setProperty('--highlight-shadow', 'rgba(30, 136, 229, 0.18)');

    root.style.setProperty('--shadow-sm',  '0 2px 4px 0 rgba(0, 0, 0, 0.4)');
    root.style.setProperty('--shadow-md',  '0 4px 12px 0 rgba(0, 0, 0, 0.5)');

    // Legacy compat aliases
    root.style.setProperty('--primary',       '#1e88e5');
    root.style.setProperty('--primary-hover', '#1976d2');
    root.style.setProperty('--success',       '#43a047');
    root.style.setProperty('--success-hover', '#388e3c');
    root.style.setProperty('--error',         '#e53935');
    root.style.setProperty('--error-hover',   '#d32f2f');

  } else {
    // ── Bright Theme Variables (default) ──────────────────────────────────
    root.setAttribute('data-theme', 'bright');

    root.style.setProperty('--background',      '#f4f6f9');
    root.style.setProperty('--surface',         '#ffffff');
    root.style.setProperty('--surface-alt',     '#f9fafb');
    root.style.setProperty('--border',          '#e0e0e0');
    root.style.setProperty('--border-focus',    '#1565c0');
    root.style.setProperty('--text-primary',    '#1a1a2e');
    root.style.setProperty('--text-secondary',  '#616161');
    root.style.setProperty('--text-disabled',   '#bdbdbd');
    root.style.setProperty('--app-theme-color', '#f4f6f9');

    root.style.setProperty('--clr-green',       '#2e7d32');
    root.style.setProperty('--clr-green-hover', '#1b5e20');
    root.style.setProperty('--clr-green-light', '#e8f5e9');

    root.style.setProperty('--clr-blue',        '#1565c0');
    root.style.setProperty('--clr-blue-hover',  '#0d47a1');
    root.style.setProperty('--clr-blue-light',  '#e3f2fd');

    root.style.setProperty('--clr-red',         '#c62828');
    root.style.setProperty('--clr-red-hover',   '#b71c1c');
    root.style.setProperty('--clr-red-light',   '#ffebee');

    root.style.setProperty('--highlight-border', '#1565c0');
    root.style.setProperty('--highlight-shadow', 'rgba(21, 101, 192, 0.15)');

    root.style.setProperty('--shadow-sm',  '0 1px 3px 0 rgba(0, 0, 0, 0.08)');
    root.style.setProperty('--shadow-md',  '0 4px 6px -1px rgba(0, 0, 0, 0.07)');

    // Legacy compat aliases
    root.style.setProperty('--primary',       '#1565c0');
    root.style.setProperty('--primary-hover', '#0d47a1');
    root.style.setProperty('--success',       '#2e7d32');
    root.style.setProperty('--success-hover', '#1b5e20');
    root.style.setProperty('--error',         '#c62828');
    root.style.setProperty('--error-hover',   '#b71c1c');
  }
};
