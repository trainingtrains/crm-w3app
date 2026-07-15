/* =============================================================
   SEARCH BUTTON — GREEN
   Use for: Search · Filter · Find · Look up
   ============================================================= */

import { styled } from '@mui/material/styles';
import { BaseButton } from './BaseButton';

export const SearchButton = styled(BaseButton)({
  color:           '#ffffff',
  backgroundColor: 'var(--clr-green)',
  border:          '1px solid var(--clr-green)',

  '&:hover': {
    backgroundColor: 'var(--clr-green-hover)',
    borderColor:     'var(--clr-green-hover)',
    boxShadow:       'var(--shadow-sm)',
  },

  '&:active': {
    transform: 'scale(0.98)',
  },

  '&:disabled': {
    opacity:   0.55,
    cursor:    'not-allowed',
    boxShadow: 'none',
  },
});
