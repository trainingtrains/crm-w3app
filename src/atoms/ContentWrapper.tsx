/* ==========================================================
   CONTENT WRAPPER
========================================================== */

import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';

export const ContentWrapper = styled(Box)(({ theme }) => ({
  width: '100%',

  display: 'flex',

  flexDirection: 'column',

  gap: theme.spacing(2),
}));
