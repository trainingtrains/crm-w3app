import { useEffect, useMemo, useState, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Dialog, DialogTitle, DialogContent, Box } from '@mui/material';

import { StyledSection } from '../../atoms/StyledSection';
import { PageTitle } from '../../atoms/PageTitle';

import CustomForm, { type FormValues } from '../../layouts/CustomForm';

import { clientEditConfig } from './config/customerConfig';

import { CONSTANTS } from '../../constants';

import { customerService } from '../../services/customerService';
import { masterService } from '../../services/masterService';
import { FormContainer } from '../../atoms/FormContainer';
import AppLayout from '../../layouts/AppLayout';
import { useNotification } from '../../context/NotificationContext';
import type { FormField } from '../../layouts/types/form';

export default function EditCustomerPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { showSuccess, showError } = useNotification();

  const [cities, setCities] = useState<any[]>([]);
  const [projectTypes, setProjectTypes] = useState<any[]>([]);
  const [statuses, setStatuses] = useState<any[]>([]);
  const [customerData, setCustomerData] = useState<any | null>(null);

  const [dropdownsLoaded, setDropdownsLoaded] = useState(false);
  const [customerLoaded, setCustomerLoaded] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const [isAddCityOpen, setIsAddCityOpen] = useState(false);

  const loadDropdowns = useCallback(async () => {
    try {
      const [citiesRes, projectTypesRes, statusesRes] = await Promise.all([
        masterService.getCities(),
        masterService.getProjectTypes(),
        masterService.getEnquiryStatus(),
      ]);
      setCities(citiesRes || []);
      setProjectTypes(projectTypesRes || []);
      setStatuses(statusesRes || []);
      setDropdownsLoaded(true);
    } catch (error) {
      console.error(error);
      setLoadError(true);
    }
  }, []);

  useEffect(() => {
    loadDropdowns();
  }, [loadDropdowns]);

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

  const isLoading = !dropdownsLoaded || !customerLoaded;

  const customer: FormValues | null = useMemo(() => {
    if (!customerData) return null;

    const matchedCity = cities.find((city) => city.value === customerData.cityId);

    return {
      ...customerData,
      city: matchedCity ? { label: matchedCity.label, value: matchedCity.value } : null,
    };
  }, [customerData, cities]);

  const formFields = useMemo(
    () =>
      clientEditConfig.map((field) => {
        if (field.name === CONSTANTS.KEY_CITY) {
          return {
            ...field,
            options: cities,
            onAddCity: () => setIsAddCityOpen(true),
          };
        }
        if (field.name === 'projectType') {
          return {
            ...field,
            options: projectTypes,
          };
        }
        if (field.name === 'status') {
          return {
            ...field,
            options: statuses,
          };
        }
        return field;
      }),
    [cities, projectTypes, statuses]
  );

  const addCityFormFields = useMemo<FormField[]>(
    () => [
      {
        type: 'text',
        name: 'cityName',
        label: 'City Name',
        placeholder: 'Enter new city name',
        rules: { required: 'City name is required' },
        grid: 12,
      },
    ],
    []
  );

  const handleAddCitySubmit = async (values: FormValues) => {
    try {
      const name = String(values.cityName).trim();
      await masterService.addCity(name);
      showSuccess(`City "${name}" added successfully.`);
      setIsAddCityOpen(false);
      loadDropdowns();
    } catch (error: any) {
      showError(error.message || 'Failed to add city.');
    }
  };

  const handleSubmit = async (form: FormValues) => {
    if (!id) return;

    try {
      const payload = {
        ...form,
        cityId: form.city && typeof form.city === 'object' ? (form.city as any).value : (form.city || null),
        totalAmount: Number(form.totalAmount) || 0,
        paidAmount: Number(form.paidAmount) || 0,
      } as any;

      delete payload.city;

      await customerService.update(id, payload);
      showSuccess('Customer updated successfully.');
      navigate(-1);
    } catch (error: any) {
      console.error(error);
      showError(error.message || 'Unable to update customer.');
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

      <Dialog open={isAddCityOpen} onClose={() => setIsAddCityOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 600 }}>Add New City</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            <CustomForm
              config={addCityFormFields}
              onSubmit={handleAddCitySubmit}
              submitLabel="Add City"
              onCancel={() => setIsAddCityOpen(false)}
            />
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
}
