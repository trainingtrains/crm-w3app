import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import CustomForm from '../../layouts/CustomForm';
import { PrimaryButton } from '../../atoms/PrimaryButton';
import { PageTitle } from '../../atoms/PageTitle';
import { StyledSection } from '../../atoms/StyledSection';
import { CONSTANTS } from '../../constants';
import type { FormValues } from '../../layouts/CustomForm';
import { PageHeader } from '../../atoms/PageHeader';
import { FormContainer } from '../../atoms/FormContainer';
import AppLayout from '../../layouts/AppLayout';
import { adminSearchConfig } from './adminConfig';

const AdminSrchPage = () => {
    const navigate = useNavigate();


    const handleSearch = useCallback(async (form: FormValues) => {
        try {
            console.log(form);
        } catch (error) {
            console.error(error);
        }
    }, []);

    const handleAddUser = useCallback(() => {
        navigate('/nUser');
    }, [navigate]);

    const handleAddCompany = useCallback(() => {
        navigate('/nCompany');
    }, [navigate]);


    return (
        <><AppLayout>

            <PageHeader>
                <PageTitle>{CONSTANTS.LBL_ADMIN_SRCH_PAGE}</PageTitle>
                <PrimaryButton
                    variant="contained"
                    startIcon={<PersonAddAlt1Icon />}
                    onClick={handleAddUser}
                >
                    New User
                </PrimaryButton>
                <PrimaryButton
                    variant="contained"
                    startIcon={<PersonAddAlt1Icon />}
                    onClick={handleAddCompany}
                >
                    New Company
                </PrimaryButton>
            </PageHeader>

            <FormContainer>
                <StyledSection>
                    <CustomForm config={adminSearchConfig} onSubmit={handleSearch} />
                </StyledSection>

                {/* <ReusableDataGrid
          data={customerDetails}
          onExportCSV={handleExportCSV}
          onView={handleView}
        /> */}
            </FormContainer></AppLayout>
        </>
    );
};

export default AdminSrchPage;
