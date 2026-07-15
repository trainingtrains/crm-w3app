import { createTheme } from '@mui/material/styles';

export const professionalLight = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#0f766e', // Teal / operations friendly
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#475569', // slate 600
    },
    background: {
      default: '#f8fafc', // Clean slate default
      paper: '#ffffff',
    },
    text: {
      primary: '#0f172a', // high contrast slate 900
      secondary: '#475569',
    },
    divider: '#e2e8f0',
  },
  typography: {
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    h1: { fontSize: '2.25rem', fontWeight: 600 },
    h2: { fontSize: '1.875rem', fontWeight: 600 },
    h3: { fontSize: '1.5rem', fontWeight: 600 },
    h4: { fontSize: '1.25rem', fontWeight: 600 },
    h5: { fontSize: '1.125rem', fontWeight: 600 },
    h6: { fontSize: '1rem', fontWeight: 600 },
    button: { textTransform: 'none', fontWeight: 600 },
  },
  shape: {
    borderRadius: 8, // Standard operations layout
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)',
          border: '1px solid #e2e8f0',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '8px 18px',
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        size: 'medium', // larger touch targets for long hours use
      },
    },
  },
});
