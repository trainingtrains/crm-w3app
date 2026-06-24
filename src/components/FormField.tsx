import MenuItem from '@mui/material/MenuItem';
import {
  Controller,
  type Control,
  type FieldErrors,
  type FieldValues,
  type UseFormRegister,
} from 'react-hook-form';

import type { Field } from './types/form';
import { StyledCheckbox } from '../atoms/StyledCheckbox';
import { StyledFormControlLabel } from '../atoms/StyledFormControlLabel';
import { StyledSwitch } from '../atoms/StyledSwitch';
import { StyledTextField } from '../atoms/StyledTextField';
import { StyledAutocomplete } from '../atoms/StyledAutoComplete';

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
  const {
    type,
    label,
    name,
    ...rest
  } = field;

  const error = errors?.[name];

  const registerOptions = {
    required: field.required ? `${label} is required` : false,
  };

  switch (type) {
    case 'text':
    case 'email':
    case 'number':
    case 'password':
      return (
        <StyledTextField
          fullWidth
          margin="normal"
          label={label}
          type={type}
          placeholder={field.placeholder}
          variant="outlined"
          autoComplete="off"
          error={Boolean(error)}
          helperText={error?.message?.toString()}
          {...register(name, registerOptions)}
          {...rest}
        />
      );

    case 'textarea':
      return (
        <StyledTextField
          fullWidth
          multiline
          rows={field.rows ?? 4}
          margin="normal"
          label={label}
          placeholder={field.placeholder}
          variant="outlined"
          autoComplete="off"
          error={Boolean(error)}
          helperText={error?.message?.toString()}
          {...register(name, registerOptions)}
          {...rest}
        />
      );

    case 'select':
      return (
        <StyledTextField
          select
          fullWidth
          margin="normal"
          label={label}
          defaultValue=""
          variant="outlined"
          error={Boolean(error)}
          helperText={error?.message?.toString()}
          {...register(name, registerOptions)}
          {...rest}
        >
          {(field.options ?? []).map((option) => (
            <MenuItem
              key={option.value}
              value={option.value}
            >
              {option.label}
            </MenuItem>
          ))}
        </StyledTextField>
      );

    case 'autocomplete':
      return (
        <Controller
          name={name}
          control={control}
          rules={registerOptions}
          defaultValue=""
          render={({ field: rhfField }) => (
            <StyledAutocomplete
              freeSolo
              options={field.options || []}
              value={rhfField.value || ''}
              getOptionLabel={(option: any) =>
                typeof option === 'string'
                  ? option
                  : option?.label || ''
              }
              isOptionEqualToValue={(option: any, value: any) =>
                option?.value === value?.value
              }
              onInputChange={(_, value) => {
                rhfField.onChange(value);
              }}
              onChange={(_, value:any) => {
                rhfField.onChange(
                  typeof value === 'string'
                    ? value
                    : value?.label || ''
                );
              }}
              renderInput={(params) => (
                <StyledTextField
                  {...params}
                  label={label}
                  placeholder={field.placeholder}
                  error={Boolean(error)}
                  helperText={error?.message?.toString()}
                />
              )}
              {...rest}
            />
          )}
        />
      );

    case 'checkbox':
      return (
        <StyledFormControlLabel
          sx={{
            mt: 1,
            mb: 1,
            width: '100%',
          }}
          control={
            <StyledCheckbox
              {...register(name, registerOptions)}
              {...rest}
            />
          }
          label={label}
        />
      );

    case 'switch':
      return (
        <StyledFormControlLabel
          sx={{
            mt: 1,
            mb: 1,
            width: '100%',
          }}
          control={
            <StyledSwitch
              {...register(name, registerOptions)}
              {...rest}
            />
          }
          label={label}
        />
      );

    default:
      return null;
  }
};

export default FormField;