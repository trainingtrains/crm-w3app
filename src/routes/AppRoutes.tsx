import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';

import ProtectedRoute from '../components/ProtectedRoute';
import PublicRoute from '../components/PublicRoute';
import LazyLoader from '../components/LazyLoader';
import AdminSrchPage from '../pages/admin/AdminPanel';
import NewUserRegistration from '../pages/admin/NewUserRegister'
import NewCompanyPage from '../pages/admin/NewCompanyRegister';
import DashboardPage from '../pages/dashboard/Dashboard';

const LoginPage = lazy(() => import('../pages/loginpage/LoginPage'));
const CustomerSrchPage = lazy(() => import('../pages/customer/CustomerSrchPage'));
const NewCustomer = lazy(() => import('../pages/customer/NewCustomer'));
const CustomerDetailsPage = lazy(() => import('../pages/customer/CustomerDetailsPage'));
const EditCustomerPage = lazy(() => import('../pages/customer/CustomerEditPage'));


export default function AppRoutes() {
  return (
    <Suspense fallback={<LazyLoader />}>
      <Routes>
        <Route
          path="/"
          element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          }
        />

        <Route
          path="/crm"
          element={
            <ProtectedRoute>
              <CustomerSrchPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminSrchPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/nUser"
          element={
            <ProtectedRoute>
              <NewUserRegistration />
            </ProtectedRoute>
          }
        />
        <Route
          path="/ncompany"
          element={
            <ProtectedRoute>
              <NewCompanyPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/newCust"
          element={
            <ProtectedRoute>
              <NewCustomer />
            </ProtectedRoute>
          }
        />

        <Route
          path="/custDetails/:id"
          element={
            <ProtectedRoute>
              <CustomerDetailsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/custEdit/:id"
          element={
            <ProtectedRoute>
              <EditCustomerPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Suspense>
  );
}