import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';

import type { ReactNode } from 'react';

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
      {items.map((item) => (
        <Grid
          key={item.label}
          size={{
            xs: 12,
            sm: 6,
            md: 4,
          }}
        >
          <Paper
            elevation={1}
            sx={{
              p: 3,
              borderRadius: 3,
              height: '100%',
            }}
          >
            {item.icon}

            <Typography
              component="div"
              variant="h4"
              sx={{
                fontWeight: 700,
                mt: 1,
              }}
            >
              {item.value}
            </Typography>

            <Typography component="p" color="text.secondary">
              {item.label}
            </Typography>
          </Paper>
        </Grid>
      ))}
    </Grid>
  );
};

export default StatsSection;
