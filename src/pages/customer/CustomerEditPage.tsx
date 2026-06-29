import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { useForm } from 'react-hook-form';

import { StyledSection } from '../../atoms/StyledSection';
import { PageTitle } from '../../atoms/PageTitle';

import Form, { type FormValues } from '../../components/CustomForm';

import { clientEditConfig } from './config/customerConfig';

import { masterService } from '../../services/masterService';
import { customerService } from '../../services/customerService';

import { CONSTANTS } from '../../constants';

export default function EditCustomerPage() {
  const navigate = useNavigate();

  const { id } = useParams<{ id: string }>();

  const { reset } = useForm<FormValues>();

  const [cities, setCities] = useState<any[]>([]);

  const [customer, setCustomer] = useState<FormValues>({});

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    if (id && cities.length > 0) {
      loadCustomer(id);
    }
  }, [id, cities]);

  const loadInitialData = async () => {
    try {
      const cityData = await masterService.getCities();
      setCities(cityData);
    } catch (error) {
      console.error(error);
    }
  };

  const loadCustomer = async (customerId: string) => {
    try {
      const data = await customerService.getById(customerId);
      const city = cities.find((c) => c.value === data.cityId);
      setCustomer({
        ...data,
        city,
      });
    } catch (error) {
      console.error(error);
    }
  };

  const loadFormFields = useMemo(() => {
    return clientEditConfig.map((field) => {
      switch (field.name) {
        case CONSTANTS.KEY_CITY:
          return {
            ...field,
            options: cities.map((city) => ({
              label: city.name,
              value: city.id,
            })),
          };

        default:
          return field;
      }
    });
  }, [cities]);

  const onHandleSubmit = async (form: any) => {
    try {
      const payload = {
        ...form,
        cityId: form.city,
      };

      delete payload.city;

      await customerService.update(id!, payload);

      alert('Customer updated successfully.');

      reset();

      navigate(-1);
    } catch (error: any) {
      console.error(error);
      alert(error.message);
    }
  };

  return (
    <>
      <StyledSection>
        <PageTitle>{CONSTANTS.LBL_CRM_CUST_EDIT}</PageTitle>
      </StyledSection>

      {Object.keys(customer) && (
        <Form
          config={loadFormFields}
          defaultValues={customer}
          onSubmit={onHandleSubmit}
          submitLabel="Update"
        />
      )}
    </>
  );
}
