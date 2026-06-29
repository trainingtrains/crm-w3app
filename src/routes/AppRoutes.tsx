import { Routes, Route } from 'react-router-dom';
import CustomerSrchPage from '../pages/customer/CustomerSrchPage';
import NewCustomer from '../pages/customer/NewCustomer';
import CustomerDetailsPage from '../pages/customer/CustomerDetailsPage';
import EditCustomerPage from '../pages/customer/CustomerEditPage';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<CustomerSrchPage />} />
      <Route path="/newCust" element={<NewCustomer />} />
      <Route path="/custDetails/:id" element={<CustomerDetailsPage />} />
      <Route path="/custEdit/:id" element={<EditCustomerPage />} />
    </Routes>
  );
}
