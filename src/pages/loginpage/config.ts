import type { FormField as Field } from '../../layouts/types/form';

export const loginConfig: Field[] = [
  {
    type: 'text',
    name: 'username',
    label: 'username',
    placeholder: 'User Name',
    required: true,
    grid: 6,
  },
  {
    type: 'password',
    name: 'password',
    label: 'Password',
    grid: 6,
    required: true,
  },
];
