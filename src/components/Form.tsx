import {
  useForm,
  type SubmitHandler,
} from "react-hook-form";

import Grid from "@mui/material/Grid";

import { FormField } from "./FormField";
import type { Field } from "./types/form";

import {
  ActionContainer,
  SearchButton,
  ResetButton,
} from "../atoms/form.components";

type FormValues = Record<
  string,
  unknown
>;

type FormProps = {
  config: Field[];
  onSubmit: SubmitHandler<FormValues>;
};

export const Form = ({
  config,
  onSubmit,
}: FormProps) => {
  const {
    register,
    handleSubmit,
    reset,
  } = useForm<FormValues>();

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
    >
      <Grid
        container
        spacing={2}
        columns={12}
      >
        {config.map((field) => (
          <Grid
            key={field.name}
            size={{
              xs: 6,
              sm: 6,
              md: 3,
              lg: 3,
              xl: 3,
            }}
          >
            <FormField
              field={field}
              register={register}
            />
          </Grid>
        ))}
      </Grid>

      <ActionContainer>
        <ResetButton
          variant="outlined"
          onClick={() => reset()}
        >
          Reset
        </ResetButton>

        <SearchButton
          variant="contained"
          type="submit"
        >
          Search
        </SearchButton>
      </ActionContainer>
    </form>
  );
};

export default Form;