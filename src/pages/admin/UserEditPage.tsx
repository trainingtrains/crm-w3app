import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import AppLayout from '../../layouts/AppLayout';
import CustomForm, { type FormValues } from '../../layouts/CustomForm';

import { StyledSection } from '../../atoms/StyledSection';
import { PageTitle } from '../../atoms/PageTitle';
import { FormContainer } from '../../atoms/FormContainer';

import { CONSTANTS } from '../../constants';

import UserService from '../../services/userService';
import { userEditConfig } from './adminConfig';
import { useNotification } from '../../context/NotificationContext';

export default function EditUserPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { showSuccess, showError } = useNotification();

  const [user, setUser] = useState<FormValues | null>(null);
  const [loading, setLoading] = useState(true);

  const loadUser = useCallback(async () => {
    if (!id) return;

    try {
      const response = await UserService.getById(id);

      setUser(response);
    } catch (error: any) {
      console.error(error);
      showError(error.message || 'Unable to load user.');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  const handleSubmit = useCallback(
    async (form: FormValues) => {
      if (!id) return;

      try {
        await UserService.update(id, form);

        showSuccess('User updated successfully.');

        navigate(-1);
      } catch (error: any) {
        console.error(error);
        showError(error.message || 'Unable to update user.');
      }
    },
    [id, navigate, showSuccess, showError]
  );

  return (
    <AppLayout>
      <StyledSection>
        <PageTitle>{CONSTANTS.LBL_EDIT_USER}</PageTitle>
      </StyledSection>

      <FormContainer>
        {loading ? (
          <>Loading...</>
        ) : !user ? (
          <>Unable to load user.</>
        ) : (
          <CustomForm
            key={id}
            config={userEditConfig}
            defaultValues={user}
            onSubmit={handleSubmit}
            submitLabel="Update"
          />
        )}
      </FormContainer>
    </AppLayout>
  );
}
