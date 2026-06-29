import { useEffect, useMemo, useState } from 'react';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';

import Form from '../../components/CustomForm';
import CustomDataGrid from '../../components/CustomDataGrid';

import { customeDetailsCoulmn, customerSearchConfig } from './config/customerConfig';
import { PrimaryButton } from '../../atoms/PrimaryButton';
import { useNavigate } from 'react-router-dom';
import { PageTitle } from '../../atoms/PageTitle';
import { StyledSection } from '../../atoms/StyledSection';
import { CONSTANTS } from '../../constants';
import { masterService } from '../../services/masterService';
import { customerService } from '../../services/customerService';

// import { useNavigate } from "react-router-dom";

export const CustomerSrchPage = () => {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState<any[]>([]);

  const [cities, setCities] = useState<any[]>([]);

  useEffect(() => {
    const loadData = async () => {
      const response = await customerService.searchCustomers({
        custId: '',
        custName: '',
        mobile: '',
        city: '',
      });

      setCustomers(response);
    };
    loadCities();
    loadData();
  }, []);

  const loadCities = async () => {
    const data = await masterService.getCities();
    setCities(data);
  };

  const loadSrchFormFields = useMemo(() => {
    return customerSearchConfig.map((field) => {
      if (field.type !== 'select' && field.type !== 'autocomplete') {
        return field;
      }

      switch (field.name) {
        case CONSTANTS.KEY_CITY:
          return {
            ...field,
            options: cities,
          };

        default:
          return field;
      }
    });
  }, [cities]);
  // const navigate = useNavigate();

  const handleSearch = async (data: Record<string, unknown>) => {
    try {
      const response = await customerService.searchCustomers({
        custId: data.custId as string,
        custName: data.custName as string,
        mobile: data.mobile as string,
        city: data.city as string,
      });

      setCustomers(response);
    } catch (error) {
      console.error('Search Error:', error);
    }
  };
  const handleAddCustomer = () => {
    navigate('/newCust');
  };

  const onViewClick = (id) => {
    navigate(`/custDetails/${id}`);
  };

  const onEditClick = (id) => {
    navigate(`/custEdit/${id}`);
  };

  return (
    <>
      <StyledSection>
        <PageTitle>{CONSTANTS.LBL_CRM_SRCH_PAGE}</PageTitle>
        <PrimaryButton
          variant="outlined"
          startIcon={<PersonAddAlt1Icon />}
          onClick={handleAddCustomer}
        >
          Add Customer
        </PrimaryButton>
      </StyledSection>
      <Form config={loadSrchFormFields} onSubmit={handleSearch} />
      <CustomDataGrid
        rows={customers}
        columns={customeDetailsCoulmn}
        onView={onViewClick}
        onEdit={onEditClick}
        // onDelete={onDeleteClick}
      />
    </>
  );
};

export default CustomerSrchPage;
