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
      rules?: Record<string, any>;
      disabled?: boolean;
      isNumeric?: boolean;
      fixedLength?: number;
    }
  | {
      type: 'textarea';
      name: string;
      label: string;
      placeholder?: string;
      rows?: number;
      grid?: number;
      disabled?: boolean;
      rules?: Record<string, any>;
      defaultValue?: string;
      isNumeric?: boolean;
      fixedLength?: number;
    }
  | {
      type: 'select';
      name: string;
      label: string;
      options: SelectOption[];
      grid?: number;
      rules?: Record<string, any>;
      disabled?: boolean;
      defaultValue?: string;
      isNumeric?: boolean;
      fixedLength?: number;
    }
  | {
      type: 'checkbox' | 'switch';
      name: string;
      label: string;
      grid?: number;
      rules?: Record<string, any>;
      disabled?: boolean;
      defaultValue?: string;
      isNumeric?: boolean;
      fixedLength?: number;
    }
  | {
      type: 'autocomplete';
      name: string;
      label: string;
      options: SelectOption[];
      grid?: number;
      placeholder?: string;
      rules?: Record<string, any>;
      disabled?: boolean;
      defaultValue?: string;
      isNumeric?: boolean;
      fixedLength?: number;
    };
