import FormControlLabel from '@mui/material/FormControlLabel';
import { styled } from '@mui/material/styles';

export const StyledFormControlLabel = styled(FormControlLabel)(({ theme }) => ({
  width: '100%',

  marginLeft: 0,

  '& .MuiTypography-root': {
    fontWeight: 500,

    color: theme.palette.text.primary,
  },
}));
