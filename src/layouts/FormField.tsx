import MenuItem from '@mui/material/MenuItem';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import AddRoundedIcon from '@mui/icons-material/AddRounded';

import {
  Controller,
  type Control,
  type FieldErrors,
  type FieldValues,
  type UseFormRegister,
} from 'react-hook-form';

import type { FormField as Field } from './types/form';
import { StyledCheckbox } from '../atoms/StyledCheckbox';
import { StyledFormControlLabel } from '../atoms/StyledFormControlLabel';
import { StyledSwitch } from '../atoms/StyledSwitch';
import { StyledTextField } from '../atoms/StyledTextField';
import { StyledAutocomplete } from '../atoms/StyledAutoComplete';
import FormHelperText from '@mui/material/FormHelperText';
import { useLanguage } from '../context/LanguageContext';

type FormFieldProps = {
  field: Field;
  register: UseFormRegister<FieldValues>;
  control: Control<FieldValues>;
  errors?: FieldErrors<FieldValues>;
};

const COMMON_TEXTFIELD_PROPS = {
  fullWidth: true,
  size: 'small' as const,
  autoComplete: 'off',
};

import { usePermission } from '../auth/usePermission';

export const FormField = ({ field, control, errors }: FormFieldProps) => {
  const {
    type,
    label: mlabel,
    name,
    rules = {},
    isNumeric = false,
    fixedLength,
    disabled,
    placeholder: mplaceholder,
  } = field;
  const error = errors?.[name];
  const { t } = useLanguage();
  const { isReadOnly } = usePermission();

  const helperText = error?.message?.toString();

  const translatedLabel = t(name, mlabel);
  const label = rules?.required ? `${translatedLabel}*` : translatedLabel;
  const placeholder = mplaceholder ? t(mplaceholder) : undefined;
  const isDisabled = disabled || isReadOnly;

  switch (type) {
    //====================================================
    // TEXT
    //====================================================

    case 'text':
    case 'email':
    case 'number':
    case 'password':
    case 'textarea':
    case 'date':
      return (
        <Controller
          name={name}
          control={control}
          rules={rules}
          render={({ field, fieldState: { error } }) => (
            <StyledTextField
              {...COMMON_TEXTFIELD_PROPS}
              {...field}
              placeholder={placeholder}
              type={type}
              disabled={isDisabled}
              value={field.value ?? ''}
              label={label}
              error={!!error}
              onChange={(e) => {
                let value = e.target.value;

                if (isNumeric) {
                  value = value.replace(/\D/g, '');
                }

                field.onChange(value);
              }}
              helperText={error?.message ?? helperText}
              slotProps={{
                htmlInput: {
                  ref: field.ref,
                  pattern: isNumeric ? '[0-9]*' : undefined,
                  maxLength: fixedLength,
                },
                inputLabel: {
                  shrink: type === 'date' ? true : undefined,
                },
              }}
            />
          )}
        />
      );
    //====================================================
    // SELECT
    //====================================================

    case 'select':
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
              value={rhfField.value ?? ''}
              select
              disabled={isDisabled}
              label={label}
              error={Boolean(error)}
              helperText={helperText}
              slotProps={{
                select: {
                  sx: {
                    display: 'flex',
                    alignItems: 'center',
                    height: '100%', // <-- makes the select box fill its parent, so centering has room to act
                    boxSizing: 'border-box',
                    py: 0, // kill any vertical padding fighting the centering
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

    case 'autocomplete': {
      const onAddCity = (field as any).onAddCity;
      const inputField = (
        <Controller
          name={name}
          control={control}
          rules={rules}
          render={({ field: { onChange, value, ref }, fieldState: { error } }) => {
            const options = field.options ?? [];
            const valueId = value && typeof value === 'object' ? (value as any).value : value;
            const selectedOption =
              options.find((opt) => String(opt.value) === String(valueId)) || null;

            return (
              <StyledAutocomplete
                options={options}
                getOptionLabel={(option: any) => option.label || ''}
                value={selectedOption}
                isOptionEqualToValue={(option: any, val: any) =>
                  String(option.value) === String(val.value)
                }
                onChange={(_, newValue: any) => {
                  onChange(newValue ? newValue.value : '');
                }}
                disabled={isDisabled}
                renderInput={(params) => (
                  <StyledTextField
                    {...params}
                    {...COMMON_TEXTFIELD_PROPS}
                    placeholder={placeholder}
                    label={label}
                    error={!!error}
                    helperText={error?.message ?? helperText}
                    slotProps={{
                      ...params.slotProps,
                      htmlInput: {
                        ...(params as any).inputProps,
                        ref,
                      },
                    }}
                  />
                )}
              />
            );
          }}
        />
      );

      if (onAddCity) {
        return (
          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
            <Box sx={{ flex: 1 }}>{inputField}</Box>
            <IconButton
              color="primary"
              onClick={onAddCity}
              disabled={isDisabled}
              sx={{
                mt: 0.5,
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-sm)',
                height: 40,
                width: 40,
              }}
              title="Add New City"
            >
              <AddRoundedIcon fontSize="small" />
            </IconButton>
          </Box>
        );
      }
      return inputField;
    }
    //====================================================
    // CHECKBOX
    //====================================================

    case 'checkbox':
      return (
        <Controller
          name={name}
          control={control}
          rules={rules}
          render={({ field, fieldState: { error } }) => (
            <>
              <StyledFormControlLabel
                control={
                  <StyledCheckbox
                    checked={!!field.value}
                    onChange={(e) => field.onChange(e.target.checked)}
                    onBlur={field.onBlur}
                    disabled={isDisabled}
                  />
                }
                label={label}
              />
              {error && <FormHelperText error>{error.message}</FormHelperText>}
            </>
          )}
        />
      );
    //====================================================
    // SWITCH
    //====================================================
    case 'switch':
      return (
        <Controller
          name={name}
          control={control}
          rules={rules}
          render={({ field, fieldState: { error } }) => (
            <>
              <StyledFormControlLabel
                control={
                  <StyledSwitch
                    checked={!!field.value}
                    onChange={(e) => field.onChange(e.target.checked)}
                    onBlur={field.onBlur}
                    disabled={isDisabled}
                  />
                }
                label={label}
              />
              {error && <FormHelperText error>{error.message}</FormHelperText>}
            </>
          )}
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
