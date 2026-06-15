import { useState } from "react";

import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import PersonAddAltOutlinedIcon from "@mui/icons-material/PersonAddAltOutlined";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";

import { Form } from "../../components/Form";
import CustomDataGrid from "../../components/CustomDataGrid";

import {
  customeDetailsCoulmn,
  customerSearchConfig,
} from "./config/customerSrchConfig";

import { customers } from "./__mocks/dummyData";
import { PrimaryButton } from "../../atoms/button.components";

// import { useNavigate } from "react-router-dom";

export const CustomerSrchPage = () => {
  const [rows] = useState(customers);

  // const navigate = useNavigate();

  const handleSearch = (
    data: Record<string, unknown>
  ) => {
    console.log("Search Data:", data);

    // API Call
  };

  const handleAddCustomer = () => {
    console.log("Navigate to Add Customer");

    // navigate("/customer/add");
  };

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: "1800px",
        mx: "auto",
        p: {
          xs: 2,
          sm: 3,
          md: 4,
        },
      }}
    >
      {/* =======================================================
          HEADER
      ======================================================= */}

      <Box
        sx={{
          mb: 4,

          display: "flex",

          justifyContent:
            "space-between",

          alignItems: {
            xs: "flex-start",
            md: "center",
          },

          flexDirection: {
            xs: "column",
            md: "row",
          },

          gap: 2,
        }}
      >
        <Box>
          <Typography
            component="h1"
            variant="h4"
            sx={{
              fontWeight: 700,
            }}
          >
            Customer Relationship Data
            Management
          </Typography>

          <Typography
            component="p"
            color="text.secondary"
            sx={{
              mt: 1,
            }}
          >
            Search, manage and maintain
            customer relationships
            efficiently.
          </Typography>
        </Box>
      </Box>

      {/* =======================================================
          DASHBOARD CARDS
      ======================================================= */}

      <Grid
        container
        spacing={2}
      >
        <Grid
          size={{
            xs: 12,
            sm: 6,
            md: 4,
          }}
        >
          <Paper
            elevation={1}
            sx={{
              p: 3,
              borderRadius: 3,
              height: "100%",
            }}
          >
            <PeopleAltOutlinedIcon
              color="primary"
              fontSize="large"
            />

            <Typography
              component="div"
              variant="h4"
              sx={{
                fontWeight: 700,
                mt: 1,
              }}
            >
              250
            </Typography>

            <Typography
              component="p"
              color="text.secondary"
            >
              Total Customers
            </Typography>
          </Paper>
        </Grid>

        <Grid
          size={{
            xs: 12,
            sm: 6,
            md: 4,
          }}
        >
          <Paper
            elevation={1}
            sx={{
              p: 3,
              borderRadius: 3,
              height: "100%",
            }}
          >
            <PersonAddAltOutlinedIcon
              color="success"
              fontSize="large"
            />

            <Typography
              component="div"
              variant="h4"
              sx={{
                fontWeight: 700,
                mt: 1,
              }}
            >
              32
            </Typography>

            <Typography
              component="p"
              color="text.secondary"
            >
              New Customers
            </Typography>
          </Paper>
        </Grid>

        <Grid
          size={{
            xs: 12,
            sm: 6,
            md: 4,
          }}
        >
          <Paper
            elevation={1}
            sx={{
              p: 3,
              borderRadius: 3,
              height: "100%",
            }}
          >
            <CheckCircleOutlineOutlinedIcon
              color="info"
              fontSize="large"
            />

            <Typography
              component="div"
              variant="h4"
              sx={{
                fontWeight: 700,
                mt: 1,
              }}
            >
              180
            </Typography>

            <Typography
              component="p"
              color="text.secondary"
            >
              Active Customers
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* =======================================================
          RESULTS
      ======================================================= */}

      <Paper
        elevation={1}
        sx={{
          p: 3,
          mt: 3,
          borderRadius: 3,
        }}
      >
        <Box
          sx={{
            mb: 2,

            display: "flex",

            justifyContent:
              "space-between",

            alignItems:
              "center",

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
            Customer Records
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
          p: 3,
          mt: 3,
          borderRadius: 3,
        }}
      >
        <Typography
          component="h2"
          variant="h6"
          sx={{
            mb: 2,
            fontWeight: 600,
          }}
        >
          Search Filters
        </Typography>

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
    </Box>
  );
};

export default CustomerSrchPage;