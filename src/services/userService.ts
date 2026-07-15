import { get, push, ref, update } from 'firebase/database';
import { db } from '../db/firebase';
import type { FormValues } from '../layouts/CustomForm';
import { masterService } from './masterService';
import { timelineService } from './timelineService';

export interface User {
  id?: string;
  username: string;
  password: string;
  name?: string;
  role?: string;
  createdAt?: number;
  updatedAt?: number;
}

export interface LoginResponse {
  success: boolean;
  adminCreated?: boolean;
  message?: string;
  user?: User & { id: string; employeeId?: string; userName?: string; firstName?: string; lastName?: string; roleId?: string };
}

export interface User {
  id?: string;
  employeeId: string;
  firstName: string;
  lastName?: string;
  userName: string;
  email?: string;
  mobile: string;
  roleId: string;
  mustChangePassword?: boolean;
  isActive?: boolean;
  status?: string;
  serviceStartDate?: number;
  serviceEndDate?: number | null;
  deactivatedBy?: string;
  deactivationReason?: string;
  createdAt?: number;
  updatedAt?: number;
}

export interface CreateUserResponse {
  success: boolean;
  message: string;
  userId?: string;
  defaultPassword?: string;
}

export interface UserSearchRequest {
  userId?: string;
  userName?: string;
  mobile?: string;
  status?: string; // 'ALL' | 'ACTIVE' | 'INACTIVE'
  role?: string; // role filter
  serviceStartDate?: string | null;
  serviceEndDate?: string | null;
  requestorRole?: string;
}

export interface UserSearchResponse {
  id: string;
  employeeId: string;
  firstName: string;
  lastName?: string;
  userName: string;
  email?: string;
  mobile: string;
  roleId: string;
  isActive: boolean;
  status?: string;
  serviceStartDate?: number | null;
  serviceEndDate?: number | null;
  deactivatedBy?: string;
  deactivationReason?: string;
}

export type UserDetailsResponse = Record<string, any>;

