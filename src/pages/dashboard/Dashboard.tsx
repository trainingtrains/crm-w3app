import { Typography } from '@mui/material';

import AppLayout from '../../layouts/AppLayout';

import { PageHeader } from '../../atoms/PageHeader';
import { PageTitle } from '../../atoms/PageTitle';
import { FormContainer } from '../../atoms/FormContainer';
import { StyledSection } from '../../atoms/StyledSection';

const DashboardPage = () => {
    return (
        <AppLayout>
            <PageHeader>
                <PageTitle>Dashboard</PageTitle>
            </PageHeader>

            <FormContainer>
                <StyledSection>
                    <Typography variant="h5" sx={{ fontWeight: 600 }} gutterBottom>
                        Welcome to Dashboard
                    </Typography>

                    <Typography variant="body1" color="text.secondary">
                        Manage companies, users, roles, permissions, and other administrative
                        activities from this dashboard.
                    </Typography>
                </StyledSection>
            </FormContainer>
        </AppLayout>
    );
};

export default DashboardPage;