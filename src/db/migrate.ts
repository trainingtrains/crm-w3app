import { ref, get, update } from 'firebase/database';
import { db } from './firebase';

export async function runMigration() {
  try {
    // Migration for Users
    const usersRef = ref(db, 'users');
    const usersSnapshot = await get(usersRef);
    if (usersSnapshot.exists()) {
      const users = usersSnapshot.val();
      const updates: any = {};
      Object.entries(users).forEach(([id, u]: any) => {
        if (u.status === undefined) {
          updates[`users/${id}/status`] = 'ACTIVE';
          updates[`users/${id}/serviceStartDate`] = u.createdAt || Date.now();
          updates[`users/${id}/serviceEndDate`] = null;
        }
      });
      if (Object.keys(updates).length > 0) {
        await update(ref(db), updates);
        console.log('User records migrated successfully:', Object.keys(updates).length);
      }
    }

    // Migration for Customers
    const customersRef = ref(db, 'customers');
    const customersSnapshot = await get(customersRef);
    if (customersSnapshot.exists()) {
      const customers = customersSnapshot.val();
      const updates: any = {};
      Object.entries(customers).forEach(([id, c]: any) => {
        if (c.status === undefined) {
          updates[`customers/${id}/status`] = 'ACTIVE';
          updates[`customers/${id}/serviceStartDate`] = c.createdAt || Date.now();
          updates[`customers/${id}/serviceEndDate`] = null;
        }
      });
      if (Object.keys(updates).length > 0) {
        await update(ref(db), updates);
        console.log('Customer records migrated successfully:', Object.keys(updates).length);
      }
    }
  } catch (error) {
    console.error('Migration failed:', error);
  }
}
