import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';

export const BaseButton = styled(Button)(({ theme }) => ({
  minHeight: 44,
  minWidth: 130,

  padding: theme.spacing(1, 2),

  borderRadius: 10,

  fontWeight: 600,

  fontSize: '0.875rem',

  textTransform: 'none',

  transition: 'all 0.2s ease',

  boxShadow: 'none',

  '&:hover': {
    transform: 'translateY(-2px)',
  },

  [theme.breakpoints.down('sm')]: {
    width: '100%',
  },
}));
