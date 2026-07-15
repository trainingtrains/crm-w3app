/* =============================================================
   SECONDARY BUTTON — BLUE
   Use for: Back · Cancel · Navigate · View · Download
   ============================================================= */

import { styled } from '@mui/material/styles';
import { BaseButton } from './BaseButton';

export const SecondaryButton = styled(BaseButton)({
  color:           'var(--clr-blue)',
  backgroundColor: 'transparent',
  border:          '1px solid var(--clr-blue)',

  '&:hover': {
    backgroundColor: 'var(--clr-blue-light)',
    borderColor:     'var(--clr-blue-hover)',
    color:           'var(--clr-blue-hover)',
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
