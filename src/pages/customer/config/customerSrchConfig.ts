import type { GridColDef } from "@mui/x-data-grid";
import type { Field } from "../../../components/types/form";


export const customerSearchConfig: Field[] = [
  {
    type: "text",
    name: "customerName",
    label: "Customer Name",
    placeholder: "Enter customer name",
    grid: 6,
  },
  {
    type: "email",
    name: "email",
    label: "Email",
    placeholder: "Enter email",
    grid: 6,
  },
  {
    type: "number",
    name: "mobile",
    label: "Mobile Number",
    placeholder: "Enter mobile number",
    grid: 6,
  },
  {
    type: "select",
    name: "status",
    label: "Status",
    grid: 6,
    options: [
      {
        label: "Active",
        value: "ACTIVE",
      },
      {
        label: "Inactive",
        value: "INACTIVE",
      },
      {
        label: "Pending",
        value: "PENDING",
      },
    ],
  },
  {
    type: "checkbox",
    name: "verified",
    label: "Verified Customer",
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