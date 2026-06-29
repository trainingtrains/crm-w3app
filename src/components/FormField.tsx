import MenuItem from "@mui/material/MenuItem";
import {
  Controller,
  type Control,
  type FieldErrors,
  type FieldValues,
  type UseFormRegister,
} from "react-hook-form";
import type { Field } from "./types/form";
import { StyledAutocomplete } from "../atoms/StyledAutoComplete";
import { StyledCheckbox } from "../atoms/StyledCheckbox";
import { StyledFormControlLabel } from "../atoms/StyledFormControlLabel";
import { StyledSwitch } from "../atoms/StyledSwitch";
import { StyledTextField } from "../atoms/StyledTextField";

type FormFieldProps = {
  field: Field;
  register: UseFormRegister<FieldValues>;
  control: Control<FieldValues>;
  errors?: FieldErrors<FieldValues>;
};

export const FormField = ({
  field,
  register,
  control,
  errors,
}: FormFieldProps) => {
  const { type, label, name } = field;
  const error = errors?.[name];
  const rules = {
    required: field.required ? `${label} is required` : false,
  };

  switch (type) {
    //====================================================
    // TEXT
    //====================================================
    case "text":
    case "email":
    case "number":
    case "password":
    case "textarea":
      return (
        <Controller
          name={name}
          control={control}
          rules={rules}
          render={({ field: rhfField }) => (
            <StyledTextField
              {...rhfField}
              fullWidth
              margin="normal"
              label={label}
              placeholder={field.placeholder}
              multiline={type === "textarea"}
              rows={type === "textarea" ? field.rows ?? 4 : undefined}
              type={type === "textarea" ? "text" : type}
              autoComplete="off"
              error={Boolean(error)}
              helperText={error?.message?.toString()}
              slotProps={{
                inputLabel: {
                  shrink: (rhfField.value !== undefined && rhfField.value !== "") || !!field.placeholder,
                },
              }}
            />
          )}
        />
      );

    //====================================================
    // SELECT
    //====================================================
    case "select":
      return (
        <Controller
          name={name}
          control={control}
          rules={rules}
          render={({ field: rhfField }) => (
            <StyledTextField
              select
              fullWidth
              margin="normal"
              label={label}
              value={rhfField.value ?? ""}
              onChange={rhfField.onChange}
              error={Boolean(error)}
              helperText={error?.message?.toString()}
              slotProps={{
                inputLabel: {
                  shrink: true,
                },
              }}
            >
              {(field.options ?? []).map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </StyledTextField>
          )}
        />
      );

    //====================================================
    // AUTOCOMPLETE
    //====================================================
    case "autocomplete":
      return (
        <Controller
          name={name}
          control={control}
          rules={rules}
          render={({ field: rhfField }) => (
            <StyledAutocomplete
              options={field.options || []}
              value={rhfField.value ?? null}
              onChange={(_, value) => rhfField.onChange(value)}
              getOptionLabel={(option: any) => (option?.label ? option.label : "")}
              isOptionEqualToValue={(option: any, value: any) =>
                option?.value === value?.value
              }
              renderInput={(params) => {
                // FIX: Fallback to empty object if InputLabelProps is undefined to prevent type errors
                const baseInputLabelProps = {};
                
                const updatedInputLabelProps = {
                  ...baseInputLabelProps,
                  shrink: (rhfField.value !== null && rhfField.value !== undefined && rhfField.value !== "") || !!field.placeholder,
                };

                return (
                  <StyledTextField
                    {...params}
                    label={label}
                    placeholder={field.placeholder}
                    error={Boolean(error)}
                    helperText={error?.message?.toString()}
                    {...({ InputLabelProps: updatedInputLabelProps } as any)}
                  />
                );
              }}
            />
          )}
        />
      );

    //====================================================
    // CHECKBOX
    //====================================================
    case "checkbox":
      return (
        <StyledFormControlLabel
          sx={{
            mt: 1,
            mb: 1,
            width: "100%",
          }}
          control={<StyledCheckbox {...register(name, rules)} />}
          label={label}
        />
      );

    //====================================================
    // SWITCH
    //====================================================
    case "switch":
      return (
        <StyledFormControlLabel
          sx={{
            mt: 1,
            mb: 1,
            width: "100%",
          }}
          control={<StyledSwitch {...register(name, rules)} />}
          label={label}
        />
      );

    default:
      return null;
  }
};

export default FormField;
