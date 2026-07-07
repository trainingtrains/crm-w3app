import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { StyledSection } from '../../atoms/StyledSection';
import { PageTitle } from '../../atoms/PageTitle';

import DetailsView from '../../components/DetailsView';

import { CONSTANTS } from '../../constants';
import { customerDetailsConfig } from './config/customerConfig';
import { customerService } from '../../services/customerService';

const CustomerDetailsPage = () => {
  const { id } = useParams<{ id: string }>();

  const navigate = useNavigate();

  const [customer, setCustomer] = useState<any>(null);

  const loadCustomer = useCallback(async () => {
    if (!id) return;

    try {
      const response = await customerService.getById(id);
      setCustomer(response);
    } catch (error) {
      console.error('Unable to load customer.', error);
    }
  }, [id]);

  useEffect(() => {
    loadCustomer();
  }, [loadCustomer]);

  const handleDelete = useCallback(async () => {
    if (!id) return;

    try {
      await customerService.delete(id);

      alert('Customer deleted successfully.');

      navigate(-1);
    } catch (error) {
      console.error(error);
      alert('Unable to delete customer.');
    }
  }, [id, navigate]);

  const handleEdit = useCallback(() => {
    navigate(`/custEdit/${id}`);
  }, [id, navigate]);

  if (!customer) {
    return null;
  }

  return (
    <>
      <StyledSection>
        <PageTitle>{CONSTANTS.LBL_CRM_CUST_DETAILS}</PageTitle>

        <DetailsView
          config={customerDetailsConfig}
          data={customer}
          actionLabel="Edit"
          negativeLabel="Delete"
          onActionClick={handleEdit}
          onNegativeClick={handleDelete}
        />
      </StyledSection>
    </>
  );
};

export default CustomerDetailsPage;
