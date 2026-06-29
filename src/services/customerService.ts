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
      const customersRef = ref(db, "customers");
      const snapshot = await get(customersRef);

      const customers = snapshot.exists() ? snapshot.val() : {};

      // Check duplicate customer
      const exists = Object.values(customers).some((c: any) =>
        c.companyName?.trim().toLowerCase() === customer.companyName?.trim().toLowerCase() &&
        c.contactPerson?.trim().toLowerCase() === customer.contactPerson?.trim().toLowerCase() &&
        c.mobile?.trim() === customer.mobile?.trim()
      );

      if (exists) {
        throw new Error(
          "Customer already exists with the same Company Name, Contact Person and Mobile Number."
        );
      }

      // Generate Customer ID
      const prefix = "TTCL";

      const maxNumber = Object.values(customers).reduce((max: number, c: any) => {
        const num = Number((c.customerId || "").replace(prefix, ""));
        return Number.isNaN(num) ? max : Math.max(max, num);
      }, 0);

      const customerId = `${prefix}${String(maxNumber + 1).padStart(4, "0")}`;

      // Get selected city id
      const cityId =
        typeof customer.city === "object"
          ? customer.city?.value ?? ""
          : customer.city ?? "";

      const { city, ...customerData } = customer;

      const now = Date.now();

      const customerRef = await push(customersRef, {
        customerId,
        ...customerData,
        cityId,
        createdAt: now,
        updatedAt: now,
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
  async getById(id: string) {
    try {
      const snapshot = await get(ref(db, `customers/${id}`));

      if (!snapshot.exists()) {
        throw new Error("Customer not found.");
      }

      return {
        id,
        ...snapshot.val(),
      };
    } catch (error) {
      console.error("Get Customer Error:", error);
      throw error;
    }
  },

  async delete(id: string) {
    try {
      const customerRef = ref(db, `customers/${id}`);

      const snapshot = await get(customerRef);

      if (!snapshot.exists()) {
        throw new Error("Customer not found.");
      }

      await remove(customerRef);

      return {
        success: true,
        message: "Customer deleted successfully.",
      };
    } catch (error) {
      console.error("Delete Customer Error:", error);
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

};