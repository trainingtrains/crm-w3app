import MenuItem from '@mui/material/MenuItem';
import type {
  FieldErrors,
  FieldValues,
  UseFormRegister,
} from 'react-hook-form';

import type { Field } from './types/form';
import { StyledCheckbox } from '../atoms/StyledCheckbox';
import { StyledFormControlLabel } from '../atoms/StyledFormControlLabel';
import { StyledSwitch } from '../atoms/StyledSwitch';
import { StyledTextField } from '../atoms/StyledTextField';

type FormFieldProps = {
  field: Field;
  register: UseFormRegister<FieldValues>;
  errors?: FieldErrors<FieldValues>;
};

export const FormField = ({
  field,
  register,
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
          autoComplete="new-password"
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
          autoComplete="new-password"
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