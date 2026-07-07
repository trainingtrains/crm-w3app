import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';

export const BaseButton = styled(Button)({
  minWidth: 'clamp(110px, 8vw, 140px)',
  height: 'var(--button-height)',

  padding: '0 var(--space-lg)',

  borderRadius: 'var(--radius-md)',

  fontSize: 'var(--font-md)',
  fontWeight: 'var(--font-weight-medium)',

  textTransform: 'none',

  whiteSpace: 'nowrap',

  boxShadow: 'none',

  transition:
    'background-color var(--transition), border-color var(--transition), box-shadow var(--transition)',

  '&:hover': {
    boxShadow: 'var(--shadow-sm)',
  },

  '&:disabled': {
    opacity: 0.6,
    cursor: 'not-allowed',
    boxShadow: 'none',
  },
});
