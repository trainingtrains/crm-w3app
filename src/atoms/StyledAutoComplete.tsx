import { alpha, styled } from '@mui/material/styles';
import Autocomplete from '@mui/material/Autocomplete';

export const StyledAutocomplete = styled(Autocomplete)(({ theme }) => ({
  width: '100%',

  '& .MuiInputLabel-root': {
    fontWeight: 500,
  },

  '& .MuiOutlinedInput-root': {
    borderRadius: 14,
    backgroundColor: theme.palette.background.paper,
    transition: 'all 0.2s ease-in-out',

    '&:hover': {
      boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
    },

    '&.Mui-focused': {
      boxShadow: `0 0 0 4px ${alpha(
        theme.palette.primary.main,
        0.12
      )}`,
    },
  },

  '& .MuiAutocomplete-popupIndicator': {
    transition: '0.2s',
  },

  '& .MuiAutocomplete-clearIndicator': {
    color: theme.palette.text.secondary,
  },
}));