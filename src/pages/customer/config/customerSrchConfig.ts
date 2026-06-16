import type { GridColDef } from "@mui/x-data-grid";
import type { Field } from "../../../components/types/form";


export const customerSearchConfig: Field[] = [
  {
    type: "text",
    name: "custId",
    label: "Name / Mobile / Client ID",
    placeholder: "Enter customer name",
    grid: 3,
  },
  {
    type: "select",
    name: "status",
    label: "Status",
    options: [
      {
        label: "All",
        value: "all",
      },
      {
        label: "Not Started",
        value: "0",
      },
      {
        label: "In Progress",
        value: "1",
      },
      {
        label: "Completed",
        value: "2",
      },
      {
        label: "Rejected",
        value: "3",
      },
    ],
  },
    {
    type: "select",
    name: "payment",
    label: "Payment Status",
    options: [
      {
        label: "All",
        value: "all",
      },
      {
        label: "Pending",
        value: "0",
      },
      {
        label: "Partial",
        value: "1",
      },
      {
        label: "Paid",
        value: "2",
      },
      {
        label: "Excess",
        value: "3",
      },
    ],
  },
  {
    type: "checkbox",
    name: "newCustomer",
    label: "New Customer",
    grid: 12,
  },
];

export const customeDetailsCoulmn: GridColDef[] = [
  {
    field: "customerName",
    headerName: "Customer Name",
    flex: 1,
    minWidth: 220,
  },
  {
    field: "companyName",
    headerName: "Company Name",
    flex: 1,
    minWidth: 220,
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
    field: "status",
    headerName: "Status",
    flex: 1,
    minWidth: 120,
  },
];