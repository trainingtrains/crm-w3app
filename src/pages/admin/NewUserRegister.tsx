import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

import { StyledSection } from '../../atoms/StyledSection';
import { PageTitle } from '../../atoms/PageTitle';
import { PageHeader } from '../../atoms/PageHeader';
import { FormContainer } from '../../atoms/FormContainer';

import AppLayout from '../../layouts/AppLayout';
import CustomForm from '../../layouts/CustomForm';

import { CONSTANTS } from '../../constants';
import { newUserRegistrationFields } from './adminConfig';
import UserService from '../../services/userService';
import { useNotification } from '../../context/NotificationContext';

export default function NewUserPage() {
  const navigate = useNavigate();

  const { showSuccess, showError } = useNotification();

  const handleSubmit = useCallback(
    async (data) => {
      try {
        await UserService.create(data);
        showSuccess('User created successfully.');

        navigate(-1);
      } catch (error: any) {
        console.error(error);
        showError(error.message || 'Failed to create user.');
      }
    },
    [navigate, showSuccess, showError]
  );

  return (
    <AppLayout>
      <StyledSection>
        <PageHeader>
          <PageTitle>{CONSTANTS.LBL_NEW_USER}</PageTitle>
        </PageHeader>
      </StyledSection>

      <FormContainer>
        <CustomForm config={newUserRegistrationFields} onSubmit={handleSubmit} submitLabel="Save" />
      </FormContainer>
    </AppLayout>
  );
}
