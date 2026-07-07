import type { Field } from '../../../components/types/form';
import { CONSTANTS } from '../../../constants';
import type { DetailsField } from '../../../components/DetailsView';

export const customerSearchConfig: Field[] = [
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


export const newClientRegistrFields: Field[] = [
  {
    type: 'text',
    name: 'companyName',
    label: 'Company Name',
    placeholder: 'Enter company name',
    required: true,
    grid: 6,
  },
  {
    type: 'text',
    name: 'contactPerson',
    label: 'Contact Person',
    required: true,
    placeholder: 'Enter contact person name',
    grid: 6,
  },
  {
    type: 'text',
    name: 'mobile',
    label: 'Mobile',
    required: true,
    placeholder: 'Enter mobile number',
    grid: 6,
  },
  {
    type: 'text',
    name: 'email',
    label: 'Email',
    placeholder: 'Enter email address',
    grid: 6,
  },
   {
    type: 'text',
    name: CONSTANTS.KEY_ADDRESS,
    label: CONSTANTS.LBL_ADDRESS,
    grid: 6,
  },
  {
    type: 'text',
    name: 'enquiry',
    label: 'Enquiry details',
    grid: 6,
  },
  {
    type: 'autocomplete',
    name: CONSTANTS.KEY_CITY,
    label: CONSTANTS.LBL_CITY,
    options: [],
    grid: 6,
  },
];

// customerDetails.config.ts

export const customerDetailsConfig: DetailsField[] = [
  {
    name: 'customerId',
    label: 'Customer ID',
  },
  {
    name: 'companyName',
    label: 'Company Name',
  },
  {
    name: 'contactPerson',
    label: 'Contact Person',
  },
  {
    name: 'mobile',
    label: 'Mobile',
  },
  {
    name: 'email',
    label: 'Email',
  },
  {
    name: 'address',
    label: 'Address',
    grid: 6,
  },
  {
    name: 'projectType',
    label: 'Project Type',
  },
  {
    name: 'status',
    label: 'Status',
  },
  {
    name: 'createdAt',
    label: 'Created Date',
    render: (value) => (value ? new Date(value as any).toLocaleDateString() : '-'),
  },
  {
    name: 'updatedAt',
    label: 'Updated Date',
    render: (value) => (value ? new Date(value as any).toLocaleDateString() : '-'),
  },
];

export const clientEditConfig: Field[] = [
  {
    type: 'text',
    name: 'companyName',
    label: 'Company Name',
    placeholder: 'Enter company name',
    required: true,
    grid: 6,
  },
  {
    type: 'text',
    name: 'contactPerson',
    label: 'Contact Person',
    placeholder: 'Enter contact person',
    required: true,
    grid: 6,
  },
  {
    type: 'text',
    name: 'mobile',
    label: 'Mobile',
    placeholder: 'Enter mobile number',
    required: true,
    grid: 6,
  },
  {
    type: 'text',
    name: 'email',
    label: 'Email',
    placeholder: 'Enter email address',
    grid: 6,
  },
  {
    type: 'select',
    name: 'projectType',
    label: 'Project Type',
    required: true,
    grid: 6,
      options: [
      { label: 'All', value: 'all' },
      { label: 'Web Application', value: 'web' },
      { label: 'Mobile Application', value: 'mobile' },
      { label: 'Desktop Application', value: 'desktop' },
      { label: 'ERP / CRM', value: 'erp' },
      { label: 'E-Commerce', value: 'ecommerce' },
      { label: 'API Development', value: 'api' },
      { label: 'Enhancement', value: 'enhancement' },
      { label: 'Other', value: 'other' },
    ],
  },
  {
    type: 'select',
    name: 'status',
    label: 'Enquiry Status',
    required: true,
    grid: 6,
     options: [
      { label: 'All', value: 'all' },
      { label: 'New', value: 'new' },
      { label: 'Requirement Gathering', value: 'requirement' },
      { label: 'Proposal Sent', value: 'proposal' },
      { label: 'Negotiation', value: 'negotiation' },
      { label: 'Approved', value: 'approved' },
      { label: 'Development', value: 'development' },
      { label: 'On Hold', value: 'onhold' },
      { label: 'Rejected', value: 'rejected' },
    ],
  },
  {
    type: 'textarea',
    name: CONSTANTS.KEY_ADDRESS,
    label: CONSTANTS.LBL_ADDRESS,
    placeholder: 'Enter address',
    grid: 6,
  },
  {
    type: 'autocomplete',
    name: CONSTANTS.KEY_CITY,
    label: CONSTANTS.LBL_CITY,
    placeholder: 'Select city',
    options: [],
    required: true,
    grid: 6,
  },
];
