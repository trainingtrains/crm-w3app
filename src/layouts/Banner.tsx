import { Box, Stack, Typography } from '@mui/material';

const LoginBanner = () => {
  return (
    <Box
      sx={{
        display: { xs: 'none', md: 'flex' },
        position: 'relative',
        overflow: 'hidden',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
      }}
    >
      {/* Background */}
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
        }}
      />

      {/* Content */}
      <Stack
        spacing={5}
        sx={{
          position: 'relative',
          width: '75%',
          color: '#fff',
          zIndex: 1,
        }}
      >
        {/* {"Icon"} */}

        <Typography
          variant="h3"
          sx={{
            fontWeight: 800,
            lineHeight: 1.3,
          }}
        >
          Training Trains
        </Typography>

        <Typography
          sx={{
            fontSize: 18,
            opacity: 0.9,
            maxWidth: 500,
          }}
        >
          Customer Relationship Management
        </Typography>
      </Stack>
    </Box>
  );
};

export default LoginBanner;
