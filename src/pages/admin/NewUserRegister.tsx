import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

import { StyledSection } from '../../atoms/StyledSection';
import { PageTitle } from '../../atoms/PageTitle';
import { PageHeader } from '../../atoms/PageHeader';
import { FormContainer } from '../../atoms/FormContainer';

import AppLayout from '../../layouts/AppLayout';
import CustomForm, { type FormValues } from '../../layouts/CustomForm';

import { CONSTANTS } from '../../constants';
import { newUserRegistrationFields } from './adminConfig';


// import { companyService } from '../../services/companyService';
// import { roleService } from '../../services/roleService';
// import { userService } from '../../services/userService';

export default function NewUserPage() {
    const navigate = useNavigate();

    const handleSubmit = useCallback(
        async (form: FormValues) => {
            try {
                const payload: any = {
                    ...form,

                    companyId:
                        (form.companyId as { value: number | string } | null)?.value ??
                        form.companyId,

                    roleId:
                        (form.roleId as { value: number | string } | null)?.value ??
                        form.roleId,
                };
                console.log(payload)
                alert('User created successfully.');

                navigate(-1);
            } catch (error) {
                console.error(error);
                alert('Failed to create user.');
            }
        },
        [navigate]
    );

    return (
        <AppLayout>
            <StyledSection>
                <PageHeader>
                    <PageTitle>{CONSTANTS.LBL_NEW_USER}</PageTitle>
                </PageHeader>
            </StyledSection>

            <FormContainer>
                <CustomForm
                    config={newUserRegistrationFields}
                    onSubmit={handleSubmit}
                    submitLabel="Save"
                />
            </FormContainer>
        </AppLayout>
    );
}