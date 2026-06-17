import { styled } from '@mui/material/styles';

import { Paper } from '@mui/material';

/* ==========================================================
   PAGE CONTAINER
========================================================== */

export const FormContainer = styled(Paper)(({ theme }) => ({
  width: '100%',
  maxWidth: '1800px',
  margin: '0 auto',

  padding: theme.spacing(3),

  borderRadius: 20,

  background: theme.palette.background.paper,

  boxShadow: '0 8px 32px rgba(15,23,42,0.08)',

  overflow: 'hidden',

  [theme.breakpoints.down('md')]: {
    padding: theme.spacing(2.5),
  },

  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(2),
    borderRadius: 16,
  },
}));
