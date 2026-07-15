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
import RouteGuard from '../components/RouteGuard';
import AccessDenied from '../pages/error/AccessDenied';

const LoginPage = lazy(() => import('../pages/loginpage/LoginPage'));
const CustomerSrchPage = lazy(() => import('../pages/customer/CustomerSrchPage'));
const NewCustomer = lazy(() => import('../pages/customer/NewCustomer'));
const CustomerDetailsPage = lazy(() => import('../pages/customer/CustomerDetailsPage'));
const EditCustomerPage = lazy(() => import('../pages/customer/CustomerEditPage'));
const TicketsPage = lazy(() => import('../pages/tickets/TicketsPage'));
const ReportsPage = lazy(() => import('../pages/reports/ReportsPage'));

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
              <RouteGuard permission="CUSTOMER_VIEW">
                <CustomerSrchPage />
              </RouteGuard>
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <RouteGuard permission="CUSTOMER_VIEW">
                <DashboardPage />
              </RouteGuard>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <RouteGuard permission="USER_VIEW">
                <AdminSrchPage />
              </RouteGuard>
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/nUser"
          element={
            <ProtectedRoute>
              <RouteGuard permission="USER_CREATE">
                <NewUserRegistration />
              </RouteGuard>
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/nuserview/:id"
          element={
            <ProtectedRoute>
              <RouteGuard permission="USER_VIEW">
                <UserDetailsPage />
              </RouteGuard>
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/nedituser/:id"
          element={
            <ProtectedRoute>
              <RouteGuard permission="USER_EDIT">
                <UserEditPage />
              </RouteGuard>
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
              <RouteGuard permission="CUSTOMER_CREATE">
                <NewCustomer />
              </RouteGuard>
            </ProtectedRoute>
          }
        />

        <Route
          path="/custDetails/:id"
          element={
            <ProtectedRoute>
              <RouteGuard permission="CUSTOMER_VIEW">
                <CustomerDetailsPage />
              </RouteGuard>
            </ProtectedRoute>
          }
        />

        <Route
          path="/custEdit/:id"
          element={
            <ProtectedRoute>
              <RouteGuard permission="CUSTOMER_EDIT">
                <EditCustomerPage />
              </RouteGuard>
            </ProtectedRoute>
          }
        />

        <Route
          path="/tickets"
          element={
            <ProtectedRoute>
              <RouteGuard permission="TICKET_VIEW">
                <TicketsPage />
              </RouteGuard>
            </ProtectedRoute>
          }
        />

        <Route
          path="/reports"
          element={
            <ProtectedRoute>
              <RouteGuard permission="REPORT_VIEW">
                <ReportsPage />
              </RouteGuard>
            </ProtectedRoute>
          }
        />

        <Route path="/access-denied" element={<AccessDenied />} />
      </Routes>
    </Suspense>
  );
}
