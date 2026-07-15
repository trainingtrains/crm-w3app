import { describe, it, expect } from 'vitest';
import { Roles } from '../roles';
import { hasPermission, hasRouteAccess } from '../permissions';

describe('RBAC Roles and Permissions Matrix', () => {
  it('should verify roles defined correctly', () => {
    expect(Roles.ADMIN).toBe('ADMIN');
    expect(Roles.MANAGER).toBe('MANAGER');
    expect(Roles.SUPPORT).toBe('SUPPORT');
    expect(Roles.VIEWER).toBe('VIEWER');
  });

  it('should verify admin has all permissions', () => {
    expect(hasPermission(Roles.ADMIN, 'USER_CREATE')).toBe(true);
    expect(hasPermission(Roles.ADMIN, 'USER_DELETE')).toBe(true);
    expect(hasPermission(Roles.ADMIN, 'CUSTOMER_CREATE')).toBe(true);
    expect(hasPermission(Roles.ADMIN, 'TICKET_EDIT')).toBe(true);
  });

  it('should verify manager has correct business permissions and lacks user deletion/creation', () => {
    expect(hasPermission(Roles.MANAGER, 'CUSTOMER_CREATE')).toBe(true);
    expect(hasPermission(Roles.MANAGER, 'USER_CREATE')).toBe(false);
    expect(hasPermission(Roles.MANAGER, 'USER_DELETE')).toBe(false);
  });

  it('should verify support user lacks user management and settings access', () => {
    expect(hasPermission(Roles.SUPPORT, 'CUSTOMER_VIEW')).toBe(true);
    expect(hasPermission(Roles.SUPPORT, 'USER_VIEW')).toBe(false);
    expect(hasPermission(Roles.SUPPORT, 'USER_CREATE')).toBe(false);
  });

  it('should verify viewer has read-only access and no write operations', () => {
    expect(hasPermission(Roles.VIEWER, 'CUSTOMER_VIEW')).toBe(true);
    expect(hasPermission(Roles.VIEWER, 'CUSTOMER_CREATE')).toBe(false);
    expect(hasPermission(Roles.VIEWER, 'TICKET_CREATE')).toBe(false);
  });

  it('should verify route accesses matching requirements', () => {
    expect(hasRouteAccess(Roles.ADMIN, '/admin')).toBe(true);
    expect(hasRouteAccess(Roles.SUPPORT, '/admin')).toBe(false);
    expect(hasRouteAccess(Roles.MANAGER, '/admin')).toBe(true);
  });
});
