import { alpha, styled } from '@mui/material/styles';
import { BaseButton } from './BaseButton';

export const ResetButton = styled(BaseButton)(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  color: 'green',
  '&:hover': {
    backgroundColor: 'green',
    color: '#fff',

    boxShadow: `0 6px 20px ${alpha(theme.palette.primary.main, 0.3)}`,
  },
}));
