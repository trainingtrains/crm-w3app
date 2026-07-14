import LinearProgress from '@mui/material/LinearProgress';
import Box from '@mui/material/Box';

import { useLoading } from '../context/LoadingContext';

const GlobalProgress = () => {
  const { loading } = useLoading();

  if (!loading) return null;

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        zIndex: 9999,
      }}
    >
      <LinearProgress />
    </Box>
  );
};

export default GlobalProgress;
