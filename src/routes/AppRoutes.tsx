import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';

import ProtectedRoute from '../components/ProtectedRoute';
import PublicRoute from '../components/PublicRoute';
import LazyLoader from '../components/LazyLoader';
import AdminSrchPage from '../pages/admin/AdminPanel';
import NewUserRegistration from '../pages/admin/NewUserRegister';

import DashboardPage from '../pages/dashboard/Dashboard';
import UserDetailsPage from '../pages/admin/UserDetailsPage';
import UserEditPage from '../pages/admin/UserEditPage';
import ProfilePage from '../pages/admin/ProfilePage';

const LoginPage = lazy(() => import('../pages/loginpage/LoginPage'));
const CustomerSrchPage = lazy(() => import('../pages/customer/CustomerSrchPage'));
const NewCustomer = lazy(() => import('../pages/customer/NewCustomer'));
const CustomerDetailsPage = lazy(() => import('../pages/customer/CustomerDetailsPage'));
const EditCustomerPage = lazy(() => import('../pages/customer/CustomerEditPage'));
const TicketsPage = lazy(() => import('../pages/tickets/TicketsPage'));

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
          path="/admin/nUser"
          element={
            <ProtectedRoute>
              <NewUserRegistration />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/nuserview/:id"
          element={
            <ProtectedRoute>
              <UserDetailsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/nedituser/:id"
          element={
            <ProtectedRoute>
              <UserEditPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
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

        <Route
          path="/tickets"
          element={
            <ProtectedRoute>
              <TicketsPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Suspense>
  );
}
