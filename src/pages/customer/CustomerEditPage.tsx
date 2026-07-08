import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { StyledSection } from '../../atoms/StyledSection';
import { PageTitle } from '../../atoms/PageTitle';

import CustomForm, { type FormValues } from '../../layouts/CustomForm';

import { clientEditConfig } from './config/customerConfig';

import { CONSTANTS } from '../../constants';

import { customerService } from '../../services/customerService';
import { masterService } from '../../services/masterService';
import { FormContainer } from '../../atoms/FormContainer';
import AppLayout from '../../layouts/AppLayout';

export default function EditCustomerPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [cities, setCities] = useState<any[]>([]);
  const [customerData, setCustomerData] = useState<any | null>(null);
  const [citiesLoaded, setCitiesLoaded] = useState(false);
  const [customerLoaded, setCustomerLoaded] = useState(false);
  const [loadError, setLoadError] = useState(false);

  // Fetch cities and customer in parallel — they don't depend on each other to fetch,
  // only to combine afterwards. Removes the "empty cities list = infinite loading" deadlock.
  useEffect(() => {
    let isMounted = true;

    masterService
      .getCities()
      .then((response) => {
        if (isMounted) setCities(response ?? []);
      })
      .catch((error) => {
        console.error(error);
        if (isMounted) setLoadError(true);
      })
      .finally(() => {
        if (isMounted) setCitiesLoaded(true);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!id) return;
    let isMounted = true;

    customerService
      .getById(id)
      .then((data) => {
        if (isMounted) setCustomerData(data);
      })
      .catch((error) => {
        console.error(error);
        if (isMounted) setLoadError(true);
      })
      .finally(() => {
        if (isMounted) setCustomerLoaded(true);
      });

    return () => {
      isMounted = false;
    };
  }, [id]);

  const isLoading = !citiesLoaded || !customerLoaded;

  // Combine once both are ready. Shape `city` to match the Autocomplete's option shape
  // ({ label, value }) instead of the raw city entity — this is what fixes the
  // "selected city doesn't show" bug.
  const customer: FormValues | null = useMemo(() => {
    if (!customerData) return null;

    const matchedCity = cities.find((city) => city.id === customerData.cityId);

    return {
      ...customerData,
      city: matchedCity ? { label: matchedCity.name, value: matchedCity.id } : null,
    };
  }, [customerData, cities]);

  const formFields = useMemo(
    () =>
      clientEditConfig.map((field) => {
        if (field.name !== CONSTANTS.KEY_CITY) return field;

        return {
          ...field,
          options: cities.map((city) => ({
            label: city.name,
            value: city.id,
          })),
        };
      }),
    [cities]
  );

  const handleSubmit = async (form: FormValues) => {
    if (!id) return;

    try {
      const payload = {
        ...form,
        cityId: (form.city as { value: string | number } | null)?.value ?? null,
      } as any;

      delete payload.city;

      await customerService.update(id, payload);
      alert('Customer updated successfully.');
      navigate(-1);
    } catch (error) {
      console.error(error);
      alert('Unable to update customer.');
    }
  };

  return (
    <>
      <AppLayout>
        <StyledSection>
          <PageTitle>{CONSTANTS.LBL_CRM_CUST_EDIT}</PageTitle>
        </StyledSection>
        <FormContainer>
          {isLoading ? (
            <>Loading......</>
          ) : loadError || !customer ? (
            <p>Unable to load customer details.</p>
          ) : (
            // key forces a clean remount with correct defaultValues if this ever
            // re-renders before data was ready — RHF only reads defaultValues on mount.
            <CustomForm
              key={id}
              config={formFields}
              defaultValues={customer}
              onSubmit={handleSubmit}
              submitLabel="Update"
            />
          )}
        </FormContainer>
      </AppLayout>
    </>
  );
}
