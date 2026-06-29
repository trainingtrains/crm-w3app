import { StyledSection } from '../../atoms/StyledSection';
import { PageTitle } from '../../atoms/PageTitle';
import Form, { type FormValues } from '../../components/CustomForm';
import { newClientRegistrFields as clientRequirementColumns } from './config/customerConfig';
import { useEffect, useMemo, useState } from 'react';
import { masterService } from '../../services/masterService';
import { CONSTANTS } from '../../constants';
import { customerService } from '../../services/customerService';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

export default function Register() {

  const navigate = useNavigate()

 
    const { reset } = useForm<FormValues>();
     const [cities, setCities] = useState<any[]>([]);

  useEffect(() => {
    loadCities();
  }, []);

  const loadCities = async () => {
    const data = await masterService.getCities();
    setCities(data);
  };

  const loadFormFields = useMemo(() => {
    return clientRequirementColumns.map((field) => {
      if (field.type !== "select" && field.type !== "autocomplete") {
        return field;
      }

      switch (field.name) {
        case CONSTANTS.KEY_CITY:
          return {
            ...field,
            options: cities,
          };

        // case CONSTANTS.KEY_PROJECT_TYPE:
        //     return {
        //         ...field,
        //         options: projectTypes,
        //     };

        // case CONSTANTS.KEY_STATUS:
        //     return {
        //         ...field,
        //         options: statuses,
        //     };

        default:
          return field;
      }
    });
  }, [cities]);

  const onHandleSubmit = async (data: any) => {
    try {

      await customerService.create(data);

      alert("Customer created successfully");

       reset(); // react-hook-form reset if needed
       navigate(-1); // if using react-router
    } catch (error: any) {
      console.error(error);
      alert(error.message || "Failed to create customer");
    }
  };

  return (
    <><StyledSection>
      <PageTitle>
        {CONSTANTS.LBL_CRM_NEW_ENTRY}
      </PageTitle>
    </StyledSection>

      <Form config={loadFormFields} onSubmit={onHandleSubmit} submitLabel="Save" />
    </>
  );
}
