import { useState } from "react";

import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";


import { Form } from "../../components/Form";
import CustomDataGrid from "../../components/CustomDataGrid";

import {
  customeDetailsCoulmn,
  customerSearchConfig,
} from "./config/customerSrchConfig";

import { customers } from "./__mocks/dummyData";
import { PrimaryButton } from "../../atoms/PrimaryButton";
import { useNavigate } from "react-router-dom";


// import { useNavigate } from "react-router-dom";

export const CustomerSrchPage = () => {
  const navigate = useNavigate();
  const [rows] = useState(customers);

  // const navigate = useNavigate();

  const handleSearch = (
    data: Record<string, unknown>
  ) => {
    console.log("Search Data:", data);

    // API Call
  };

  const handleAddCustomer = () => {
    navigate("/newCust")

    // navigate("/customer/add");
  };

  return (
    <Paper
      elevation={1}
      sx={{
        p: 2,
        borderRadius: 3,
      }}
    >
      <Box
        sx={{
          mb: 2,

          display: "flex",

          justifyContent:
            "space-between",

          // alignItems:
          //   "center",

          flexDirection: {
            xs: "column",
            sm: "row",
          },

          gap: 2,
        }}
      >
        <Typography
          component="h2"
          variant="h6"
          sx={{
            fontWeight: 600,
          }}
        >
          Customer Relationship Data Management
        </Typography>

        <Stack
          direction="row"
          spacing={2}
        >
          <PrimaryButton
            startIcon={
              <PersonAddAlt1Icon />
            }
            onClick={
              handleAddCustomer
            }
          >
            Add Customer
          </PrimaryButton>
        </Stack>
      </Box>

      {/* =======================================================
          SEARCH FORM
      ======================================================= */}

      <Paper
        elevation={1}
        sx={{
          p: 2,
          borderRadius: 3,
        }}
      >
        <Form
          config={
            customerSearchConfig
          }
          onSubmit={
            handleSearch
          }
        />
      </Paper>

      <CustomDataGrid
        rows={rows}
        columns={
          customeDetailsCoulmn
        }
        onView={(
          id,
          row
        ) => {
          console.log(
            "VIEW",
            id,
            row
          );
        }}
        onEdit={(
          id,
          row
        ) => {
          console.log(
            "EDIT",
            id,
            row
          );
        }}
        onDelete={(
          id,
          row
        ) => {
          console.log(
            "DELETE",
            id,
            row
          );
        }}
      />
    </Paper>
  );
};

export default CustomerSrchPage;