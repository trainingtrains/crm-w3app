import { styled } from '@mui/material/styles';

import { Typography } from '@mui/material';

export const PageTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 700,

  color: theme.palette.text.primary,

  fontSize: 'clamp(1.6rem,2vw,2.5rem)',

  lineHeight: 1.2,
}));
