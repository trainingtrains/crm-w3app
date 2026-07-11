export type SelectOption = {
  label: string;
  value: string;
};

export type FormField =
  | {
      type: 'text' | 'email' | 'number' | 'password';
      name: string;
      label: string;
      placeholder?: string;
      grid?: number;
      defaultValue?: string;
      required?: boolean;
      disabled?: boolean;
    }
  | {
      type: 'textarea';
      name: string;
      label: string;
      placeholder?: string;
      rows?: number;
      grid?: number;
      required?: boolean;
      disabled?: boolean;
      defaultValue?: string;
    }
  | {
      type: 'select';
      name: string;
      label: string;
      options: SelectOption[];
      grid?: number;
      required?: boolean;
      disabled?: boolean;
      defaultValue?: string;
    }
  | {
      type: 'checkbox' | 'switch';
      name: string;
      label: string;
      grid?: number;
      required?: boolean;
      disabled?: boolean;
      defaultValue?: string;
    }
  | {
      type: 'autocomplete';
      name: string;
      label: string;
      options: SelectOption[];
      grid?: number;
      placeholder?: string;
      required?: boolean;
      disabled?: boolean;
      defaultValue?: string;
    };
