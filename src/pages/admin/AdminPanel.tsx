import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';

import CustomForm, { type FormValues } from '../../layouts/CustomForm';
import ReusableDataGrid from '../../layouts/ReusableDataGrid';
import AppLayout from '../../layouts/AppLayout';

import { PrimaryButton } from '../../atoms/PrimaryButton';
import { PageTitle } from '../../atoms/PageTitle';
import { StyledSection } from '../../atoms/StyledSection';
import { PageHeader } from '../../atoms/PageHeader';
import { FormContainer } from '../../atoms/FormContainer';

import { CONSTANTS } from '../../constants';
import { adminSearchConfig } from './adminConfig';

import UserService, { type UserSearchResponse } from '../../services/userService';

const AdminSrchPage = () => {
  const navigate = useNavigate();

  const [users, setUsers] = useState<UserSearchResponse[]>([]);
  const [loading, setLoading] = useState(false);

  const loadUsers = useCallback(async () => {
    try {
      setLoading(true);

      // Empty search -> returns all users ordered by createdAt DESC
      const response = await UserService.search({});

      setUsers(response);
    } catch (error) {
      console.error(error);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const handleSearch = useCallback(async (form: FormValues) => {
    try {
      setLoading(true);

      const response = await UserService.search({
        userId: form.userId?.toString(),
        userName: form.userName?.toString(),
        mobile: form.mobile?.toString(),
      });

      setUsers(response);
    } catch (error) {
      console.error(error);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleView = useCallback(
    (row) => {
      // UserService.deleteAll();
      navigate(`/admin/nuserview/${row?.id ?? 0}`);
    },
    [navigate]
  );

  const handleAddUser = useCallback(() => {
    navigate('/admin/nUser');
  }, [navigate]);

  return (
    <AppLayout>
      <PageHeader>
        <PageTitle>{CONSTANTS.LBL_ADMIN_SRCH_PAGE}</PageTitle>

        <PrimaryButton
          variant="contained"
          startIcon={<PersonAddAlt1Icon />}
          onClick={handleAddUser}
        >
          New User
        </PrimaryButton>
      </PageHeader>

      <FormContainer>
        <StyledSection>
          <CustomForm config={adminSearchConfig} onSubmit={handleSearch} />
        </StyledSection>

        <ReusableDataGrid data={users} loading={loading} onView={handleView} />
      </FormContainer>
    </AppLayout>
  );
};

export default AdminSrchPage;
