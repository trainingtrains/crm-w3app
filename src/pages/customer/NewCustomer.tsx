import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogTitle, DialogContent, Box } from '@mui/material';

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
import { useNotification } from '../../context/NotificationContext';
import type { FormField } from '../../layouts/types/form';

export default function Register() {
  const navigate = useNavigate();

  const [cities, setCities] = useState<any[]>([]);
  const [projectTypes, setProjectTypes] = useState<any[]>([]);
  const [statuses, setStatuses] = useState<any[]>([]);

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
    } catch (error) {
      console.error('Error loading registration dropdowns:', error);
    }
  }, []);

  useEffect(() => {
    loadDropdowns();
  }, [loadDropdowns]);

  const [isAddCityOpen, setIsAddCityOpen] = useState(false);

  const formFields = useMemo(
    () =>
      newClientRegistrFields.map((field) => {
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
  const { showSuccess, showError } = useNotification();

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

  const handleSubmit = useCallback(
    async (form: FormValues) => {
      try {
        const payload = {
          ...form,
          cityId: form.city && typeof form.city === 'object' ? (form.city as any).value : (form.city || null),
          totalAmount: Number(form.totalAmount) || 0,
          paidAmount: Number(form.paidAmount) || 0,
        } as any;

        delete payload.city;

        await customerService.create(payload);

        showSuccess('Customer created successfully.');

        navigate(-1);
      } catch (error: any) {
        console.error(error);
        showError(error.message || 'Failed to create customer.');
      }
    },
    [navigate, showSuccess, showError]
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
