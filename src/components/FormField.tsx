import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";

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

const COMMON_TEXTFIELD_PROPS = {
  fullWidth: true,
  size: "small" as const,
  autoComplete: "off",
};

export const FormField = ({
  field,
  register,
  control,
  errors,
}: FormFieldProps) => {
  const { type, label, name } = field;

  const error = errors?.[name];

  const helperText = error?.message?.toString();

  const rules = {
    required: field.required
      ? `${label} is required`
      : false,
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
          render={({ field: rhfField }) => {
            const isTextarea = type === "textarea";

            return (
              <StyledTextField
                {...COMMON_TEXTFIELD_PROPS}
                name={rhfField.name}
                onBlur={rhfField.onBlur}
                onChange={rhfField.onChange}
                value={rhfField.value ?? ""}
                label={label}
                placeholder={field.placeholder}
                multiline={isTextarea}
                rows={isTextarea ? field.rows ?? 4 : undefined}
                // Don't pass `type` at all when multiline — MUI renders a <textarea>
                // and warns if `type` is set alongside `multiline`.
                type={isTextarea ? undefined : type}
                error={Boolean(error)}
                helperText={helperText}
                slotProps={{
                  htmlInput: {
                    ref: rhfField.ref, // attaches to the real <input> or <textarea> node
                  },
                  inputLabel: {
                    shrink: !!rhfField.value || !!field.placeholder,
                  },
                }}
              />
            );
          }}
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
              {...COMMON_TEXTFIELD_PROPS}
              name={rhfField.name}
              onBlur={rhfField.onBlur}
              onChange={rhfField.onChange}
              value={rhfField.value ?? ""}
              select
              label={label}
              error={Boolean(error)}
              helperText={helperText}
              slotProps={{
                select: {
                  sx: {
                    display: "flex",
                    alignItems: "center",
                    height: "100%",       // <-- makes the select box fill its parent, so centering has room to act
                    boxSizing: "border-box",
                    py: 0,                 // kill any vertical padding fighting the centering
                  },
                  ref: rhfField.ref,
                },
                inputLabel: {
                  shrink: true,
                },
              }}
            >
              {(field.options ?? []).map((option) => (
                <MenuItem key={String(option.value)} value={option.value}>
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
              options={field.options ?? []}
              value={rhfField.value ?? null}
              onChange={(_, value) => rhfField.onChange(value)}
              getOptionLabel={(option) => (option as any)?.label ?? ""}
              isOptionEqualToValue={(option, value) =>
                (option as any)?.value === (value as any)?.value
              }
              renderInput={(params) => {
                // v9: params.InputProps is gone — everything lives under params.slotProps
                const { slotProps, ...restParams } = params;

                return (
                  <TextField
                    {...restParams}
                    {...COMMON_TEXTFIELD_PROPS}
                    label={label}
                    placeholder={field.placeholder}
                    error={Boolean(error)}
                    helperText={helperText}
                    slotProps={{
                      ...slotProps,
                      // input slot = old InputProps (adornments, anchor tracking, etc.)
                      input: {
                        ...slotProps?.input,
                      },
                      // htmlInput slot = old inputProps, this is where the real <input> ref lives
                      htmlInput: {
                        ...slotProps?.htmlInput,
                        ref: (node: HTMLInputElement | null) => {
                          // 1. Preserve MUI's own ref on the native input (needed for the listbox anchor)
                          const muiRef = slotProps?.htmlInput?.ref;
                          if (typeof muiRef === "function") {
                            muiRef(node);
                          } else if (muiRef) {
                            (muiRef as React.MutableRefObject<HTMLInputElement | null>).current = node;
                          }
                          // 2. Register the same node with React Hook Form
                          rhfField.ref(node);
                        },
                      },
                      inputLabel: {
                        ...slotProps?.inputLabel,
                        shrink: !!rhfField.value || !!field.placeholder,
                      },
                    }}
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
          control={
            <StyledCheckbox
              {...register(name, rules)}
            />
          }
          label={label}
        />
      );

    //====================================================
    // SWITCH
    //====================================================

    case "switch":
      return (
        <StyledFormControlLabel
          control={
            <StyledSwitch
              {...register(name, rules)}
            />
          }
          label={label}
        />
      );

    //====================================================
    // DEFAULT
    //====================================================

    default:
      return null;
  }
};

export default FormField;