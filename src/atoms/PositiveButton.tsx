/* =========================
   Positive
========================= */

import { alpha, styled } from '@mui/material/styles';
import { BaseButton } from './BaseButton';

export const PositiveButton = styled(BaseButton)(({ theme }) => ({
  color: '#fff',

  backgroundColor: theme.palette.success.main,

  '&:hover': {
    backgroundColor: theme.palette.success.dark,

    boxShadow: `0 6px 20px ${alpha(theme.palette.success.main, 0.3)}`,
  },
}));
