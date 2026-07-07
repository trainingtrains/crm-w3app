import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { StyledSection } from '../../atoms/StyledSection';
import { PageTitle } from '../../atoms/PageTitle';

import Form, { type FormValues } from '../../components/CustomForm';

import { CONSTANTS } from '../../constants';

import { newClientRegistrFields } from './config/customerConfig';

import { masterService } from '../../services/masterService';
import { customerService } from '../../services/customerService';
import { PageHeader } from '../../atoms/PageHeader';

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
  console.log('--------------------', formFields);
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
      <StyledSection>
        <PageHeader>
          <PageTitle>{CONSTANTS.LBL_CRM_NEW_ENTRY}</PageTitle>
        </PageHeader>
      </StyledSection>

      <Form config={formFields} onSubmit={handleSubmit} submitLabel="Save" />
    </>
  );
}
