import { useState } from 'react';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';

import { Form } from '../../components/CustomForm';
import CustomDataGrid from '../../components/CustomDataGrid';

import { customeDetailsCoulmn, customerSearchConfig } from './config/customerConfig';

import { customers } from './__mocks/dummyData';
import { PrimaryButton } from '../../atoms/PrimaryButton';
import { useNavigate } from 'react-router-dom';
import { PageTitle } from '../../atoms/PageTitle';
import { StyledSection } from '../../atoms/StyledSection';

// import { useNavigate } from "react-router-dom";

export const CustomerSrchPage = () => {
  const navigate = useNavigate();
  const [rows] = useState(customers);

  // const navigate = useNavigate();

  const handleSearch = (data: Record<string, unknown>) => {
    console.log('Search Data:', data);

    // API Call
  };

  const handleAddCustomer = () => {
    navigate('/newCust');

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
      <StyledSection>
        <PageTitle>
          Customer Relationship Data Management
        </PageTitle>

        <Stack direction="row" spacing={2}>
          <PrimaryButton variant="outlined" startIcon={<PersonAddAlt1Icon />} onClick={handleAddCustomer}>
            Add Customer
          </PrimaryButton>
        </Stack>
      </StyledSection>

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
        <Form config={customerSearchConfig} onSubmit={handleSearch} />
      </Paper>

      <CustomDataGrid
        rows={rows}
        columns={customeDetailsCoulmn}
        onView={(id, row) => {
          console.log('VIEW', id, row);
        }}
        onEdit={(id, row) => {
          console.log('EDIT', id, row);
        }}
        onDelete={(id, row) => {
          console.log('DELETE', id, row);
        }}
      />
    </Paper>
  );
};

export default CustomerSrchPage;
