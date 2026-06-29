/* =========================
   Negative
========================= */

import { alpha, styled } from '@mui/material/styles';
import { BaseButton } from './BaseButton';

export const NegativeButton = styled(BaseButton)(({ theme }) => ({
  color: theme.palette.error.main,

  backgroundColor: '#fff',

  '&:hover': {
    backgroundColor: theme.palette.error.main,
    color: '#fff',

    boxShadow: `0 6px 20px ${alpha(theme.palette.error.main, 0.3)}`,
  },
}));
