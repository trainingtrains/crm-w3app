import { createTheme } from '@mui/material/styles';

export const modernEnterprise = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#6366f1', // Indigo accent
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#10b981', // Emerald success accent
    },
    background: {
      default: '#f3f4f6', // modern gray background
      paper: '#ffffff',
    },
    text: {
      primary: '#111827',
      secondary: '#6b7280',
    },
    divider: '#f3f4f6',
  },
  typography: {
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    h1: { fontSize: '2.5rem', fontWeight: 800, letterSpacing: '-0.025em' },
    h2: { fontSize: '2rem', fontWeight: 800, letterSpacing: '-0.025em' },
    h3: { fontSize: '1.75rem', fontWeight: 700 },
    h4: { fontSize: '1.5rem', fontWeight: 700 },
    h5: { fontSize: '1.25rem', fontWeight: 600 },
    h6: { fontSize: '1rem', fontWeight: 600 },
    button: { textTransform: 'none', fontWeight: 600 },
  },
  shape: {
    borderRadius: 12, // modern rounded styling
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -2px rgba(0, 0, 0, 0.05)',
          border: '1px solid #e5e7eb',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          padding: '8px 16px',
        },
      },
    },
  },
});
