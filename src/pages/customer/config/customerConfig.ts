import type { GridColDef } from '@mui/x-data-grid';
import type { Field } from '../../../components/types/form';

export const customerSearchConfig: Field[] = [
  {
    type: 'text',
    name: 'custId',
    label: 'Name / Mobile / Client ID',
    placeholder: 'Enter customer name',
    grid: 3,
  },
  {
    type: 'select',
    name: 'status',
    label: 'Status',
    options: [
      {
        label: 'All',
        value: 'all',
      },
      {
        label: 'Not Started',
        value: '0',
      },
      {
        label: 'In Progress',
        value: '1',
      },
      {
        label: 'Completed',
        value: '2',
      },
      {
        label: 'Rejected',
        value: '3',
      },
    ],
  },
  {
    type: 'select',
    name: 'payment',
    label: 'Payment Status',
    options: [
      {
        label: 'All',
        value: 'all',
      },
      {
        label: 'Pending',
        value: '0',
      },
      {
        label: 'Partial',
        value: '1',
      },
      {
        label: 'Paid',
        value: '2',
      },
      {
        label: 'Excess',
        value: '3',
      },
    ],
  }
];

export const customeDetailsCoulmn: GridColDef[] = [
  {
    field: 'customerName',
    headerName: 'Customer Name',
    flex: 1,
    minWidth: 220,
  },
  {
    field: 'companyName',
    headerName: 'Company Name',
    flex: 1,
    minWidth: 220,
  },
  {
    field: 'mobile',
    headerName: 'Mobile',
    flex: 1,
    minWidth: 150,
  },
  {
    field: 'email',
    headerName: 'Email',
    flex: 1.5,
    minWidth: 250,
  },
  {
    field: 'status',
    headerName: 'Status',
    flex: 1,
    minWidth: 120,
  },
];

export const clientRequirementColumns: Field[] = [
  {
    type: 'text',
    name: 'companyName',
    label: 'Company Name',
    placeholder: 'Enter company name',
    required:true,
    grid: 6,
  },
  {
    type: 'text',
    name: 'contactPerson',
    label: 'Contact Person',
    required:true,
    placeholder: 'Enter contact person name',
    grid: 6,
  },
  {
    type: 'text',
    name: 'mobile',
    label: 'Mobile',
    required:true,
    placeholder: 'Enter mobile number',
    grid: 6,
  },
  {
    type: 'text',
    name: 'email',
    label: 'Email',
    required:true,
    placeholder: 'Enter email address',
    grid: 6,
  },
  {
    type: 'select',
    name: 'projectType',
    label: 'Project Type',
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
    grid: 6,
  },
  {
    type: 'select',
    name: 'status',
    label: 'Enquiry Status',
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
    grid: 6,
  },
];