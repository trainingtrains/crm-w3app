import { useAuth } from '../context/AuthContext';
import { hasPermission, type PermissionKey } from './permissions';

export function usePermission() {
  const { user, loading } = useAuth();
  const role = user?.role;

  const isReadOnly = role === 'VIEWER';

  const checkPermission = (permission: PermissionKey): boolean => {
    return hasPermission(role, permission);
  };

  return {
    role,
    user,
    loading,
    isReadOnly,
    hasPermission: checkPermission,
  };
}
