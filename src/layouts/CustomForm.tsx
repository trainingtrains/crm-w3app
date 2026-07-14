import { useCallback, useEffect } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

import { Box } from '@mui/material';

import { FormField } from './FormField';
import type { FormField as Field } from './types/form';

import { ActionContainer } from '../atoms/ActionContainer';
import { PrimaryButton } from '../atoms/PrimaryButton';
import { SecondaryButton } from '../atoms/SecondaryButton';
import { ResetButton as WarningButton } from '../atoms/ResetButton';

export type FormValues = Record<string, unknown>;

export interface FormProps {
  config: Field[];
  onSubmit: SubmitHandler<FormValues>;
  submitLabel?: string;
  defaultValues?: FormValues;
  onCancel?: () => void;
}

const CustomForm = ({
  config,
  onSubmit,
  submitLabel = 'Search',
  defaultValues,
  onCancel,
}: FormProps) => {
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
    if (onCancel) {
      onCancel();
    } else {
      navigate(-1);
    }
  }, [defaultValues, navigate, reset, onCancel]);

  const handleReset = useCallback(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

  const handleClear = useCallback(() => {
    reset({});
    onSubmit({});
  }, [onSubmit, reset]);

  return (
    <Box component="form" noValidate onSubmit={handleSubmit(onSubmit)}>
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 2,
        }}
      >
        {config.map((field) => {
          const span = field.grid ?? 6;

          return (
            <Box
              key={field.name}
              sx={{
                boxSizing: 'border-box',
                flex: {
                  xs: '1 1 100%',
                  sm: `1 1 calc(${(span / 12) * 100}% - 8px)`,
                },
                maxWidth: {
                  xs: '100%',
                  sm: `calc(${(span / 12) * 100}% - 8px)`,
                },
                minWidth: 250,
              }}
            >
              <FormField field={field} register={register} control={control} errors={errors} />
            </Box>
          );
        })}
      </Box>

      <ActionContainer>
        {['Save', 'Update'].includes(submitLabel) && (
          <>
            <SecondaryButton type="button" variant="outlined" onClick={handleCancel}>
              Cancel
            </SecondaryButton>

            <WarningButton type="button" variant="outlined" onClick={handleReset}>
              Reset
            </WarningButton>
          </>
        )}

        {submitLabel === 'Search' && (
          <SecondaryButton type="button" variant="outlined" onClick={handleClear}>
            Clear
          </SecondaryButton>
        )}

        <PrimaryButton type="submit" variant="contained">
          {submitLabel}
        </PrimaryButton>
      </ActionContainer>
    </Box>
  );
};

export default CustomForm;
