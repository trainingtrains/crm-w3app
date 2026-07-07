import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';

export const ActionContainer = styled(Box)({
  width: '100%',

  display: 'flex',

  justifyContent: 'flex-end',

  alignItems: 'center',

  flexWrap: 'wrap',

  gap: 'var(--space-md)',

  marginBlock: 'var(--space-lg)',
});
