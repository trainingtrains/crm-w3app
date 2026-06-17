import { Routes, Route } from 'react-router-dom';
import CustomerSrchPage from '../pages/customer/CustomerSrchPage';
import NewCustomer from '../pages/customer/NewCustomer';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<CustomerSrchPage />} />

      <Route path="/newCust" element={<NewCustomer />} />
    </Routes>
  );
}
