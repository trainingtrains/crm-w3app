import { styled, alpha } from '@mui/material/styles';
import { BaseButton } from './BaseButton';

export const SearchButton = styled(BaseButton)(({ theme }) => ({
  boxShadow: `0 8px 20px ${alpha(theme.palette.primary.main, 0.25)}`,
  '&:hover': {
    backgroundColor: theme.palette.primary.dark,
    color: '#fff',

    boxShadow: `0 6px 20px ${alpha(theme.palette.primary.main, 0.3)}`,
  },
}));
