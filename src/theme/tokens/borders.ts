/* =============================================================
   ENTERPRISE CRM — BORDER TOKENS
   ============================================================= */

export const RADIUS = {
  none: '0px',
  xs:   '2px',
  sm:   '4px',
  md:   '6px',     // Standard component radius (inputs, buttons, cards)
  lg:   '8px',
  xl:   '12px',
  full: '9999px',  // Pills / badges
} as const;

export const BORDER = {
  width: {
    thin:   '1px',
    medium: '2px',
    thick:  '3px',
  },
  // Composed border values
  default:  '1px solid var(--border)',
  focus:    '1.5px solid var(--clr-blue)',
  error:    '1.5px solid var(--clr-red)',
  success:  '1.5px solid var(--clr-green)',
} as const;
