import Paper from '@mui/material/Paper';
import { StyledSection } from '../../atoms/StyledSection';
import { PageTitle } from '../../atoms/PageTitle';
import { Form } from '../../components/CustomForm';
import { clientRequirementColumns } from './config/customerConfig';

export default function Register() {
 
  return (
 <Paper
      elevation={1}
      sx={{
        p: 2,
        borderRadius: 3,
      }}
    >
      <StyledSection>
        <PageTitle>
          Customer Entry
        </PageTitle>
      </StyledSection>

      {/* =======================================================
          SEARCH FORM
      ======================================================= */}

      <Paper
        elevation={1}
        sx={{
          p: 4,
          borderRadius: 3,
        }}
      >
        <Form config={clientRequirementColumns} onSubmit={()=>{}} submitLabel="Save" />
      </Paper></Paper>
  );
}
