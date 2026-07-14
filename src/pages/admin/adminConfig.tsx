import type { FormField } from '../../layouts/types/form';

import type { DetailsField } from '../../layouts/DetailsView';

export const adminSearchConfig: FormField[] = [
  {
    type: 'text',
    name: 'employeeId',
    label: 'Employee ID',
    placeholder: 'Enter Employee Id',
    grid: 3,
  },
  {
    type: 'text',
    name: 'userName',
    label: 'User Name',
    placeholder: 'Enter user name',
    grid: 3,
  },
  {
    type: 'text',
    name: 'mobile',
    label: 'Mobile no',
    placeholder: 'Enter Mobile no',
    grid: 3,
  },
];

export const newUserRegistrationFields: FormField[] = [
  {
    type: 'text',
    name: 'firstName',
    label: 'First Name',
    placeholder: 'Enter first name',
    rules: {
      required: 'required',
      minLength: {
        value: 3,
        message: 'Minimum 5 characters required',
      },
      maxLength: {
        value: 20,
        message: 'Maximum 20 characters allowed',
      },
    },
    grid: 6,
  },
  {
    type: 'text',
    name: 'lastName',
    label: 'Last Name',
    placeholder: 'Enter last name',
    grid: 6,
  },
  {
    type: 'text',
    name: 'userName',
    label: 'Username',
    placeholder: 'Enter username',
    fixedLength: 10,
    rules: {
      required: 'required',
      minLength: {
        value: 5,
        message: 'Minimum 5 characters required',
      },
      maxLength: {
        value: 10,
        message: 'Maximum 10 characters allowed',
      },
    },
    grid: 6,
  },
  {
    type: 'text',
    name: 'employeeId',
    label: 'Employee ID',
    fixedLength: 12,
    rules: {
      required: 'Mandatory field',
    },
    placeholder: 'Enter employee ID',
    grid: 6,
  },

  {
    type: 'number',
    name: 'mobile',
    label: 'Mobile Number',
    placeholder: 'Enter mobile number',
    isNumeric: true,
    fixedLength: 10,
    rules: {
      required: 'Mobile number is required',
      pattern: {
        value: /^[6-9]\d{9}$/,
        message: 'Must be a valid 10-digit mobile number starting with 6-9',
      },
    },
    grid: 6,
  },
  {
    type: 'select',
    name: 'roleId',
    label: 'Role',
    options: [
      { label: 'Master', value: 'master' },
      { label: 'User', value: 'user' },
      { label: 'Guest', value: 'guest' },
    ],
    rules: {
      required: 'required',
    },
    grid: 6,
  },
  {
    type: 'text',
    name: 'email',
    label: 'Email',
    placeholder: 'Enter email address',
    rules: {
      validate: (val: any) => {
        if (!val) return true;
        return (
          /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(val) || 'Invalid email address'
        );
      },
    },
    grid: 6,
  },
  // {
  //     type: 'switch',
  //     name: 'isActive',
  //     label: 'Active',
  //     grid: 6,
  // },
];

export const userDetailsConfig: DetailsField[] = [
  {
    name: 'employeeId',
    label: 'Employee ID',
  },
  {
    name: 'firstName',
    label: 'First Name',
  },
  {
    name: 'lastName',
    label: 'Last Name',
  },
  {
    name: 'userName',
    label: 'Username',
  },
  {
    name: 'email',
    label: 'Email',
  },
  {
    name: 'mobile',
    label: 'Mobile Number',
  },
  {
    name: 'roleId',
    label: 'Role',
  },
  {
    name: 'isActive',
    label: 'Status',
    render: (value) => (value ? 'Active' : 'Inactive'),
  },
];

export interface UserDetailsResponse {
  id: string;
  employeeId: string;
  firstName: string;
  lastName?: string;
  userName: string;
  email?: string;
  mobile: string;
  roleId: string;
  isActive: boolean;
}

export const userEditConfig: FormField[] = [
  {
    type: 'text',
    name: 'employeeId',
    label: 'Employee ID',
    rules: {
      required: 'required',
    },
    grid: 6,
  },
  {
    type: 'text',
    name: 'firstName',
    label: 'First Name',
    rules: {
      required: 'required',
    },
    grid: 6,
  },
  {
    type: 'text',
    name: 'lastName',
    label: 'Last Name',
    grid: 6,
  },
  {
    type: 'text',
    name: 'userName',
    label: 'Username',
    disabled: true,
    grid: 6,
  },
  {
    type: 'text',
    name: 'email',
    label: 'Email',
    rules: {
      pattern: {
        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
        message: 'Invalid email address',
      },
    },
    grid: 6,
  },
  {
    type: 'text',
    name: 'mobile',
    label: 'Mobile Number',
    placeholder: 'Enter mobile number',
    isNumeric: true,
    fixedLength: 10,
    rules: {
      required: 'Mobile number is required',
      pattern: {
        value: /^[6-9]\d{9}$/,
        message: 'Must be a valid 10-digit mobile number starting with 6-9',
      },
    },
    grid: 6,
  },
  {
    type: 'autocomplete',
    name: 'roleId',
    label: 'Role',
    options: [
      { label: 'Master', value: 'master' },
      { label: 'User', value: 'user' },
      { label: 'Guest', value: 'guest' },
    ],
    rules: {
      required: 'required',
    },
    grid: 6,
  },
  {
    type: 'switch',
    name: 'isActive',
    label: 'Active',
    grid: 6,
  },
];

export const profileConfig: FormField[] = [
  {
    type: 'text',
    name: 'employeeId',
    label: 'Employee ID',
    disabled: true,
    grid: 6,
  },
  {
    type: 'text',
    name: 'firstName',
    label: 'First Name',
    disabled: true,
    grid: 6,
  },
  {
    type: 'text',
    name: 'lastName',
    label: 'Last Name',
    disabled: true,
    grid: 6,
  },
  {
    type: 'text',
    name: 'roleId',
    label: 'Role',
    disabled: true,
    grid: 6,
  },
  {
    type: 'text',
    name: 'email',
    label: 'Email',
    rules: {
      validate: (val: any) => {
        if (!val) return true;
        return (
          /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(val) || 'Invalid email address'
        );
      },
    },
    grid: 6,
  },
  {
    type: 'text',
    name: 'mobile',
    label: 'Mobile Number',
    placeholder: 'Enter mobile number',
    isNumeric: true,
    fixedLength: 10,
    rules: {
      required: 'Mobile number is required',
      pattern: {
        value: /^[6-9]\d{9}$/,
        message: 'Must be a valid 10-digit mobile number starting with 6-9',
      },
    },
    grid: 6,
  },
  {
    type: 'password',
    name: 'currentPassword',
    label: 'Current Password',
    rules: {
      required: 'Current password is required',
    },
    grid: 4,
  },
  {
    type: 'password',
    name: 'newPassword',
    label: 'New Password',
    rules: {
      required: 'New password is required',
      minLength: {
        value: 6,
        message: 'Password must be at least 6 characters long',
      },
      pattern: {
        value: /^(?=.*[a-zA-Z])(?=.*\d).+$/,
        message: 'Password must contain at least one letter and one number',
      },
    },
    grid: 4,
  },
  {
    type: 'password',
    name: 'confirmPassword',
    label: 'Confirm Password',
    rules: {
      required: 'Confirm password is required',
      validate: (value: any, formValues: any) => {
        return value === formValues.newPassword || 'Passwords do not match';
      },
    },
    grid: 4,
  },
];
