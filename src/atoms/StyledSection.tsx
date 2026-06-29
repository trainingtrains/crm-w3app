import { Box, styled } from '@mui/material';

export const StyledSection = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  display: 'flex',
  justifyContent: 'space-between',
  gap: theme.spacing(2),

  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column',
  },

  [theme.breakpoints.up('sm')]: {
    flexDirection: 'row',
  },
}));
