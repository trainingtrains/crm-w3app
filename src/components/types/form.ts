export type SelectOption = {
  label: string;
  value: string;
};

export type Field =
  | {
      type: 'text' | 'email' | 'number' | 'password';
      name: string;
      label: string;
      placeholder?: string;
      grid?: number;
      required?:boolean;
    }
  | {
      type: 'textarea';
      name: string;
      label: string;
      placeholder?: string;
      rows?: number;
      grid?: number;
      required?:boolean;
    }
  | {
      type: 'select';
      name: string;
      label: string;
      options: SelectOption[];
      grid?: number;
      required?:boolean;
    }
  | {
      type: 'checkbox' | 'switch';
      name: string;
      label: string;
      grid?: number;
      required?:boolean;
    };
