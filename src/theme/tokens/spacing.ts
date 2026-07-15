/* =============================================================
   ENTERPRISE CRM — SPACING TOKENS
   ============================================================= */

export const SPACING = {
  // Base unit: 4px
  0:   '0px',
  1:   '4px',
  2:   '8px',
  3:   '12px',
  4:   '16px',
  5:   '20px',
  6:   '24px',
  8:   '32px',
  10:  '40px',
  12:  '48px',
  16:  '64px',

  // Semantic aliases
  xs:  '4px',
  sm:  '8px',
  md:  '12px',
  lg:  '16px',
  xl:  '24px',
  xxl: '32px',

  // Component-specific
  cardPadding:    '20px',
  sectionPadding: '24px',
  pagePadding:    '24px',
  buttonPaddingX: '16px',
  inputPaddingX:  '12px',
  inputPaddingY:  '0px',
  tableCell:      '10px 14px',
} as const;

export const SIZES = {
  inputHeight:    '38px',
  buttonHeight:   '38px',
  tableRowHeight: '38px',
  headerHeight:   '64px',
  sidebarWidth:   '60px',
  sidebarExpanded:'220px',
} as const;
