import { Roles } from './roles';

export const permissions = {
  // User Management
  USER_VIEW: [Roles.ADMIN, Roles.MANAGER, Roles.VIEWER],
  USER_CREATE: [Roles.ADMIN],
  USER_EDIT: [Roles.ADMIN],
  USER_DELETE: [Roles.ADMIN],

  // Customer Management
  CUSTOMER_VIEW: [Roles.ADMIN, Roles.MANAGER, Roles.SUPPORT, Roles.VIEWER],
  CUSTOMER_CREATE: [Roles.ADMIN, Roles.MANAGER, Roles.SUPPORT],
  CUSTOMER_EDIT: [Roles.ADMIN, Roles.MANAGER, Roles.SUPPORT],
  CUSTOMER_DELETE: [Roles.ADMIN],

  // Ticket Management
  TICKET_VIEW: [Roles.ADMIN, Roles.MANAGER, Roles.SUPPORT, Roles.VIEWER],
  TICKET_CREATE: [Roles.ADMIN, Roles.MANAGER, Roles.SUPPORT],
  TICKET_ASSIGN: [Roles.ADMIN, Roles.MANAGER],
  TICKET_EDIT: [Roles.ADMIN, Roles.MANAGER, Roles.SUPPORT],
  TICKET_DELETE: [Roles.ADMIN],

  // Payment Tracking
  PAYMENT_VIEW: [Roles.ADMIN, Roles.MANAGER, Roles.VIEWER],
  PAYMENT_MANAGE: [Roles.ADMIN, Roles.MANAGER],

  // Reports
  REPORT_VIEW: [Roles.ADMIN, Roles.MANAGER, Roles.VIEWER],
  REPORT_EXPORT: [Roles.ADMIN, Roles.MANAGER],

  // Settings & Configuration
  SETTINGS_ACCESS: [Roles.ADMIN],
  MASTERS_MANAGE: [Roles.ADMIN],
  AUDIT_LOGS_VIEW: [Roles.ADMIN],
};

export type PermissionKey = keyof typeof permissions;

export function hasPermission(role: string | undefined, permission: PermissionKey): boolean {
  if (!role) return false;
  // Convert standard role formats (lowercase/uppercase/index representation)
  const normRole = String(role).toUpperCase();
  const allowedRoles = permissions[permission] as readonly string[];
  return allowedRoles ? allowedRoles.includes(normRole) : false;
}

const ROUTE_PERMISSION_MAP: Record<string, PermissionKey> = {
  '/admin': 'USER_VIEW',
  '/admin/nUser': 'USER_CREATE',
  '/newCust': 'CUSTOMER_CREATE',
  '/tickets': 'TICKET_VIEW',
  '/crm': 'CUSTOMER_VIEW',
  '/dashboard': 'CUSTOMER_VIEW',
};

export function hasRouteAccess(role: string | undefined, path: string): boolean {
  const matchedKey = Object.keys(ROUTE_PERMISSION_MAP).find(
    (prefix) => path === prefix || path.startsWith(prefix + '/')
  );
  if (!matchedKey) return true;
  return hasPermission(role, ROUTE_PERMISSION_MAP[matchedKey]);
}
