import type { ReactNode } from 'react';

import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

export interface StatItem {
  label: string;
  value: string | number;
  icon: ReactNode;
}

interface StatsSectionProps {
  items: StatItem[];
}

const StatsSection = ({ items }: StatsSectionProps) => {
  return (
    <Grid container spacing={2}>
      {items.map(({ label, value, icon }) => (
        <Grid
          key={label}
          size={{
            xs: 12,
            sm: 6,
            md: 4,
            lg: 3,
          }}
        >
          <Paper
            elevation={0}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-md)',

              p: 'var(--space-lg)',

              height: '100%',

              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-md)',

              backgroundColor: 'var(--surface)',
            }}
          >
            <Box>{icon}</Box>

            <Box sx={{ flex: 1 }}>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 'var(--font-weight-bold)',
                  lineHeight: 1.2,
                }}
              >
                {value}
              </Typography>

              <Typography
                variant="body2"
                sx={{
                  color: 'var(--text-secondary)',
                  mt: '2px',
                }}
              >
                {label}
              </Typography>
            </Box>
          </Paper>
        </Grid>
      ))}
    </Grid>
  );
};

export default StatsSection;
