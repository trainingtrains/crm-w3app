import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import AppLayout from '../../layouts/AppLayout';
import DetailsView from '../../layouts/DetailsView';

import { StyledSection } from '../../atoms/StyledSection';
import { PageTitle } from '../../atoms/PageTitle';

import { CONSTANTS } from '../../constants';

import UserService, { type UserDetailsResponse } from '../../services/userService';
import { userDetailsConfig } from './adminConfig';
import { useNotification } from '../../context/NotificationContext';

const UserDetailsPage = () => {
  const { id } = useParams<{ id: string }>();

  const navigate = useNavigate();
  const { showSuccess, showError } = useNotification();

  const [user, setUser] = useState<UserDetailsResponse | null>(null);

  const loadUser = useCallback(async () => {
    if (!id) return;

    try {
      const response = await UserService.getById(id);
      setUser(response);
    } catch (error: any) {
      console.error('Unable to load user.', error);
      showError(error.message || 'Unable to load user.');
    }
  }, [id]);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  const handleDelete = useCallback(async () => {
    if (!id) return;

    try {
      await UserService.delete(id);

      showSuccess('User deleted successfully.');

      navigate(-1);
    } catch (error: any) {
      console.error(error);
      showError(error.message || 'Unable to delete user.');
    }
  }, [id, navigate, showSuccess, showError]);

  const handleEdit = useCallback(() => {
    navigate(`/admin/nedituser/${id}`);
  }, [id, navigate]);

  if (!user) {
    return null;
  }

  return (
    <AppLayout>
      <StyledSection>
        <PageTitle>{CONSTANTS.LBL_USER_DETAILS}</PageTitle>

        <DetailsView
          config={userDetailsConfig}
          data={user}
          actionLabel="Edit"
          negativeLabel="Delete"
          onActionClick={handleEdit}
          onNegativeClick={handleDelete}
        />
      </StyledSection>
    </AppLayout>
  );
};

export default UserDetailsPage;
