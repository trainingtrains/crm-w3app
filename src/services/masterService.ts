// src/services/masterService.ts

import { get, ref } from "firebase/database";
import { db } from "../db/firebase";

export const masterService = {
  async getCities() {
    const snapshot = await get(ref(db, "masters/cities"));

    if (!snapshot.exists()) return [];

    return Object.entries(snapshot.val()).map(
      ([key, value]: any) => ({
        value: key,
        label: value.name,
      })
    );
  },

  async getProjectTypes() {
    const snapshot = await get(
      ref(db, "masters/projectTypes")
    );

    if (!snapshot.exists()) return [];

    return Object.entries(snapshot.val()).map(
      ([key, value]: any) => ({
        value: key,
        label: value.label,
      })
    );
  },

  async getEnquiryStatus() {
    const snapshot = await get(
      ref(db, "masters/enquiryStatus")
    );

    if (!snapshot.exists()) return [];

    return Object.entries(snapshot.val()).map(
      ([key, value]: any) => ({
        value: key,
        label: value.label,
      })
    );
  },
};