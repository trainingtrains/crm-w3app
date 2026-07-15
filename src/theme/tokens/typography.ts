/* =============================================================
   ENTERPRISE CRM — TYPOGRAPHY TOKENS
   ============================================================= */

export const FONT_FAMILY =
  "'Inter', 'Segoe UI', -apple-system, BlinkMacSystemFont, Roboto, sans-serif";

export const FONT_SIZE = {
  xs:   '11px',
  sm:   '12px',
  base: '13px',   // Dense enterprise UI — optimized for long workdays
  md:   '14px',
  lg:   '16px',
  xl:   '20px',
  xxl:  '24px',
  h1:   '28px',
} as const;

export const FONT_WEIGHT = {
  normal:   400,
  medium:   500,
  semibold: 600,
  bold:     700,
  extrabold:800,
} as const;

export const LINE_HEIGHT = {
  tight:  1.25,
  normal: 1.5,
  relaxed:1.75,
} as const;

export const LETTER_SPACING = {
  tight:  '-0.01em',
  normal: '0',
  wide:   '0.025em',
  wider:  '0.05em',
  caps:   '0.08em',
} as const;
