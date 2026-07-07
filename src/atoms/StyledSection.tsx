import { Box, styled } from '@mui/material';

export const StyledSection = styled(Box)({
  width: '100%',

  display: 'grid',

  gridTemplateColumns: 'repeat(auto-fit, minmax(var(--field-min-width), 1fr))',

  gap: 'var(--space-md)',

  alignItems: 'start',
});
