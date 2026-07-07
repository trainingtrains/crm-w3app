import { styled } from '@mui/material/styles';
import { BaseButton } from './BaseButton';

/* =========================
   RESET BUTTON
========================= */

export const ResetButton = styled(BaseButton)({
  color: 'var(--warning)',

  backgroundColor: 'var(--surface)',

  border: '1px solid var(--warning)',

  '&:hover': {
    backgroundColor: 'var(--warning)',
    color: '#fff',
    borderColor: 'var(--warning-hover)',
    boxShadow: 'var(--shadow-sm)',
  },

  '&:disabled': {
    opacity: 0.6,
  },
});
