/* =============================================================
   ENTERPRISE CRM — DARK THEME
   Modern · Premium · Dark Gray · Green + Blue Accents
   No pure black. High contrast. Accessible.
   ============================================================= */

import { createTheme } from '@mui/material/styles';
import { GREEN, BLUE, RED, GRAY, DARK, SEMANTIC } from './tokens/colors';
import { FONT_FAMILY, FONT_WEIGHT } from './tokens/typography';
import { SHADOWS } from './tokens/shadows';

export const darkTheme = createTheme({
  palette: {
    mode: 'dark',

    primary: {
      main:         BLUE[500],      // Slightly lighter blue for dark bg contrast
      light:        BLUE[400],
      dark:         BLUE[700],
      contrastText: '#ffffff',
    },

    secondary: {
      main:         GREEN[500],     // Slightly lighter green for dark bg
      light:        GREEN[400],
      dark:         GREEN[700],
      contrastText: '#ffffff',
    },

    error: {
      main:         RED[500],
      light:        RED[400],
      dark:         RED[700],
      contrastText: '#ffffff',
    },

    success: {
      main:         GREEN[500],
      light:        GREEN[400],
      dark:         GREEN[700],
      contrastText: '#ffffff',
    },

    info: {
      main:         BLUE[500],
      light:        BLUE[400],
      dark:         BLUE[700],
      contrastText: '#ffffff',
    },

    warning: {
      main:         '#f57c00',
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
      default: DARK.bg,       // #0f1117 — deep dark, NOT pure black
      paper:   DARK.surface,  // #1a1f2e — card surface
    },

    text: {
      primary:   DARK.textPrimary,    // #e8edf8
      secondary: DARK.textSecondary,  // #8892b0
      disabled:  '#4a5568',
    },

    divider: DARK.border,      // rgba(255,255,255,0.10)

    action: {
      hover:         'rgba(255, 255, 255, 0.05)',
      selected:      'rgba(255, 255, 255, 0.08)',
      disabled:      'rgba(255, 255, 255, 0.30)',
      disabledBackground: 'rgba(255, 255, 255, 0.08)',
    },
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
    SHADOWS.darkXs, SHADOWS.darkSm, SHADOWS.darkMd, SHADOWS.darkMd, SHADOWS.darkLg,
    SHADOWS.darkLg, SHADOWS.darkLg, SHADOWS.darkLg, SHADOWS.darkLg, SHADOWS.darkLg,
    SHADOWS.darkLg, SHADOWS.darkLg, SHADOWS.darkLg, SHADOWS.darkLg, SHADOWS.darkLg,
    SHADOWS.darkLg, SHADOWS.darkLg, SHADOWS.darkLg, SHADOWS.darkLg, SHADOWS.darkLg,
    SHADOWS.darkLg, SHADOWS.darkLg, SHADOWS.darkLg, SHADOWS.darkLg,
  ],

  components: {
    // ── App Bar ──────────────────────────────────────────────────────────────
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: DARK.surface,
          backgroundImage: 'none',
          boxShadow:       'none',
          borderBottom:    `1px solid ${DARK.border}`,
          color:           DARK.textPrimary,
        },
      },
    },

    // ── Paper / Cards ────────────────────────────────────────────────────────
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: DARK.surface,
          boxShadow:       SHADOWS.darkMd,
          border:          `1px solid ${DARK.border}`,
        },
        elevation0: { boxShadow: 'none', border: `1px solid ${DARK.border}` },
        elevation1: { boxShadow: SHADOWS.darkXs },
        elevation2: { boxShadow: SHADOWS.darkSm },
        elevation3: { boxShadow: SHADOWS.darkMd },
      },
    },

    // ── Buttons ──────────────────────────────────────────────────────────────
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight:    FONT_WEIGHT.semibold,
          borderRadius:  6,
          padding:       '7px 18px',
          boxShadow:     'none',
          '&:hover': { boxShadow: SHADOWS.darkXs },
          '&:active': { transform: 'scale(0.98)' },
        },
        containedPrimary: {
          backgroundColor: BLUE[600],
          '&:hover': { backgroundColor: BLUE[500] },
        },
        containedSecondary: {
          backgroundColor: GREEN[600],
          '&:hover': { backgroundColor: GREEN[500] },
        },
        containedError: {
          backgroundColor: RED[700],
          '&:hover': { backgroundColor: RED[600] },
        },
        containedSuccess: {
          backgroundColor: GREEN[600],
          '&:hover': { backgroundColor: GREEN[500] },
        },
        outlinedPrimary: {
          borderColor: BLUE[500],
          color:       BLUE[400],
          '&:hover': { borderColor: BLUE[400], backgroundColor: 'rgba(30, 136, 229, 0.08)' },
        },
        outlinedError: {
          borderColor: RED[500],
          color:       RED[400],
          '&:hover': { borderColor: RED[400], backgroundColor: 'rgba(229, 57, 53, 0.08)' },
        },
        outlinedSuccess: {
          borderColor: GREEN[500],
          color:       GREEN[400],
          '&:hover': { borderColor: GREEN[400], backgroundColor: 'rgba(67, 160, 71, 0.08)' },
        },
      },
    },

    // ── Icon Button ──────────────────────────────────────────────────────────
    MuiIconButton: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          color: DARK.textSecondary,
          transition: 'background-color 0.15s ease',
          '&:hover': { backgroundColor: 'rgba(255,255,255,0.06)', color: DARK.textPrimary },
        },
        colorPrimary: { color: BLUE[400],  '&:hover': { backgroundColor: 'rgba(30,136,229,0.10)' } },
        colorError:   { color: RED[400],   '&:hover': { backgroundColor: 'rgba(229,57,53,0.10)'  } },
        colorSuccess: { color: GREEN[400], '&:hover': { backgroundColor: 'rgba(67,160,71,0.10)'  } },
      },
    },

    // ── Text Fields ──────────────────────────────────────────────────────────
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          backgroundColor: DARK.surfaceAlt,
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: BLUE[500],
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: BLUE[400],
            borderWidth: '1.5px',
          },
          '&.Mui-error .MuiOutlinedInput-notchedOutline': {
            borderColor: RED[400],
          },
        },
        notchedOutline: {
          borderColor: DARK.border,
        },
        input: {
          color: DARK.textPrimary,
          '&::placeholder': { color: DARK.textSecondary, opacity: 1 },
        },
      },
    },

    MuiInputLabel: {
      styleOverrides: {
        root: {
          fontSize: '0.8125rem',
          color:    DARK.textSecondary,
          '&.Mui-focused': { color: BLUE[400] },
          '&.Mui-error':   { color: RED[400]  },
        },
      },
    },

    // ── Select ───────────────────────────────────────────────────────────────
    MuiSelect: {
      styleOverrides: {
        icon: { color: DARK.textSecondary },
      },
    },

    // ── Menu (Dropdown) ──────────────────────────────────────────────────────
    MuiMenu: {
      styleOverrides: {
        paper: {
          backgroundColor: DARK.surfaceAlt,
          border: `1px solid ${DARK.border}`,
        },
      },
    },

    MuiMenuItem: {
      styleOverrides: {
        root: {
          fontSize: '0.875rem',
          '&:hover': { backgroundColor: 'rgba(255,255,255,0.06)' },
          '&.Mui-selected': {
            backgroundColor: 'rgba(30,136,229,0.15)',
            '&:hover': { backgroundColor: 'rgba(30,136,229,0.20)' },
          },
        },
      },
    },

    // ── Tables ───────────────────────────────────────────────────────────────
    MuiTableHead: {
      styleOverrides: {
        root: {
          '& .MuiTableCell-head': {
            backgroundColor: '#0d47a1',   // Darker blue for dark theme headers
            color:           '#ffffff',
            fontWeight:      FONT_WEIGHT.semibold,
            fontSize:        '0.8125rem',
            letterSpacing:   '0.03em',
            padding:         '10px 14px',
            borderBottom:    'none',
          },
        },
      },
    },

    MuiTableRow: {
      styleOverrides: {
        root: {
          '&:hover': { backgroundColor: 'rgba(255,255,255,0.04)' },
          '&.Mui-selected': {
            backgroundColor: 'rgba(30,136,229,0.12) !important',
          },
        },
      },
    },

    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottom: `1px solid ${DARK.border}`,
          fontSize: '0.8125rem',
          padding:  '9px 14px',
          color:    DARK.textPrimary,
        },
      },
    },

    // ── Data Grid ────────────────────────────────────────────────────────────
    MuiDataGrid: {
      styleOverrides: {
        root: {
          border: `1px solid ${DARK.border}`,
          borderRadius: 6,
          color: DARK.textPrimary,
          '& .MuiDataGrid-columnHeaders': {
            backgroundColor: '#0d47a1',
            color:           '#ffffff',
            borderBottom:    'none',
          },
          '& .MuiDataGrid-columnHeader': {
            backgroundColor: '#0d47a1',
            color:           '#ffffff',
          },
          '& .MuiDataGrid-sortIcon': { color: '#ffffff' },
          '& .MuiDataGrid-menuIconButton': { color: '#ffffff' },
          '& .MuiDataGrid-row:hover': { backgroundColor: 'rgba(255,255,255,0.04)' },
          '& .MuiDataGrid-cell': { borderBottom: `1px solid ${DARK.border}` },
          '& .MuiDataGrid-footerContainer': { borderTop: `1px solid ${DARK.border}` },
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
        colorSuccess: { backgroundColor: 'rgba(67,160,71,0.15)', color: GREEN[400] },
        colorError:   { backgroundColor: 'rgba(229,57,53,0.15)', color: RED[400]   },
        colorPrimary: { backgroundColor: 'rgba(30,136,229,0.15)',color: BLUE[400]  },
        colorDefault: { backgroundColor: 'rgba(255,255,255,0.08)',color: DARK.textSecondary },
      },
    },

    // ── Tabs ─────────────────────────────────────────────────────────────────
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: FONT_WEIGHT.medium,
          color: DARK.textSecondary,
          '&.Mui-selected': { color: BLUE[400], fontWeight: FONT_WEIGHT.semibold },
        },
      },
    },

    MuiTabs: {
      styleOverrides: {
        indicator: { backgroundColor: BLUE[400], height: 2 },
      },
    },

    // ── Dialog ───────────────────────────────────────────────────────────────
    MuiDialog: {
      styleOverrides: {
        paper: {
          backgroundColor: DARK.surfaceAlt,
          border: `1px solid ${DARK.border}`,
        },
      },
    },

    MuiDialogTitle: {
      styleOverrides: {
        root: {
          fontSize:   '1.0625rem',
          fontWeight: FONT_WEIGHT.semibold,
          padding:    '20px 24px 12px',
          color:      DARK.textPrimary,
        },
      },
    },

    // ── Tooltip ──────────────────────────────────────────────────────────────
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: '#2d3748',
          color:           '#e8edf8',
          fontSize:        '0.75rem',
          borderRadius:    4,
          border:          `1px solid ${DARK.border}`,
        },
        arrow: { color: '#2d3748' },
      },
    },

    // ── List Items ───────────────────────────────────────────────────────────
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          color: DARK.textSecondary,
          '&.Mui-selected': {
            backgroundColor: 'rgba(30,136,229,0.15)',
            color: BLUE[400],
            '&:hover': { backgroundColor: 'rgba(30,136,229,0.20)' },
          },
          '&:hover': { backgroundColor: 'rgba(255,255,255,0.05)', color: DARK.textPrimary },
        },
      },
    },

    // ── Divider ──────────────────────────────────────────────────────────────
    MuiDivider: {
      styleOverrides: {
        root: { borderColor: DARK.border },
      },
    },

    // ── Skeleton ─────────────────────────────────────────────────────────────
    MuiSkeleton: {
      styleOverrides: {
        root: { backgroundColor: 'rgba(255,255,255,0.07)' },
      },
    },

    // ── Switch ───────────────────────────────────────────────────────────────
    MuiSwitch: {
      styleOverrides: {
        switchBase: {
          '&.Mui-checked': {
            color: GREEN[400],
            '& + .MuiSwitch-track': { backgroundColor: GREEN[700] },
          },
        },
        track: { backgroundColor: 'rgba(255,255,255,0.25)' },
      },
    },

    // ── CssBaseline ──────────────────────────────────────────────────────────
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          background: DARK.bg,
          color:      DARK.textPrimary,
          scrollbarWidth: 'thin',
          scrollbarColor: `${DARK.border} transparent`,
          '&::-webkit-scrollbar': { width: '6px', height: '6px' },
          '&::-webkit-scrollbar-track': { background: 'transparent' },
          '&::-webkit-scrollbar-thumb': { background: DARK.border, borderRadius: '3px' },
        },
      },
    },
  },
});
