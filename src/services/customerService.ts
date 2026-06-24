// src/services/customerService.ts

import {
  get,
  push,
  ref,
  update,
  remove,
} from "firebase/database";
import { db } from "../db/firebase";


export const customerService = {

  async create(customer: any) {
    try {
      // Check existing customer
      const customerSnapshot = await get(ref(db, "customers"));

      let customers: any = {};

      if (customerSnapshot.exists()) {
        customers = customerSnapshot.val();

        const existingCustomer = Object.values(customers).find(
          (c: any) =>
            c.companyName?.trim().toLowerCase() ===
            customer.companyName?.trim().toLowerCase() &&
            c.contactPerson?.trim().toLowerCase() ===
            customer.contactPerson?.trim().toLowerCase() &&
            c.mobile?.trim() === customer.mobile?.trim()
        );

        if (existingCustomer) {
          throw new Error(
            "Customer already exists with the same Company Name, Contact Person and Mobile Number."
          );
        }
      }

      // Generate Customer ID
      const prefix = "TTCL";

      const maxNumber = Object.values(customers).reduce(
        (max: number, c: any) => {
          const id = c.customerId || "";

          if (id.startsWith(prefix)) {
            const num = parseInt(id.replace(prefix, ""), 10);
            return Math.max(max, isNaN(num) ? 0 : num);
          }

          return max;
        },
        0
      );

      const customerId = `${prefix}${String(maxNumber + 1).padStart(4, "0")}`;

      // Find/Create City
      let cityId = "";

      if (customer.city?.trim()) {
        const cityName = customer.city.trim();

        const citySnapshot = await get(ref(db, "masters/cities"));

        if (citySnapshot.exists()) {
          const cities = citySnapshot.val();

          const existingCity = Object.entries(cities).find(
            ([_, city]: any) =>
              city.name?.trim().toLowerCase() === cityName.toLowerCase()
          );

          if (existingCity) {
            cityId = existingCity[0];
          }
        }

        // Create city if not found
        if (!cityId) {
          const cityRef = await push(ref(db, "masters/cities"), {
            name: cityName,
            createdAt: Date.now(),
            updatedAt: Date.now(),
          });

          cityId = cityRef.key || "";
        }
      }

      // Remove city string
      const { city, ...customerData } = customer;

      // Save customer
      const customerRef = await push(ref(db, "customers"), {
        customerId,
        ...customerData,
        cityId,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });

      return {
        id: customerRef.key,
        customerId,
      };

    } catch (error) {
      console.error("Create Customer Error:", error);
      throw error;
    }
  },

  async searchCustomers(filters: {
    custId?: string;
    custName?: string;
    mobile?: string;
    city?: string;
  }) {
    const snapshot = await get(ref(db, "customers"));

    if (!snapshot.exists()) return [];

    const customers = Object.entries(snapshot.val()).map(
      ([key, value]: any) => ({
        id: key,
        ...value,
      })
    );

    const filteredCustomers = customers.filter(
      (customer: any) => {
        const matchCustId =
          !filters.custId ||
          customer.customerId
            ?.toLowerCase()
            .includes(filters.custId.toLowerCase());

        const matchCustName =
          !filters.custName ||
          customer.companyName
            ?.toLowerCase()
            .includes(filters.custName.toLowerCase()) ||
          customer.contactPerson
            ?.toLowerCase()
            .includes(filters.custName.toLowerCase());

        const matchMobile =
          !filters.mobile ||
          customer.mobile?.includes(filters.mobile);

        const matchCity =
          !filters.city ||
          customer.cityId === filters.city;

        return (
          matchCustId &&
          matchCustName &&
          matchMobile &&
          matchCity
        );
      }
    );

    return filteredCustomers.sort(
      (a: any, b: any) =>
        (b.createdAt || 0) - (a.createdAt || 0)
    );
  },

  async update(id: string, customer: any) {
    return update(
      ref(db, `customers/${id}`),
      {
        ...customer,
        updatedAt: Date.now(),
      }
    );
  },

  async delete(id: string) {
    return remove(
      ref(db, `customers/${id}`)
    );
  },
};