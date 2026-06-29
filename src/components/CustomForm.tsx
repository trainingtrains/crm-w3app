import { useEffect } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import Grid from "@mui/material/Grid";

import { FormField } from "./FormField";
import type { Field } from "./types/form";

import { ActionContainer } from "../atoms/ActionContainer";
import { NegativeButton } from "../atoms/NegativeButton";
import { ResetButton } from "../atoms/ResetButton";
import { SearchButton } from "../atoms/SearchButton";

export type FormValues = Record<string, any>;

export type FormProps = {
  config: Field[];
  onSubmit: SubmitHandler<FormValues>;
  submitLabel?: string;
  defaultValues?: FormValues;
};

const Form = ({
  config,
  onSubmit,
  submitLabel,
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

  // Update form when default values change (e.g., after API/Firebase fetch)
  useEffect(() => {
    if (defaultValues) {
      reset(defaultValues);
    }
  }, [defaultValues, reset]);

  const onCancel = () => {
    reset(defaultValues);
    navigate(-1);
  };

  const onReset = () => {
    reset(defaultValues);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
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
            <FormField
              field={field}
              register={register}
              control={control}
              errors={errors}
            />
          </Grid>
        ))}
      </Grid>

      <ActionContainer>
        {submitLabel && (
          <NegativeButton variant="outlined" onClick={onCancel}>
            Cancel
          </NegativeButton>
        )}

        <ResetButton variant="outlined" onClick={onReset}>
          Reset
        </ResetButton>

        <SearchButton variant="contained" type="submit">
          {submitLabel ?? "Search"}
        </SearchButton>
      </ActionContainer>
    </form>
  );
};

export default Form;