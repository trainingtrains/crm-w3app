import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';

import ProtectedRoute from '../components/ProtectedRoute';
import PublicRoute from '../components/PublicRoute';
import LazyLoader from '../components/LazyLoader';

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