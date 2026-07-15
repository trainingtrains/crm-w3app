export type SelectOption = {
  label: string;
  value: string;
};

export type FormFieldBase = {
  name: string;
  label: string;
  grid?: number;
  placeholder?: string;
  rules?: Record<string, any>;
  disabled?: boolean;
  defaultValue?: any;
  isNumeric?: boolean;
  fixedLength?: number;
};

export type FormField =
  | (FormFieldBase & {
      type: 'text' | 'email' | 'number' | 'password' | 'date';
    })
  | (FormFieldBase & {
      type: 'textarea';
      rows?: number;
    })
  | (FormFieldBase & {
      type: 'select';
      options: SelectOption[];
    })
  | (FormFieldBase & {
      type: 'checkbox' | 'switch';
    })
  | (FormFieldBase & {
      type: 'autocomplete';
      options: SelectOption[];
    });
