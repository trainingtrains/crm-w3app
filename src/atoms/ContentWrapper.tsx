import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';

export const ContentWrapper = styled(Box)({
  width: '100%',
  flex: 1,

  display: 'flex',
  flexDirection: 'column',

  gap: 'var(--space-md)',

  padding: 'var(--content-padding)',

  overflow: 'auto',
});
