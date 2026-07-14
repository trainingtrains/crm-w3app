import { get, ref, set, push } from 'firebase/database';
import { db } from '../db/firebase';

export const masterService = {
  async addCity(name: string) {
    const citiesRef = ref(db, 'masters/cities');
    const newCityRef = push(citiesRef);
    await set(newCityRef, { name });
    return {
      value: newCityRef.key,
      label: name,
    };
  },

  async getCities() {
    const snapshot = await get(ref(db, 'masters/cities'));

    if (!snapshot.exists()) return [];

    return Object.entries(snapshot.val()).map(([key, value]: any) => ({
      value: key,
      label: value.name,
    }));
  },

  async getProjectTypes() {
    const snapshot = await get(ref(db, 'masters/projectTypes'));

    if (!snapshot.exists()) return [];

    return Object.entries(snapshot.val()).map(([key, value]: any) => ({
      value: key,
      label: value.label,
    }));
  },

  async getEnquiryStatus() {
    const snapshot = await get(ref(db, 'masters/enquiryStatus'));

    if (!snapshot.exists()) return [];

    return Object.entries(snapshot.val()).map(([key, value]: any) => ({
      value: key,
      label: value.label,
    }));
  },

  async seedMastersIfEmpty() {
    try {
      // Seed cities
      const citiesRef = ref(db, 'masters/cities');
      const citiesSnapshot = await get(citiesRef);
      if (!citiesSnapshot.exists()) {
        const defaultCities = {
          city1: { name: 'Chennai' },
          city2: { name: 'Bangalore' },
          city3: { name: 'Hyderabad' },
          city4: { name: 'Mumbai' },
          city5: { name: 'Pune' },
          city6: { name: 'Delhi' },
          city7: { name: 'Kolkata' },
        };
        await set(citiesRef, defaultCities);
      }

      // Seed project types
      const projectTypesRef = ref(db, 'masters/projectTypes');
      const projectTypesSnapshot = await get(projectTypesRef);
      if (!projectTypesSnapshot.exists()) {
        const defaultProjectTypes = {
          pt1: { label: 'Web Application' },
          pt2: { label: 'Mobile Application' },
          pt3: { label: 'Desktop Application' },
          pt4: { label: 'ERP / CRM' },
          pt5: { label: 'E-Commerce' },
          pt6: { label: 'API Development' },
          pt7: { label: 'Enhancement' },
          pt8: { label: 'Other' },
        };
        await set(projectTypesRef, defaultProjectTypes);
      }

      // Seed enquiry statuses
      const enquiryStatusRef = ref(db, 'masters/enquiryStatus');
      const enquiryStatusSnapshot = await get(enquiryStatusRef);
      if (!enquiryStatusSnapshot.exists()) {
        const defaultEnquiryStatuses = {
          es1: { label: 'New' },
          es2: { label: 'Requirement Gathering' },
          es3: { label: 'Proposal Sent' },
          es4: { label: 'Negotiation' },
          es5: { label: 'Approved' },
          es6: { label: 'Development' },
          es7: { label: 'On Hold' },
          es8: { label: 'Rejected' },
        };
        await set(enquiryStatusRef, defaultEnquiryStatuses);
      }
    } catch (error) {
      console.error('Error seeding master database:', error);
    }
  },
};
