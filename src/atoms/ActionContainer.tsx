import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';

export const ActionContainer = styled(Box)(({ theme }) => ({
  width: '100%',

  display: 'flex',

  justifyContent: 'flex-end',

  alignItems: 'center',

  gap: theme.spacing(2),

  marginTop: theme.spacing(3),

  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column',

    justifyContent: 'stretch',
  },
}));
