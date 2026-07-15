/* =============================================================
   ENTERPRISE CRM — SHADOW TOKENS
   No heavy glow effects. Professional, minimal elevation.
   ============================================================= */

export const SHADOWS = {
  // Light Theme
  none: 'none',
  xs:   '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  sm:   '0 1px 3px 0 rgba(0, 0, 0, 0.08), 0 1px 2px -1px rgba(0, 0, 0, 0.08)',
  md:   '0 4px 6px -1px rgba(0, 0, 0, 0.07), 0 2px 4px -2px rgba(0, 0, 0, 0.07)',
  lg:   '0 8px 16px -4px rgba(0, 0, 0, 0.10), 0 4px 6px -4px rgba(0, 0, 0, 0.05)',
  xl:   '0 16px 32px -8px rgba(0, 0, 0, 0.12)',

  // Dark Theme
  darkXs: '0 1px 2px 0 rgba(0, 0, 0, 0.3)',
  darkSm: '0 2px 4px 0 rgba(0, 0, 0, 0.4)',
  darkMd: '0 4px 12px 0 rgba(0, 0, 0, 0.5)',
  darkLg: '0 8px 24px 0 rgba(0, 0, 0, 0.6)',

  // Focus Rings
  focusGreen: '0 0 0 3px rgba(46, 125, 50, 0.20)',
  focusBlue:  '0 0 0 3px rgba(21, 101, 192, 0.20)',
  focusRed:   '0 0 0 3px rgba(198, 40, 40, 0.20)',
} as const;
