import type { GridColDef } from '@mui/x-data-grid';
import type { Field } from '../../../components/types/form';
import { CONSTANTS } from '../../../constants';

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

export const customeDetailsCoulmn: GridColDef[] = [
  {
    field: "customerId",
    headerName: "Customer ID",
    flex: 1,
    minWidth: 140,
  },
  {
    field: "companyName",
    headerName: "Company Name",
    flex: 1,
    minWidth: 220,
  },
  {
    field: "contactPerson",
    headerName: "Contact Person",
    flex: 1,
    minWidth: 200,
  },
  {
    field: "mobile",
    headerName: "Mobile",
    flex: 1,
    minWidth: 150,
  },
  {
    field: "email",
    headerName: "Email",
    flex: 1.5,
    minWidth: 250,
  },
  {
    field: "cityName",
    headerName: "City",
    flex: 1,
    minWidth: 150,
  },
  {
    field: "projectType",
    headerName: "Project Type",
    flex: 1,
    minWidth: 150,
  },
  {
    field: "status",
    headerName: "Status",
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
  {
    type: 'textarea',
    name: CONSTANTS.KEY_ADDRESS,
    label: CONSTANTS.LBL_ADDRESS,
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