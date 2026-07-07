import { useCallback, useEffect } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

import Grid from '@mui/material/Grid';

import { FormField } from './FormField';
import type { Field } from './types/form';

import { ActionContainer } from '../atoms/ActionContainer';
import { SecondaryButton } from '../atoms/SecondaryButton';
import { ResetButton as WarningButton } from '../atoms/ResetButton';
import { PrimaryButton } from '../atoms/PrimaryButton';

export type FormValues = Record<string, unknown>;

export interface FormProps {
  config: Field[];
  onSubmit: SubmitHandler<FormValues>;
  submitLabel?: string;
  defaultValues?: FormValues;
}

const Form = ({ config, onSubmit, submitLabel = 'Search', defaultValues }: FormProps) => {
  const navigate = useNavigate();

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues,
  });

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

  const handleCancel = useCallback(() => {
    reset(defaultValues);
    navigate(-1);
  }, [defaultValues, navigate, reset]);

  const handleReset = useCallback(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

  return (
    <form noValidate onSubmit={handleSubmit(onSubmit)}>
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
            <FormField field={field} register={register} control={control} errors={errors} />
          </Grid>
        ))}
      </Grid>

      <ActionContainer>
        {submitLabel !== 'Search' && (
          <SecondaryButton type="button" variant="outlined" onClick={handleCancel}>
            Cancel
          </SecondaryButton>
        )}

        <WarningButton type="button" variant="outlined" onClick={handleReset}>
          Reset
        </WarningButton>

        <PrimaryButton type="submit" variant="contained">
          {submitLabel}
        </PrimaryButton>
      </ActionContainer>
    </form>
  );
};

export default Form;
