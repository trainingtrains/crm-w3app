import { useForm, type SubmitHandler } from 'react-hook-form';
import { NegativeButton } from '../atoms/NegativeButton';
import { useNavigate } from 'react-router-dom';

import Grid from '@mui/material/Grid';

import { FormField } from './FormField';
import type { Field } from './types/form';
import { ActionContainer } from '../atoms/ActionContainer';
import { ResetButton } from '../atoms/ResetButton';
import { SearchButton } from '../atoms/SearchButton';

type FormValues = Record<string, unknown>;

type FormProps = {
  config: Field[];
  onSubmit: SubmitHandler<FormValues>;
  submitLabel?: string
};

export const Form = ({ config, onSubmit, submitLabel }: FormProps) => {
  const { register, handleSubmit, reset } = useForm<FormValues>();
  const navigate = useNavigate();

  const onCancel = () => {
    reset();
    navigate(-1);
  }

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
            <FormField field={field} register={register} />
          </Grid>
        ))}
      </Grid>

      <ActionContainer>
        {submitLabel && <NegativeButton variant="outlined" onClick={onCancel}>
          Cancel
        </NegativeButton>}

        <ResetButton variant="outlined" onClick={() => reset()}>
          Reset
        </ResetButton>

        <SearchButton variant="outlined" type="submit">
          {submitLabel ?? "Search"}
        </SearchButton>
      </ActionContainer>
    </form>
  );
};

export default Form;
