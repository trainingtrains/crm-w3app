import { styled } from '@mui/material/styles';
import { BaseButton } from './BaseButton';

/* =========================
   SECONDARY BUTTON
========================= */

export const SecondaryButton = styled(BaseButton)({
  color: 'var(--text)',

  backgroundColor: 'var(--surface)',

  border: '1px solid var(--border)',

  '&:hover': {
    backgroundColor: 'var(--background)',
    borderColor: 'var(--primary)',
    color: 'var(--primary)',
    boxShadow: 'var(--shadow-sm)',
  },

  '&:active': {
    transform: 'scale(0.98)',
  },

  '&:disabled': {
    opacity: 0.6,
    cursor: 'not-allowed',
    boxShadow: 'none',
  },
});
