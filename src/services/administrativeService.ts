import { get, push, ref } from 'firebase/database';
import { db } from '../db/firebase';

export interface Administration {
  adminId?: string;
  username: string;
  password: string;
  name?: string;
  role?: string;
  createdAt?: number;
  updatedAt?: number;
}

const AdministrationService  = {
  async login(username: string, password: string) {
    try {
      const administrationRef = ref(db, 'administration');
      const snapshot = await get(administrationRef);

      if (!snapshot.exists()) {
        throw new Error('No administrator found.');
      }

      const administrations = snapshot.val();

      const adminEntry = Object.entries(administrations).find(
        ([, value]) => {
          const admin = value as Administration;

          return (
            admin.username.trim().toLowerCase() ===
              username.trim().toLowerCase() &&
            admin.password === password
          );
        }
      );

      if (!adminEntry) {
        throw new Error('Invalid username or password.');
      }

      const [id, admin] = adminEntry as [string, Administration];

      return {
        id,
        ...admin,
      };
    } catch (error) {
      console.error('Administration Login Error:', error);
      throw error;
    }
  }, 

  async create(admin: Administration) {
    try {
      const administrationRef = ref(db, 'administration');
      const snapshot = await get(administrationRef);

      const administrations = snapshot.exists() ? snapshot.val() : {};

      const exists = Object.values(administrations).some((item) => {
        const value = item as Administration;

        return (
          value.username.trim().toLowerCase() ===
          admin.username.trim().toLowerCase()
        );
      });

      if (exists) {
        throw new Error('Username already exists.');
      }

      const now = Date.now();

      const adminRef = await push(administrationRef, {
        username: admin.username.trim(),
        password: admin.password,
        name: admin.name ?? '',
        role: admin.role ?? 'ADMIN',
        createdAt: now,
        updatedAt: now,
      });

      return {
        id: adminRef.key,
      };
    } catch (error) {
      console.error('Create Administration Error:', error);
      throw error;
    }
  }
}

export default AdministrationService;