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

import { adminSearchConfig } from './adminConfig';

import UserService, { type UserSearchResponse } from '../../services/userService';
import { useLanguage } from '../../context/LanguageContext';
import { usePermission } from '../../auth/usePermission';

const AdminSrchPage = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { hasPermission } = usePermission();

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
        <PageTitle>{t('employees')}</PageTitle>

        {hasPermission('USER_CREATE') && (
          <PrimaryButton
            variant="contained"
            startIcon={<PersonAddAlt1Icon />}
            onClick={handleAddUser}
          >
            {t('addNew')}
          </PrimaryButton>
        )}
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
