import { useCallback, useEffect, useState } from 'react';

import AppLayout from '../../layouts/AppLayout';
import CustomForm, { type FormValues } from '../../layouts/CustomForm';

import { StyledSection } from '../../atoms/StyledSection';
import { PageTitle } from '../../atoms/PageTitle';
import { FormContainer } from '../../atoms/FormContainer';

import UserService from '../../services/userService';
import { profileConfig } from './adminConfig';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';

export default function ProfilePage() {
  const { user } = useAuth();
  const { showSuccess, showError } = useNotification();

  const [profile, setProfile] = useState<FormValues | null>(null);
  const [loading, setLoading] = useState(true);

  const loadProfile = useCallback(async () => {
    if (!user?.id) return;

    try {
      const response = await UserService.getProfile(user.id);

      setProfile({
        ...response,
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (error: any) {
      console.error(error);
      showError(error.message || 'Unable to load profile.');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  const handleSubmit = useCallback(
    async (form: FormValues) => {
      if (!user?.id) return;

      try {
        await UserService.updateProfile(user.id, form);

        showSuccess('Profile updated successfully.');

        loadProfile();
      } catch (error: any) {
        console.error(error);
        showError(error.message);
      }
    },
    [user, loadProfile, showSuccess, showError]
  );

  return (
    <AppLayout>
      <StyledSection>
        <PageTitle>My Profile</PageTitle>
      </StyledSection>

      <FormContainer>
        {loading ? (
          <>Loading...</>
        ) : !profile ? (
          <>Unable to load profile.</>
        ) : (
          <CustomForm
            config={profileConfig}
            defaultValues={profile}
            onSubmit={handleSubmit}
            submitLabel="Update"
          />
        )}
      </FormContainer>
    </AppLayout>
  );
}
