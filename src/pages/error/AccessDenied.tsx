import { Box, Typography, Button, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import BlockRoundedIcon from '@mui/icons-material/BlockRounded';
import { useLanguage } from '../../context/LanguageContext';

export default function AccessDenied() {
  const navigate = useNavigate();
  const { t } = useLanguage();

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        backgroundColor: 'var(--background, #f8fafc)',
        p: 3,
      }}
    >
      <Paper
        elevation={0}
        sx={{
          p: 5,
          textAlign: 'center',
          maxWidth: 480,
          border: '1px solid var(--border, #e2e8f0)',
          borderRadius: 'var(--radius-lg, 12px)',
          backgroundColor: 'var(--surface, #ffffff)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 3,
        }}
      >
        <BlockRoundedIcon color="error" sx={{ fontSize: 64 }} />
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 1, color: 'text.primary' }}>
            {t('accessDenied', 'Access Denied')}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {t(
              'accessDeniedMessage',
              'You do not have the required permissions to view this module. If you believe this is an error, please contact your administrator.'
            )}
          </Typography>
        </Box>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate('/dashboard')}
          sx={{ fontWeight: 'bold', mt: 1 }}
        >
          {t('backToDashboard', 'Back to Dashboard')}
        </Button>
      </Paper>
    </Box>
  );
}
