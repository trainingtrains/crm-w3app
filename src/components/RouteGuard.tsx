import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { usePermission } from '../auth/usePermission';
import { type PermissionKey } from '../auth/permissions';
import { auditService } from '../services/auditService';

interface RouteGuardProps {
  children: React.ReactNode;
  permission: PermissionKey;
}

const RouteGuard = ({ children, permission }: RouteGuardProps) => {
  const { hasPermission, role, user, loading } = usePermission();

  const isAuthorized = hasPermission(permission);

  useEffect(() => {
    if (!loading && !isAuthorized && user) {
      auditService.logEvent(
        user.username,
        role || 'GUEST',
        `Unauthorized access attempt: Missing ${permission}`,
        'RouteGuard'
      );
    }
  }, [isAuthorized, loading, user, role, permission]);

  if (loading) {
    return null;
  }

  if (!isAuthorized) {
    return <Navigate to="/access-denied" replace />;
  }

  return <>{children}</>;
};

export default RouteGuard;
