/* =============================================================
   ENTERPRISE CRM — BRIGHT THEME
   Clean · Professional · White · Green + Blue Accents
   ============================================================= */

import { createTheme } from '@mui/material/styles';
import { GREEN, BLUE, RED, GRAY, SEMANTIC } from './tokens/colors';
import { FONT_FAMILY, FONT_WEIGHT } from './tokens/typography';
import { SHADOWS } from './tokens/shadows';

export const brightTheme = createTheme({
  palette: {
    mode: 'light',

    primary: {
      main:         BLUE[700],     // Enterprise Blue — navigation, utility
      light:        BLUE[600],
      dark:         BLUE[800],
      contrastText: '#ffffff',
    },

    secondary: {
      main:         GREEN[700],    // Enterprise Green — positive actions
      light:        GREEN[600],
      dark:         GREEN[800],
      contrastText: '#ffffff',
    },

    error: {
      main:         RED[700],
      light:        RED[600],
      dark:         RED[800],
      contrastText: '#ffffff',
    },

    success: {
      main:         GREEN[700],
      light:        GREEN[600],
      dark:         GREEN[800],
      contrastText: '#ffffff',
    },

    info: {
      main:         BLUE[700],
      light:        BLUE[600],
      dark:         BLUE[800],
      contrastText: '#ffffff',
    },

    warning: {
      main:         '#e65100',     // Only used for actual warnings (not buttons)
      contrastText: '#ffffff',
    },

    grey: {
      50:  GRAY[50],
      100: GRAY[100],
      200: GRAY[200],
      300: GRAY[300],
      400: GRAY[400],
      500: GRAY[500],
      600: GRAY[600],
      700: GRAY[700],
      800: GRAY[800],
      900: GRAY[900],
    },

    background: {
      default: SEMANTIC.BG_LIGHT,       // #f4f6f9 — slight warm-gray page bg
      paper:   SEMANTIC.SURFACE_LIGHT,  // #ffffff — card / panel surface
    },

    text: {
      primary:   SEMANTIC.TEXT_PRIMARY_LIGHT,    // #1a1a2e
      secondary: SEMANTIC.TEXT_SECONDARY_LIGHT,  // #616161
      disabled:  GRAY[400],
    },

    divider: SEMANTIC.BORDER_LIGHT,   // #e0e0e0
  },

  typography: {
    fontFamily: FONT_FAMILY,
    fontWeightLight:   FONT_WEIGHT.normal,
    fontWeightRegular: FONT_WEIGHT.medium,
    fontWeightMedium:  FONT_WEIGHT.semibold,
    fontWeightBold:    FONT_WEIGHT.bold,
    h1: { fontSize: '1.75rem', fontWeight: FONT_WEIGHT.bold,     letterSpacing: '-0.01em' },
    h2: { fontSize: '1.5rem',  fontWeight: FONT_WEIGHT.bold,     letterSpacing: '-0.01em' },
    h3: { fontSize: '1.25rem', fontWeight: FONT_WEIGHT.semibold                           },
    h4: { fontSize: '1.125rem',fontWeight: FONT_WEIGHT.semibold                          },
    h5: { fontSize: '1rem',    fontWeight: FONT_WEIGHT.semibold                          },
    h6: { fontSize: '0.875rem',fontWeight: FONT_WEIGHT.semibold                         },
    body1: { fontSize: '0.875rem', lineHeight: 1.6 },
    body2: { fontSize: '0.8125rem',lineHeight: 1.6 },
    caption: { fontSize: '0.75rem', letterSpacing: '0.03em' },
    overline: { fontSize: '0.6875rem', letterSpacing: '0.08em', textTransform: 'uppercase' },
    button: { textTransform: 'none', fontWeight: FONT_WEIGHT.semibold, fontSize: '0.875rem' },
  },

  shape: {
    borderRadius: 6,
  },

  shadows: [
    'none',
    SHADOWS.xs, SHADOWS.sm, SHADOWS.md, SHADOWS.md, SHADOWS.lg,
    SHADOWS.lg, SHADOWS.lg, SHADOWS.xl, SHADOWS.xl, SHADOWS.xl,
    SHADOWS.xl, SHADOWS.xl, SHADOWS.xl, SHADOWS.xl, SHADOWS.xl,
    SHADOWS.xl, SHADOWS.xl, SHADOWS.xl, SHADOWS.xl, SHADOWS.xl,
    SHADOWS.xl, SHADOWS.xl, SHADOWS.xl, SHADOWS.xl,
  ],

  components: {
    // ── App Bar ──────────────────────────────────────────────────────────────
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#ffffff',
          color: SEMANTIC.TEXT_PRIMARY_LIGHT,
          backgroundImage: 'none',
          boxShadow: 'none',
          borderBottom: `1px solid ${GRAY[200]}`,
        },
      },
    },

    // ── Paper / Cards ────────────────────────────────────────────────────────
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          boxShadow: SHADOWS.sm,
        },
        elevation0: { boxShadow: 'none' },
        elevation1: { boxShadow: SHADOWS.xs },
        elevation2: { boxShadow: SHADOWS.sm },
        elevation3: { boxShadow: SHADOWS.md },
      },
    },

    // ── Buttons ──────────────────────────────────────────────────────────────
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight:     FONT_WEIGHT.semibold,
          borderRadius:   6,
          padding:        '7px 18px',
          boxShadow:      'none',
          '&:hover': { boxShadow: SHADOWS.xs },
          '&:active': { transform: 'scale(0.98)' },
        },
        containedPrimary: {
          backgroundColor: BLUE[700],
          '&:hover': { backgroundColor: BLUE[800] },
        },
        containedSecondary: {
          backgroundColor: GREEN[700],
          '&:hover': { backgroundColor: GREEN[800] },
        },
        containedError: {
          backgroundColor: RED[700],
          '&:hover': { backgroundColor: RED[800] },
        },
        containedSuccess: {
          backgroundColor: GREEN[700],
          '&:hover': { backgroundColor: GREEN[800] },
        },
        outlinedPrimary: {
          borderColor: BLUE[700],
          color:       BLUE[700],
          '&:hover': { borderColor: BLUE[800], backgroundColor: BLUE[50] },
        },
        outlinedError: {
          borderColor: RED[700],
          color:       RED[700],
          '&:hover': { borderColor: RED[800], backgroundColor: RED[50] },
        },
        outlinedSuccess: {
          borderColor: GREEN[700],
          color:       GREEN[700],
          '&:hover': { borderColor: GREEN[800], backgroundColor: GREEN[50] },
        },
      },
    },

    // ── Icon Button ──────────────────────────────────────────────────────────
    MuiIconButton: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          transition: 'background-color 0.15s ease',
          '&:hover': { backgroundColor: GRAY[100] },
        },
        colorPrimary: { color: BLUE[700], '&:hover': { backgroundColor: BLUE[50] } },
        colorError:   { color: RED[700],  '&:hover': { backgroundColor: RED[50]  } },
        colorSuccess: { color: GREEN[700],'&:hover': { backgroundColor: GREEN[50]} },
      },
    },

    // ── Text Fields ──────────────────────────────────────────────────────────
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          backgroundColor: '#ffffff',
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: BLUE[400],
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: BLUE[700],
            borderWidth: '1.5px',
          },
          '&.Mui-error .MuiOutlinedInput-notchedOutline': {
            borderColor: RED[700],
          },
        },
        notchedOutline: {
          borderColor: GRAY[300],
        },
      },
    },

    MuiInputLabel: {
      styleOverrides: {
        root: {
          fontSize: '0.8125rem',
          color: GRAY[600],
          '&.Mui-focused': { color: BLUE[700] },
          '&.Mui-error':   { color: RED[700]  },
        },
      },
    },

    // ── Select ───────────────────────────────────────────────────────────────
    MuiSelect: {
      styleOverrides: {
        icon: { color: GRAY[500] },
      },
    },

    // ── Tables ───────────────────────────────────────────────────────────────
    MuiTableHead: {
      styleOverrides: {
        root: {
          '& .MuiTableCell-head': {
            backgroundColor: BLUE[700],
            color:           '#ffffff',
            fontWeight:      FONT_WEIGHT.semibold,
            fontSize:        '0.8125rem',
            letterSpacing:   '0.03em',
            padding:         '10px 14px',
            borderBottom:    'none',
            whiteSpace:      'nowrap',
          },
        },
      },
    },

    MuiTableRow: {
      styleOverrides: {
        root: {
          '&:hover': { backgroundColor: BLUE[50] },
          '&.Mui-selected': {
            backgroundColor: `${BLUE[50]} !important`,
            '&:hover': { backgroundColor: `${BLUE[100]} !important` },
          },
        },
      },
    },

    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottom: `1px solid ${GRAY[200]}`,
          fontSize:  '0.8125rem',
          padding:   '9px 14px',
          color:     SEMANTIC.TEXT_PRIMARY_LIGHT,
        },
        body: {
          '&:first-of-type': { color: GRAY[800], fontWeight: FONT_WEIGHT.medium },
        },
      },
    },

    // ── Data Grid ────────────────────────────────────────────────────────────
    MuiDataGrid: {
      styleOverrides: {
        root: {
          border: `1px solid ${GRAY[200]}`,
          borderRadius: 6,
          '& .MuiDataGrid-columnHeaders': {
            backgroundColor: BLUE[700],
            color: '#ffffff',
            borderBottom: 'none',
          },
          '& .MuiDataGrid-columnHeader': {
            backgroundColor: BLUE[700],
            color: '#ffffff',
          },
          '& .MuiDataGrid-sortIcon': { color: '#ffffff' },
          '& .MuiDataGrid-menuIconButton': { color: '#ffffff' },
          '& .MuiDataGrid-row:hover': { backgroundColor: BLUE[50] },
          '& .MuiDataGrid-cell': {
            borderBottom: `1px solid ${GRAY[100]}`,
            fontSize: '0.8125rem',
          },
          '& .MuiDataGrid-footerContainer': {
            borderTop: `1px solid ${GRAY[200]}`,
          },
        },
      },
    },

    // ── Chip ─────────────────────────────────────────────────────────────────
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          fontWeight:   FONT_WEIGHT.medium,
          fontSize:     '0.75rem',
        },
        colorSuccess:  { backgroundColor: GREEN[50], color: GREEN[800] },
        colorError:    { backgroundColor: RED[50],   color: RED[800]   },
        colorPrimary:  { backgroundColor: BLUE[50],  color: BLUE[800]  },
        colorDefault:  { backgroundColor: GRAY[100], color: GRAY[700]  },
      },
    },

    // ── Tabs ─────────────────────────────────────────────────────────────────
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: FONT_WEIGHT.medium,
          fontSize: '0.875rem',
          '&.Mui-selected': { color: BLUE[700], fontWeight: FONT_WEIGHT.semibold },
        },
      },
    },

    MuiTabs: {
      styleOverrides: {
        indicator: { backgroundColor: BLUE[700], height: 2 },
      },
    },

    // ── Dialog ───────────────────────────────────────────────────────────────
    MuiDialogTitle: {
      styleOverrides: {
        root: {
          fontSize:   '1.0625rem',
          fontWeight: FONT_WEIGHT.semibold,
          padding:    '20px 24px 12px',
        },
      },
    },

    // ── Tooltip ──────────────────────────────────────────────────────────────
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: GRAY[800],
          color: '#ffffff',
          fontSize: '0.75rem',
          borderRadius: 4,
        },
        arrow: { color: GRAY[800] },
      },
    },

    // ── List Item ────────────────────────────────────────────────────────────
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          '&.Mui-selected': {
            backgroundColor: BLUE[50],
            color: BLUE[700],
            '&:hover': { backgroundColor: BLUE[100] },
          },
          '&:hover': { backgroundColor: GRAY[100] },
        },
      },
    },

    // ── Divider ──────────────────────────────────────────────────────────────
    MuiDivider: {
      styleOverrides: {
        root: { borderColor: GRAY[200] },
      },
    },

    // ── Skeleton ─────────────────────────────────────────────────────────────
    MuiSkeleton: {
      styleOverrides: {
        root: { backgroundColor: GRAY[100] },
      },
    },
  },
});