const UserService = {
  async login(username: string, password: string): Promise<LoginResponse> {
    try {
      const usersRef = ref(db, 'users');
      const snapshot = await get(usersRef);

      // First-time application setup
      if (!snapshot.exists()) {
        const now = Date.now();

        const newAdmin = await push(usersRef, {
          employeeId: 'ADMIN',
          firstName: 'Administrator',
          lastName: '',
          userName: 'admin',
          password: 'admin123',
          email: '',
          mobile: '',
          roleId: 'admin',
          mustChangePassword: false,
          isActive: true,
          status: 'ACTIVE',
          serviceStartDate: now,
          serviceEndDate: null,
          createdAt: now,
          updatedAt: now,
        });

        await masterService.seedMastersIfEmpty();
        await timelineService.logEvent(newAdmin.key!, 'User Created', 'System Administrator account provisioned');

        return {
          success: true,
          adminCreated: true,
          message: 'Admin user created.',
        };
      }

      const users = snapshot.val();

      const userEntry = Object.entries(users).find(([, value]) => {
        const user = value as User;

        return (
          user.userName.trim().toLowerCase() === username.trim().toLowerCase() &&
          user.password === password
        );
      });

      if (!userEntry) {
        throw new Error('Invalid username or password.');
      }

      const [id, user] = userEntry as [string, User];

      await masterService.seedMastersIfEmpty();

      return {
        success: true,
        user: {
          id,
          ...user,
        },
      };
    } catch (error) {
      console.error('Login Error:', error);
      throw error;
    }
  },

  async create(user: User): Promise<CreateUserResponse> {
    try {
      const usersRef = ref(db, 'users');
      const snapshot = await get(usersRef);

      const users = snapshot.exists() ? snapshot.val() : {};

      // Check duplicate username
      const userExists = Object.values(users).some((item) => {
        const value = item as User;
        return value.userName.trim().toLowerCase() === user.userName.trim().toLowerCase();
      });

      if (userExists) {
        throw new Error('Username already exists.');
      }

      // Check duplicate employee id
      const employeeExists = Object.values(users).some((item) => {
        const value = item as User;
        return value.employeeId.trim().toLowerCase() === user.employeeId.trim().toLowerCase();
      });

      if (employeeExists) {
        throw new Error('Employee ID already exists.');
      }

      // Generate default password
      const defaultPassword = `${user.firstName.trim().substring(0, 2)}${user.mobile.replace(/\D/g, '').slice(-4)}`;

      const now = Date.now();

      const newUserRef = await push(usersRef, {
        employeeId: user.employeeId.trim(),
        firstName: user.firstName.trim(),
        lastName: user.lastName?.trim() ?? '',
        userName: user.userName.trim(),
        email: user.email?.trim() ?? '',
        mobile: user.mobile.trim(),
        roleId: user.roleId,
        password: defaultPassword,
        mustChangePassword: true,
        isActive: true,
        status: 'ACTIVE',
        serviceStartDate: now,
        serviceEndDate: null,
        createdAt: now,
        updatedAt: now,
      });

      await timelineService.logEvent(newUserRef.key!, 'User Created', 'Employee registered in the system');

      return {
        success: true,
        message: 'User created successfully.',
        userId: newUserRef.key ?? undefined,
        defaultPassword,
      };
    } catch (error) {
      console.error('Create User Error:', error);
      throw error;
    }
  },

  async search(search: UserSearchRequest): Promise<UserSearchResponse[]> {
    try {
      const usersRef = ref(db, 'users');
      const snapshot = await get(usersRef);

      if (!snapshot.exists()) {
        return [];
      }

      const requestorRole = search.requestorRole || 'ADMIN';
      const filterStatus = search.status || 'ALL';
      const filterRole = search.role || '';
      const filterStartDate = search.serviceStartDate || null;
      const filterEndDate = search.serviceEndDate || null;

      const users = Object.entries(snapshot.val())
        .filter(([_, value]) => {
          const user = value as User;
          return user.roleId?.trim().toLowerCase() !== 'admin';
        })
        .map(([id, value]) => {
          const user = value as User;
          return {
            id,
            employeeId: user.employeeId,
            firstName: user.firstName,
            lastName: user.lastName,
            userName: user.userName,
            email: user.email,
            mobile: user.mobile,
            roleId: user.roleId,
            isActive: user.isActive ?? true,
            status: user.status || 'ACTIVE',
            serviceStartDate: user.serviceStartDate || user.createdAt || null,
            serviceEndDate: user.serviceEndDate || null,
            deactivatedBy: user.deactivatedBy || '',
            deactivationReason: user.deactivationReason || '',
            createdAt: user.createdAt ?? 0,
          };
        });

      // Sort newest first
      users.sort((a, b) => b.createdAt - a.createdAt);

      const userId = search.userId?.trim().toLowerCase() ?? '';
      const userName = search.userName?.trim().toLowerCase() ?? '';
      const mobile = search.mobile?.trim() ?? '';

      const filteredUsers = users.filter((user) => {
        const fullName = `${user.firstName} ${user.lastName ?? ''}`.trim().toLowerCase();
        
        // Visibility rules checks
        if (requestorRole === 'VIEWER' && user.status !== 'ACTIVE') {
          return false;
        }

        // Apply filters
        if (filterStatus === 'ACTIVE' && user.status !== 'ACTIVE') return false;
        if (filterStatus === 'INACTIVE' && user.status !== 'INACTIVE') return false;
        if (filterRole && user.roleId !== filterRole) return false;
        
        if (filterStartDate && user.serviceStartDate && user.serviceStartDate < new Date(filterStartDate).getTime()) {
          return false;
        }
        if (filterEndDate && user.serviceEndDate && user.serviceEndDate > new Date(filterEndDate).getTime()) {
          return false;
        }

        const matchEmployeeId = !userId || user.employeeId.toLowerCase().includes(userId);
        const matchUserName =
          !userName ||
          user.userName.toLowerCase().includes(userName) ||
          fullName.includes(userName);
        const matchMobile = !mobile || user.mobile.includes(mobile);

        return matchEmployeeId && matchUserName && matchMobile;
      });

      return filteredUsers.map(({ createdAt, ...user }) => user);
    } catch (error) {
      console.error('Search Users Error:', error);
      throw error;
    }
  },

  async getById(id: string): Promise<UserDetailsResponse> {
    try {
      const snapshot = await get(ref(db, `users/${id}`));

      if (!snapshot.exists()) {
        throw new Error('User not found.');
      }

      const user = snapshot.val() as User;

      return {
        id,
        employeeId: user.employeeId,
        firstName: user.firstName,
        lastName: user.lastName,
        userName: user.userName,
        email: user.email,
        mobile: user.mobile,
        roleId: user.roleId,
        isActive: user.isActive ?? true,
        status: user.status || 'ACTIVE',
        serviceStartDate: user.serviceStartDate || user.createdAt || null,
        serviceEndDate: user.serviceEndDate || null,
        deactivatedBy: user.deactivatedBy || '',
        deactivationReason: user.deactivationReason || '',
      };
    } catch (error) {
      console.error('Get User Error:', error);
      throw error;
    }
  },

  async delete(id: string, deactivatedBy: string = 'System', deactivationReason: string = 'Requested deactivation'): Promise<void> {
    try {
      const userRef = ref(db, `users/${id}`);
      const snapshot = await get(userRef);

      if (!snapshot.exists()) {
        throw new Error('User not found.');
      }

      const now = Date.now();
      await update(userRef, {
        status: 'INACTIVE',
        serviceEndDate: now,
        deactivatedBy,
        deactivationReason,
        isActive: false,
        updatedAt: now,
      });

      await timelineService.logEvent(id, 'User Deactivated', `Deactivated by ${deactivatedBy}. Reason: ${deactivationReason}`);
    } catch (error) {
      console.error('Delete User Error:', error);
      throw error;
    }
  },

  async activate(id: string): Promise<void> {
    try {
      const userRef = ref(db, `users/${id}`);
      const snapshot = await get(userRef);

      if (!snapshot.exists()) {
        throw new Error('User not found.');
      }

      const now = Date.now();
      await update(userRef, {
        status: 'ACTIVE',
        serviceStartDate: now,
        serviceEndDate: null,
        deactivatedBy: '',
        deactivationReason: '',
        isActive: true,
        updatedAt: now,
      });

      await timelineService.logEvent(id, 'User Activated', 'Status restored to ACTIVE');
    } catch (error) {
      console.error('Activate User Error:', error);
      throw error;
    }
  },

  async getProfile(userId: string): Promise<FormValues> {
    try {
      const userRef = ref(db, `users/${userId}`);
      const snapshot = await get(userRef);

      if (!snapshot.exists()) {
        throw new Error('User not found.');
      }

      const user = snapshot.val() as User;

      return {
        employeeId: user.employeeId,
        firstName: user.firstName,
        lastName: user.lastName ?? '',
        userName: user.userName,
        roleId: user.roleId,
        email: user.email ?? '',
        mobile: user.mobile,
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      };
    } catch (error) {
      console.error('Get Profile Error:', error);
      throw error;
    }
  },

  async update(id: string, user: Partial<User>): Promise<void> {
    try {
      const userRef = ref(db, `users/${id}`);
      const snapshot = await get(userRef);

      if (!snapshot.exists()) {
        throw new Error('User not found.');
      }

      const oldUser = snapshot.val() as User;
      const now = Date.now();

      await update(userRef, {
        employeeId: user.employeeId,
        firstName: user.firstName,
        lastName: user.lastName ?? '',
        email: user.email ?? '',
        mobile: user.mobile,
        roleId: user.roleId,
        isActive: user.isActive,
        updatedAt: now,
      });

      // Log promotions or timeline details changes
      if (oldUser.roleId !== user.roleId) {
        await timelineService.logEvent(id, 'Role Updated', `Promoted/Moved from ${oldUser.roleId} to ${user.roleId}`);
      } else {
        await timelineService.logEvent(id, 'Details Updated', 'User profile information updated');
      }
    } catch (error) {
      console.error('Update User Error:', error);
      throw error;
    }
  },

  async updateProfile(id: string, form: FormValues): Promise<void> {
    const userRef = ref(db, `users/${id}`);
    const snapshot = await get(userRef);

    if (!snapshot.exists()) {
      throw new Error('User not found.');
    }

    const user = snapshot.val() as User;

    if (user.password !== form.currentPassword) {
      throw new Error('Current password is incorrect.');
    }

    if (form.newPassword !== form.confirmPassword) {
      throw new Error('New password and confirm password do not match.');
    }

    await update(userRef, {
      email: form.email,
      mobile: form.mobile,
      password: form.newPassword,
      mustChangePassword: false,
      updatedAt: Date.now(),
    });
  },
};

export default UserService;
