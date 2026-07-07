import { styled } from '@mui/material/styles';
import { BaseButton } from './BaseButton';

/* =========================
   PRIMARY BUTTON
========================= */

export const PrimaryButton = styled(BaseButton)({
  color: '#fff',

  backgroundColor: 'var(--primary)',

  border: '1px solid var(--primary)',

  '&:hover': {
    backgroundColor: 'var(--primary-hover)',
    borderColor: 'var(--primary-hover)',
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
