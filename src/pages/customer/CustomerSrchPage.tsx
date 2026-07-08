import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import CustomForm from '../../layouts/CustomForm';
import { PrimaryButton } from '../../atoms/PrimaryButton';
import { PageTitle } from '../../atoms/PageTitle';
import { StyledSection } from '../../atoms/StyledSection';
import { CONSTANTS } from '../../constants';
import { customerSearchConfig } from './config/customerConfig';
import { customerService } from '../../services/customerService';
import { masterService } from '../../services/masterService';
import type { FormValues } from '../../layouts/CustomForm';
import { PageHeader } from '../../atoms/PageHeader';
import ReusableDataGrid from '../../layouts/ReusableDataGrid';
import { FormContainer } from '../../atoms/FormContainer';
import AppLayout from '../../layouts/AppLayout';

const CustomerSrchPage = () => {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState<any[]>([]);
  const [cities, setCities] = useState<any[]>([]);

  const loadCities = useCallback(async () => {
    try {
      const response = await masterService.getCities();
      setCities(response);
    } catch (error) {
      console.error(error);
    }
  }, []);

  const loadCustomers = useCallback(async () => {
    try {
      const response = await customerService.searchCustomers({
        custId: '',
        custName: '',
        mobile: '',
        city: '',
      });
      setCustomers(response);
    } catch (error) {
      console.error(error);
    }
  }, []);

  useEffect(() => {
    loadCities();
    loadCustomers();
  }, [loadCities, loadCustomers]);

  const searchFields = useMemo(
    () =>
      customerSearchConfig.map((field) => {
        if (field.name !== CONSTANTS.KEY_CITY) {
          return field;
        }
        return {
          ...field,
          options: cities,
        };
      }),
    [cities]
  );

  const handleSearch = useCallback(async (form: FormValues) => {
    try {
      const response = await customerService.searchCustomers({
        custId: String(form.custId ?? ''),
        custName: String(form.custName ?? ''),
        mobile: String(form.mobile ?? ''),
        city: String(form.city ?? ''),
      });
      setCustomers(response);
    } catch (error) {
      console.error(error);
    }
  }, []);

  const handleAddCustomer = useCallback(() => {
    navigate('/newCust');
  }, [navigate]);

  const handleView = useCallback(
    (row: any) => {
      const rowId = row?.id;
      if (rowId) {
        navigate(`/custDetails/${rowId}`);
      }
    },
    [navigate]
  );

  const customerDetails = useMemo(() => {
    return customers.map((customer) => {
      console.log(customer);
      const mappedCity = cities.find(
        (c) => String(c.id || c.cityId) === String(customer.city || customer.cityId)
      );

      return {
        id: customer.id,
        customerId: customer.customerId,
        companyName: customer.companyName,
        contactPerson: customer.contactPerson,
        contactDetails: `${customer.mobile || '-'} / ${customer.email || '-'}`,
        city: mappedCity ? mappedCity.name || mappedCity.cityName : customer.city || '-',
        enquiry: customer.enquiry ? String(customer.enquiry).toUpperCase() : '-',
        totalAmount: customer.totalAmount ?? 0,
        paidAmount: customer.paidAmount ?? 0,
        balanceAmount: customer.balanceAmount ?? 0,
      };
    });
  }, [customers, cities]);

  const handleExportCSV = useCallback(() => {
    if (!customerDetails.length) return;

    const headers = Object.keys(customerDetails[0]);
    const csvRows = customerDetails.map((customer: any) =>
      headers
        .map((header) => {
          const value = customer[header];
          if (value === null || value === undefined) return '';
          return `"${String(value).replace(/"/g, '""')}"`;
        })
        .join(',')
    );

    const csvContent = [headers.join(','), ...csvRows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');

    link.href = url;
    link.download = `customer_export_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, [customerDetails]);

  return (
    <><AppLayout>

      <PageHeader>
        <PageTitle>{CONSTANTS.LBL_CRM_SRCH_PAGE}</PageTitle>
        <PrimaryButton
          variant="contained"
          startIcon={<PersonAddAlt1Icon />}
          onClick={handleAddCustomer}
        >
          Add Customer
        </PrimaryButton>
      </PageHeader>

      <FormContainer>
        <StyledSection>
          <CustomForm config={searchFields} onSubmit={handleSearch} />
        </StyledSection>

        <ReusableDataGrid
          data={customerDetails}
          onExportCSV={handleExportCSV}
          onView={handleView}
        />
      </FormContainer></AppLayout>
    </>
  );
};

export default CustomerSrchPage;
