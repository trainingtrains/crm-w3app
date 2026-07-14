import type { FormField } from '../../../layouts/types/form';
import { CONSTANTS } from '../../../constants';
import type { DetailsField } from '../../../layouts/DetailsView';

export const projectTypeOptions = [
  { label: 'Web Application', value: 'web' },
  { label: 'Mobile Application', value: 'mobile' },
  { label: 'Desktop Application', value: 'desktop' },
  { label: 'ERP / CRM', value: 'erp' },
  { label: 'E-Commerce', value: 'ecommerce' },
  { label: 'API Development', value: 'api' },
  { label: 'Enhancement', value: 'enhancement' },
  { label: 'Other', value: 'other' },
];

export const statusOptions = [
  { label: 'New', value: 'new' },
  { label: 'Requirement Gathering', value: 'requirement' },
  { label: 'Proposal Sent', value: 'proposal' },
  { label: 'Negotiation', value: 'negotiation' },
  { label: 'Approved', value: 'approved' },
  { label: 'Development', value: 'development' },
  { label: 'On Hold', value: 'onhold' },
  { label: 'Rejected', value: 'rejected' },
];

export const customerSearchConfig: FormField[] = [
  {
    type: 'text',
    name: 'custId',
    label: 'Client ID',
    placeholder: 'Enter customer name',
    grid: 3,
  },
  {
    type: 'text',
    name: 'custName',
    label: 'Customer Name',
    placeholder: 'Enter customer name',
    grid: 3,
  },
  {
    type: 'text',
    name: 'mobile',
    label: 'Mobile',
    placeholder: 'Enter mobile number',
    grid: 3,
  },
  {
    type: 'select',
    name: CONSTANTS.KEY_CITY,
    label: CONSTANTS.LBL_CITY,
    options: [],
    grid: 3,
  },
];

