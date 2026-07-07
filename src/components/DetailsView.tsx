import { useCallback } from "react";
import { useNavigate } from "react-router-dom";

import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";

import { ActionContainer } from "../atoms/ActionContainer";
import { FormContainer } from "../atoms/FormContainer";

import { SecondaryButton } from "../atoms/SecondaryButton";
import { NegativeButton } from "../atoms/NegativeButton";
import { PrimaryButton } from "../atoms/PrimaryButton";

export interface DetailsField {
  name: string;
  label: string;
  grid?: number;
  render?: (value: unknown, data: Record<string, unknown>) => React.ReactNode;
}

export interface DetailsViewProps {
  config: DetailsField[];
  data: Record<string, unknown>;

  negativeLabel?: string;
  actionLabel?: string;

  onActionClick?: () => void;
  onNegativeClick?: () => void;
}

const DetailsView = ({
  config,
  data,
  actionLabel,
  onActionClick,
  negativeLabel,
  onNegativeClick,
}: DetailsViewProps) => {
  const navigate = useNavigate();

  const handleBack = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  return (
    <>
      <ActionContainer>
        <SecondaryButton
          type="button"
          variant="outlined"
          onClick={handleBack}
        >
          Back
        </SecondaryButton>

        {negativeLabel && (
          <NegativeButton
            type="button"
            variant="outlined"
            onClick={onNegativeClick}
          >
            {negativeLabel}
          </NegativeButton>
        )}

        {actionLabel && (
          <PrimaryButton
            type="button"
            variant="contained"
            onClick={onActionClick}
          >
            {actionLabel}
          </PrimaryButton>
        )}
      </ActionContainer>

      <FormContainer>
        <Grid container spacing={2}>
          {config.map((field) => (
            <Grid
              key={field.name}
              size={{
                xs: 12,
                sm: 6,
                md: field.grid ?? 4,
                lg: field.grid ?? 3,
                xl: field.grid ?? 3,
              }}
            >
              <TextField
                fullWidth
                size="small"
                label={field.label}
                value={
                  field.render
                    ? field.render(data[field.name], data)
                    : String(data[field.name] ?? "")
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
      </FormContainer>
    </>
  );
};

export default DetailsView;