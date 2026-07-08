import { StyledSection } from '../atoms/StyledSection';
import { PageHeader } from '../atoms/PageHeader';
import { PageTitle } from '../atoms/PageTitle';
import { FormContainer } from '../atoms/FormContainer';
import CustomForm from './CustomForm';


const FormPanel = ({ title, config, handleSubmit, submitLabel }) => {


  return (
    <>
      <FormContainer>
        <StyledSection>
          <PageHeader>
            <PageTitle>{title}</PageTitle>
          </PageHeader>
        </StyledSection>
        <CustomForm config={config} onSubmit={handleSubmit} submitLabel={submitLabel} />
      </FormContainer>
    </>
  );
};

export default FormPanel;