export const newClientRegistrFields: FormField[] = [
  {
    type: 'text',
    name: 'companyName',
    label: 'Company Name',
    placeholder: 'Enter company name',
    rules: {
      required: 'required',
    },
    grid: 6,
  },
  {
    type: 'text',
    name: 'contactPerson',
    label: 'Contact Person',
    rules: {
      required: 'required',
    },
    placeholder: 'Enter contact person name',
    grid: 6,
  },
  {
    type: 'text',
    name: 'mobile',
    label: 'Mobile',
    rules: {
      required: 'Mobile number is required',
      pattern: {
        value: /^[6-9]\d{9}$/,
        message: 'Must be a valid 10-digit mobile number starting with 6-9',
      },
    },
    placeholder: 'Enter mobile number',
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
  {
    type: 'text',
    name: 'projectName',
    label: 'Project Name',
    placeholder: 'Enter project name',
    rules: {
      required: 'required',
    },
    grid: 6,
  },
  {
    type: 'select',
    name: 'projectType',
    label: 'Project Type',
    rules: {
      required: 'required',
    },
    options: projectTypeOptions,
    grid: 6,
  },
  {
    type: 'select',
    name: 'status',
    label: 'Project/Enquiry Status',
    rules: {
      required: 'required',
    },
    options: statusOptions,
    grid: 6,
  },
  {
    type: 'autocomplete',
    name: CONSTANTS.KEY_CITY,
    label: CONSTANTS.LBL_CITY,
    options: [],
    grid: 6,
  },
  {
    type: 'number',
    name: 'totalAmount',
    label: 'Total Contract Value (₹)',
    placeholder: 'Enter contract amount',
    rules: {
      required: 'Total contract value is required',
      min: {
        value: 0,
        message: 'Value must be positive',
      },
    },
    grid: 6,
  },
  {
    type: 'number',
    name: 'paidAmount',
    label: 'Amount Paid (₹)',
    placeholder: 'Enter amount paid',
    rules: {
      required: 'Amount paid is required',
      min: {
        value: 0,
        message: 'Value must be positive',
      },
      validate: (value: any, formValues: any) => {
        const total = Number(formValues.totalAmount) || 0;
        const paid = Number(value) || 0;
        return paid <= total || 'Amount paid cannot exceed total contract value';
      },
    },
    grid: 6,
  },
  {
    type: 'textarea',
    name: CONSTANTS.KEY_ADDRESS,
    label: CONSTANTS.LBL_ADDRESS,
    placeholder: 'Enter address',
    grid: 12,
  },
  {
    type: 'textarea',
    name: 'projectDescription',
    label: 'Project/Enquiry Details',
    placeholder: 'Enter details about the project requirements...',
    grid: 12,
  },
];

export const customerDetailsConfig: DetailsField[] = [
  {
    name: 'customerId',
    label: 'Customer ID',
    grid: 6,
  },
  {
    name: 'companyName',
    label: 'Company Name',
    grid: 6,
  },
  {
    name: 'contactPerson',
    label: 'Contact Person',
    grid: 6,
  },
  {
    name: 'mobile',
    label: 'Mobile',
    grid: 6,
  },
  {
    name: 'email',
    label: 'Email',
    grid: 6,
  },
  {
    name: 'address',
    label: 'Address',
    grid: 12,
  },
  {
    name: 'projectName',
    label: 'Project Name',
  },
  {
    name: 'projectType',
    label: 'Project Type',
    render: (val: any) => {
      const matched = projectTypeOptions.find((o) => o.value === val);
      return matched ? matched.label : val || '-';
    },
  },
  {
    name: 'status',
    label: 'Project Status',
    render: (val: any) => {
      const matched = statusOptions.find((o) => o.value === val);
      return matched ? matched.label : val || '-';
    },
  },
  {
    name: 'totalAmount',
    label: 'Total Contract Value',
    render: (val: any) => (val !== undefined ? `₹${Number(val).toLocaleString('en-IN')}` : '₹0'),
  },
  {
    name: 'paidAmount',
    label: 'Amount Paid',
    render: (val: any) => (val !== undefined ? `₹${Number(val).toLocaleString('en-IN')}` : '₹0'),
  },
  {
    name: 'balanceAmount',
    label: 'Outstanding Balance',
    render: (val: any) => (val !== undefined ? `₹${Number(val).toLocaleString('en-IN')}` : '₹0'),
  },
  {
    name: 'paymentStatus',
    label: 'Payment Status',
    render: (val: any) => {
      if (!val) return 'Unpaid';
      return String(val).toUpperCase();
    },
  },
  {
    name: 'createdAt',
    label: 'Created Date',
    grid: 6,
    render: (value) => (value ? new Date(value as any).toLocaleDateString() : '-'),
  },
  {
    name: 'updatedAt',
    label: 'Updated Date',
    grid: 6,
    render: (value) => (value ? new Date(value as any).toLocaleDateString() : '-'),
  },
  {
    name: 'projectDescription',
    label: 'Project Description',
    grid: 12,
  },
];

export const clientEditConfig: FormField[] = [
  {
    type: 'text',
    name: 'companyName',
    label: 'Company Name',
    placeholder: 'Enter company name',
    rules: {
      required: 'required',
    },
    grid: 6,
  },
  {
    type: 'text',
    name: 'contactPerson',
    label: 'Contact Person',
    placeholder: 'Enter contact person',
    rules: {
      required: 'required',
    },
    grid: 6,
  },
  {
    type: 'text',
    name: 'mobile',
    label: 'Mobile',
    placeholder: 'Enter mobile number',
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
  {
    type: 'text',
    name: 'projectName',
    label: 'Project Name',
    placeholder: 'Enter project name',
    rules: {
      required: 'required',
    },
    grid: 6,
  },
  {
    type: 'select',
    name: 'projectType',
    label: 'Project Type',
    rules: {
      required: 'required',
    },
    options: projectTypeOptions,
    grid: 6,
  },
  {
    type: 'select',
    name: 'status',
    label: 'Project/Enquiry Status',
    rules: {
      required: 'required',
    },
    options: statusOptions,
    grid: 6,
  },
  {
    type: 'autocomplete',
    name: CONSTANTS.KEY_CITY,
    label: CONSTANTS.LBL_CITY,
    placeholder: 'Select city',
    options: [],
    rules: {
      required: 'required',
    },
    grid: 6,
  },
  {
    type: 'number',
    name: 'totalAmount',
    label: 'Total Contract Value (₹)',
    placeholder: 'Enter contract amount',
    rules: {
      required: 'Total contract value is required',
      min: {
        value: 0,
        message: 'Value must be positive',
      },
    },
    grid: 6,
  },
  {
    type: 'number',
    name: 'paidAmount',
    label: 'Amount Paid (₹)',
    placeholder: 'Enter amount paid',
    rules: {
      required: 'Amount paid is required',
      min: {
        value: 0,
        message: 'Value must be positive',
      },
      validate: (value: any, formValues: any) => {
        const total = Number(formValues.totalAmount) || 0;
        const paid = Number(value) || 0;
        return paid <= total || 'Amount paid cannot exceed total contract value';
      },
    },
    grid: 6,
  },
  {
    type: 'textarea',
    name: CONSTANTS.KEY_ADDRESS,
    label: CONSTANTS.LBL_ADDRESS,
    placeholder: 'Enter address',
    grid: 6,
  },
  {
    type: 'textarea',
    name: 'projectDescription',
    label: 'Project Description',
    placeholder: 'Enter details about the project requirements...',
    grid: 6,
  },
];

export const paymentUpdateConfig: FormField[] = [
  {
    type: 'number',
    name: 'totalAmount',
    label: 'Total Contract Value (₹)',
    placeholder: 'Enter contract value',
    rules: {
      required: 'Total contract value is required',
      min: { value: 0, message: 'Must be positive' },
    },
    grid: 6,
  },
  {
    type: 'number',
    name: 'paidAmount',
    label: 'Amount Paid (₹)',
    placeholder: 'Enter amount paid',
    rules: {
      required: 'Paid amount is required',
      min: { value: 0, message: 'Must be positive' },
      validate: (value: any, formValues: any) => {
        const total = Number(formValues.totalAmount) || 0;
        const paid = Number(value) || 0;
        return paid <= total || 'Amount paid cannot exceed total contract value';
      },
    },
    grid: 6,
  },
];

export const taskAssignConfig: FormField[] = [
  {
    type: 'text',
    name: 'title',
    label: 'Task Title',
    placeholder: 'Enter task description/title',
    rules: { required: 'Task title is required' },
    grid: 12,
  },
  {
    type: 'text',
    name: 'assignedTo',
    label: 'Assigned To',
    placeholder: 'Enter username or staff name',
    rules: { required: 'Assigned to is required' },
    grid: 6,
  },
  {
    type: 'text',
    name: 'dueDate',
    label: 'Due Date',
    placeholder: 'YYYY-MM-DD',
    rules: { required: 'Due date is required' },
    grid: 6,
  },
];

export const followupConfig: FormField[] = [
  {
    type: 'text',
    name: 'date',
    label: 'Followup Date',
    placeholder: 'YYYY-MM-DD or time details',
    rules: { required: 'Followup date is required' },
    grid: 12,
  },
  {
    type: 'textarea',
    name: 'notes',
    label: 'Followup Notes',
    placeholder: 'Enter details about the followup conversation...',
    rules: { required: 'Followup notes are required' },
    grid: 12,
  },
];
