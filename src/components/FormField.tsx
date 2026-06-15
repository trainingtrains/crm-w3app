import MenuItem from "@mui/material/MenuItem";

import type {
  UseFormRegister,
  FieldValues,
} from "react-hook-form";

import type { Field } from "./types/form";

import {
  StyledTextField,
  StyledCheckbox,
  StyledSwitch,
  StyledFormControlLabel,
} from "../atoms/form.components";

type FormFieldProps = {
  field: Field;
  register: UseFormRegister<FieldValues>;
};

export const FormField = ({
  field,
  register,
}: FormFieldProps) => {
  switch (field.type) {
    case "text":
    case "email":
    case "number":
    case "password":
      return (
        <StyledTextField
          fullWidth
          margin="normal"
          label={field.label}
          type={field.type}
          placeholder={field.placeholder}
          variant="outlined"
          {...register(field.name)}
        />
      );

    case "textarea":
      return (
        <StyledTextField
          fullWidth
          multiline
          rows={field.rows ?? 4}
          margin="normal"
          label={field.label}
          placeholder={field.placeholder}
          variant="outlined"
          {...register(field.name)}
        />
      );

    case "select":
      return (
        <StyledTextField
          select
          fullWidth
          margin="normal"
          label={field.label}
          defaultValue=""
          variant="outlined"
          {...register(field.name)}
        >
          {(field.options ?? []).map(
            (option) => (
              <MenuItem
                key={option.value}
                value={option.value}
              >
                {option.label}
              </MenuItem>
            )
          )}
        </StyledTextField>
      );

    case "checkbox":
      return (
        <StyledFormControlLabel
          sx={{
            mt: 1,
            mb: 1,
            width: "100%",
          }}
          control={
            <StyledCheckbox
              {...register(field.name)}
            />
          }
          label={field.label}
        />
      );

    case "switch":
      return (
        <StyledFormControlLabel
          sx={{
            mt: 1,
            mb: 1,
            width: "100%",
          }}
          control={
            <StyledSwitch
              {...register(field.name)}
            />
          }
          label={field.label}
        />
      );

    default:
      return null;
  }
};

export default FormField;