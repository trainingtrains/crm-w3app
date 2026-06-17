/* ==========================================================
   DATE RANGE FIELD
========================================================== */

import { alpha, styled } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';

export const StyledDateField = styled(TextField)(({ theme }) => ({
  width: '100%',

  '& .MuiInputLabel-root': {
    fontWeight: 500,
  },

  '& .MuiOutlinedInput-root': {
    borderRadius: 14,

    backgroundColor: theme.palette.background.paper,

    transition: 'all 0.2s ease-in-out',

    '&:hover': {
      boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
    },

    '&.Mui-focused': {
      boxShadow: `0 0 0 4px ${alpha(theme.palette.primary.main, 0.12)}`,
    },
  },
}));

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
}: DateRangeFieldProps) => {
  return (
    <Stack direction="row" spacing={2}>
      <StyledDateField
        label={fromLabel}
        type="date"
        value={from || ''}
        onChange={onFromChange}
        slotProps={{
          inputLabel: {
            shrink: true,
          },
        }}
      />

      <StyledDateField
        label={toLabel}
        type="date"
        value={to || ''}
        onChange={onToChange}
        slotProps={{
          inputLabel: {
            shrink: true,
          },
        }}
      />
    </Stack>
  );
};
