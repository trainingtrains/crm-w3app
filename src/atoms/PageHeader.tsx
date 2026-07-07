import { Box, styled } from '@mui/material';

export const PageHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  width: '100%',
  marginBottom: theme.spacing(3),
  gap: theme.spacing(2),
  flexWrap: 'wrap',
}));
