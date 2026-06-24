import { Card } from '@mui/material';
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
        mx: 'auto',
        my: 2
      }}
    >
      <Card sx={{ p: 2 }}>
        {children}
      </Card>
    </Box>
  );
};

export default PageContainer;
