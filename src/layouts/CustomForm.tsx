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
}

const CustomForm = ({
  config,
  onSubmit,
  submitLabel = 'Search',
  defaultValues,
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
    navigate(-1);
  }, [defaultValues, navigate, reset]);

  const handleReset = useCallback(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

  return (
    <Box
      component="form"
      noValidate
      onSubmit={handleSubmit(onSubmit)}
    >
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
              <FormField
                field={field}
                register={register}
                control={control}
                errors={errors}
              />
            </Box>
          );
        })}
      </Box>

      <ActionContainer>
        {submitLabel === 'Save' && (
          <>
            <SecondaryButton
              type="button"
              variant="outlined"
              onClick={handleCancel}
            >
              Cancel
            </SecondaryButton>

            <WarningButton
              type="button"
              variant="outlined"
              onClick={handleReset}
            >
              Reset
            </WarningButton>
          </>
        )}

        <PrimaryButton
          type="submit"
          variant="contained"
        >
          {submitLabel}
        </PrimaryButton>
      </ActionContainer>
    </Box>
  );
};

export default CustomForm;