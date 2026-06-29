// components/DetailsView.tsx

import { Card, CardContent, Grid } from '@mui/material';
import { ActionContainer } from '../atoms/ActionContainer';
import { ResetButton } from '../atoms/ResetButton';
import { SearchButton } from '../atoms/SearchButton';
import { useNavigate } from 'react-router-dom';
import { StyledTextField } from '../atoms/StyledTextField';
import { NegativeButton } from '../atoms/NegativeButton';

export interface DetailsField {
  name: string;
  label: string;
  grid?: number;
  render?: (value: any, data: any) => React.ReactNode;
}

interface DetailsViewProps {
  config: DetailsField[];
  data: Record<string, any>;
  negativeLabel?: string;
  actionLabel?: string;
  onActionClick?: () => void;
  onhandleNegativeClick?: () => void;
}

const DetailsView = ({
  config,
  data,
  actionLabel,
  onActionClick,
  negativeLabel,
  onhandleNegativeClick,
}: DetailsViewProps) => {
  const navigate = useNavigate();
  const handleBackClick = () => {
    navigate(-1);
  };
  return (
    <>
      <ActionContainer>
        <ResetButton variant="outlined" onClick={handleBackClick}>
          Back
        </ResetButton>

        {negativeLabel && (
          <NegativeButton variant="outlined" onClick={onhandleNegativeClick}>
            {negativeLabel}
          </NegativeButton>
        )}

        {actionLabel && (
          <SearchButton variant="outlined" onClick={onActionClick}>
            {actionLabel}
          </SearchButton>
        )}
      </ActionContainer>
      <Card elevation={2}>
        <CardContent>
          <Grid container spacing={2} columns={12}>
            {config.map((field) => (
              <Grid
                key={field.name}
                size={{
                  xs: 12,
                  sm: 6,
                  md: 6,
                  lg: field.grid ?? 3,
                  xl: field.grid ?? 3,
                }}
              >
                <StyledTextField
                  fullWidth
                  label={field.label}
                  value={
                    field.render ? field.render(data[field.name], data) : (data[field.name] ?? '')
                  }
                  slotProps={{
                    input: {
                      readOnly: true,
                    },
                  }}
                />
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>
    </>
  );
};

export default DetailsView;
