import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';

interface DateRangeFieldProps {
  from?: string;
  to?: string;
  onFromChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onToChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  fromLabel?: string;
  toLabel?: string;
}

export const DateRangeField = ({
  from,
  to,
  onFromChange,
  onToChange,
  fromLabel = 'From',
  toLabel = 'To',
}: DateRangeFieldProps) => (
  <Box
    sx={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(var(--field-min-width), 1fr))',
      gap: 'var(--space-md)',
      width: '100%',
    }}
  >
    <TextField
      type="date"
      label={fromLabel}
      size="small"
      fullWidth
      value={from ?? ''}
      onChange={onFromChange}
      slotProps={{ inputLabel: { shrink: true } }}
    />

    <TextField
      type="date"
      label={toLabel}
      size="small"
      fullWidth
      value={to ?? ''}
      onChange={onToChange}
      slotProps={{ inputLabel: { shrink: true } }}
    />
  </Box>
);
