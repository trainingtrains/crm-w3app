import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

export const PageSubTitle = styled(Typography)(({ theme }) => ({
  marginTop: theme.spacing(1),

  color: theme.palette.text.secondary,

  maxWidth: 700,

  marginInline: 'auto',
}));
