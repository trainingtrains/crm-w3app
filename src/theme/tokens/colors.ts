/* =============================================================
   ENTERPRISE CRM — MASTER COLOR TOKENS
   5-Color Approved Palette: Green | Blue | Red | Gray | White
   ============================================================= */

// ─── GREEN — Positive Actions (Save, Submit, Search, Activate) ───────────────
export const GREEN = {
  50:  '#e8f5e9',
  100: '#c8e6c9',
  200: '#a5d6a7',
  300: '#81c784',
  400: '#66bb6a',
  500: '#43a047',
  600: '#388e3c',
  700: '#2e7d32',   // PRIMARY GREEN — main action
  800: '#1b5e20',
  900: '#145214',
  hover:      '#1b5e20',
  light:      '#e8f5e9',
  contrastText: '#ffffff',
} as const;

// ─── BLUE — Navigation & Utility (Back, Reset, Cancel, Navigate) ─────────────
export const BLUE = {
  50:  '#e3f2fd',
  100: '#bbdefb',
  200: '#90caf9',
  300: '#64b5f6',
  400: '#42a5f5',
  500: '#1e88e5',
  600: '#1976d2',
  700: '#1565c0',   // PRIMARY BLUE — navigation / utility
  800: '#0d47a1',
  900: '#0a3880',
  hover:      '#0d47a1',
  light:      '#e3f2fd',
  contrastText: '#ffffff',
} as const;

// ─── RED — Danger Actions (Delete, Deactivate, Reject, Remove) ───────────────
export const RED = {
  50:  '#ffebee',
  100: '#ffcdd2',
  200: '#ef9a9a',
  300: '#e57373',
  400: '#ef5350',
  500: '#e53935',
  600: '#d32f2f',
  700: '#c62828',   // PRIMARY RED — danger action
  800: '#b71c1c',
  900: '#7f0000',
  hover:      '#b71c1c',
  light:      '#ffebee',
  contrastText: '#ffffff',
} as const;

// ─── GRAY — Neutral UI (Borders, Backgrounds, Secondary Text) ────────────────
export const GRAY = {
  50:  '#fafafa',
  100: '#f5f5f5',
  200: '#eeeeee',
  300: '#e0e0e0',
  400: '#bdbdbd',
  500: '#9e9e9e',
  600: '#757575',   // STANDARD GRAY — secondary text
  700: '#616161',
  800: '#424242',
  900: '#212121',
} as const;

// ─── DARK SURFACES (Dark Theme Only) ─────────────────────────────────────────
export const DARK = {
  bg:         '#0f1117',   // Page background (near-black, not pure black)
  surface:    '#1a1f2e',   // Card / panel surface
  surfaceAlt: '#222840',   // Elevated surface (dialogs, dropdowns)
  border:     'rgba(255, 255, 255, 0.10)',
  borderFocus:'rgba(255, 255, 255, 0.22)',
  textPrimary:'#e8edf8',
  textSecondary: '#8892b0',
} as const;

// ─── SEMANTIC ALIASES ─────────────────────────────────────────────────────────
export const SEMANTIC = {
  // Action color assignments
  ACTION_PRIMARY:   GREEN[700],   // Save / Submit / Confirm / Search
  ACTION_NAV:       BLUE[700],    // Back / Reset / Cancel / Navigate
  ACTION_DANGER:    RED[700],     // Delete / Deactivate / Reject

  // Status colors
  SUCCESS:          GREEN[700],
  ERROR:            RED[700],
  INFO:             BLUE[700],
  NEUTRAL:          GRAY[600],

  // Light Theme Surfaces
  BG_LIGHT:         '#f4f6f9',
  SURFACE_LIGHT:    '#ffffff',
  BORDER_LIGHT:     '#e0e0e0',
  TEXT_PRIMARY_LIGHT:   '#1a1a2e',
  TEXT_SECONDARY_LIGHT: '#616161',

  // Dark Theme Surfaces
  BG_DARK:          DARK.bg,
  SURFACE_DARK:     DARK.surface,
  BORDER_DARK:      DARK.border,
  TEXT_PRIMARY_DARK:    DARK.textPrimary,
  TEXT_SECONDARY_DARK:  DARK.textSecondary,

  // Header Brand Color
  HEADER:           BLUE[700],    // Enterprise Blue — professional & consistent
  HEADER_DARK:      DARK.surface,
  SIDEBAR:          '#1a233a',    // Deep navy — iconic enterprise sidebar
  SIDEBAR_ACTIVE:   BLUE[700],
} as const;
