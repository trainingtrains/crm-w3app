import { get, push, ref, remove, update } from 'firebase/database';
import { db } from '../db/firebase';
import type { FormValues } from '../layouts/CustomForm';
import { masterService } from './masterService';

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
  user?: User & { id: string };
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
}

export interface User {
  id?: string;
  userId: string;
  userName: string;
  mobile: string;
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

        await push(usersRef, {
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

          createdAt: now,
          updatedAt: now,
        });

        await masterService.seedMastersIfEmpty();

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
        isActive: 1,
        createdAt: now,
        updatedAt: now,
      });

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

            // Used only for sorting, removed before returning
            createdAt: user.createdAt ?? 0,
          };
        });

      // Always sort newest first
      users.sort((a, b) => b.createdAt - a.createdAt);

      const hasSearch =
        !!search.userId?.trim() || !!search.userName?.trim() || !!search.mobile?.trim();

      // No search criteria -> return all users
      if (!hasSearch) {
        return users.map(({ createdAt, ...user }) => user);
      }

      const userId = search.userId?.trim().toLowerCase() ?? '';
      const userName = search.userName?.trim().toLowerCase() ?? '';
      const mobile = search.mobile?.trim() ?? '';

      const filteredUsers = users.filter((user) => {
        const fullName = `${user.firstName} ${user.lastName ?? ''}`.trim().toLowerCase();

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
      };
    } catch (error) {
      console.error('Get User Error:', error);
      throw error;
    }
  },
  async delete(id: string): Promise<void> {
    try {
      const userRef = ref(db, `users/${id}`);

      const snapshot = await get(userRef);

      if (!snapshot.exists()) {
        throw new Error('User not found.');
      }

      await remove(userRef);
    } catch (error) {
      console.error('Delete User Error:', error);
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

        // Password fields are empty by default
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

      await update(userRef, {
        employeeId: user.employeeId,
        firstName: user.firstName,
        lastName: user.lastName ?? '',
        email: user.email ?? '',
        mobile: user.mobile,
        roleId: user.roleId,
        isActive: user.isActive,
        updatedAt: Date.now(),
      });
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
  async deleteAll(): Promise<void> {
    try {
      const usersRef = ref(db, 'users');
      const snapshot = await get(usersRef);

      if (!snapshot.exists()) {
        return;
      }

      await remove(usersRef);
    } catch (error) {
      console.error('Delete All Users Error:', error);
      throw error;
    }
  },
};

export default UserService;
