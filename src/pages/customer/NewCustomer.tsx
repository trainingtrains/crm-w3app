import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { StyledSection } from '../../atoms/StyledSection';
import { PageTitle } from '../../atoms/PageTitle';

import CustomForm, { type FormValues } from '../../layouts/CustomForm';

import { CONSTANTS } from '../../constants';

import { newClientRegistrFields } from './config/customerConfig';

import { masterService } from '../../services/masterService';
import { customerService } from '../../services/customerService';
import { PageHeader } from '../../atoms/PageHeader';
import { FormContainer } from '../../atoms/FormContainer';
import AppLayout from '../../layouts/AppLayout';

export default function Register() {
  const navigate = useNavigate();

  const [cities, setCities] = useState<any[]>([]);

  const loadCities = useCallback(async () => {
    try {
      const response = await masterService.getCities();
      setCities(response);
    } catch (error) {
      console.error(error);
    }
  }, []);

  useEffect(() => {
    loadCities();
  }, [loadCities]);

  const formFields = useMemo(
    () =>
      newClientRegistrFields.map((field) => {
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
  const handleSubmit = useCallback(
    async (form: FormValues) => {
      try {
        const payload = {
          ...form,
          cityId: (form.city as { value: string | number } | null)?.value ?? form.city,
        } as any;

        delete payload.city;

        await customerService.create(payload);

        alert('Customer created successfully.');

        navigate(-1);
      } catch (error) {
        console.error(error);
        alert('Failed to create customer.');
      }
    },
    [navigate]
  );

  return (
    <>
      <AppLayout>
        <StyledSection>
          <PageHeader>
            <PageTitle>{CONSTANTS.LBL_CRM_NEW_ENTRY}</PageTitle>
          </PageHeader>
        </StyledSection>
        <FormContainer>
          <CustomForm config={formFields} onSubmit={handleSubmit} submitLabel="Save" />
        </FormContainer>{' '}
      </AppLayout>
    </>
  );
}
