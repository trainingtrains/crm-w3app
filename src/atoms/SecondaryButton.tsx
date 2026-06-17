/* =========================
   Secondary
========================= */

import { styled } from '@mui/material/styles';
import { BaseButton } from './BaseButton';

export const SecondaryButton = styled(BaseButton)(({ theme }) => ({
  color: theme.palette.text.primary,

  backgroundColor: theme.palette.grey[100],

  border: `1px solid ${theme.palette.divider}`,

  '&:hover': {
    backgroundColor: theme.palette.grey[200],
  },
}));
