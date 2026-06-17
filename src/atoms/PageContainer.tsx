import Box from '@mui/material/Box';
import type { ReactNode } from 'react';

interface PageContainerProps {
  children: ReactNode;
}

const PageContainer = ({ children }: PageContainerProps) => {
  return (
    <Box
      sx={{
        width: '100%',
        maxWidth: '1800px',
        mx: 'auto',
        m: {
          xs: 2,
          sm: 3,
          md: 4,
        },
      }}
    >
      {children}
    </Box>
  );
};

export default PageContainer;
