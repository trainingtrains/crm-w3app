import { styled } from '@mui/material/styles';
import { BaseButton } from './BaseButton';

/* =========================
   SEARCH BUTTON
========================= */

export const SearchButton = styled(BaseButton)({
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
});
