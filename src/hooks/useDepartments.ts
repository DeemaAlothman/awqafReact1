// src/hooks/useDepartments.ts
import { useEffect, useState, useCallback } from "react";
import { Department } from "../types/department";
import {
  getDepartmentsByDirectorate,
  createDepartment,
  updateDepartment,
  deleteDepartment,
} from "../api/department";

export const useDepartments = (directorateId?: number) => {
  const [items, setItems] = useState<Department[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const fetchDepartments = useCallback(async () => {
    if (!directorateId) return;
    setLoading(true);
    setError("");
    try {
      const data = await getDepartmentsByDirectorate(directorateId, true);
      setItems(data);
    } catch (e: any) {
      setError(e?.message || "Failed to load departments");
    } finally {
      setLoading(false);
    }
  }, [directorateId]);

  useEffect(() => {
    fetchDepartments();
  }, [fetchDepartments]);

  // ✅ تعديل هذه الدالة
  const addDepartment = async (payload: {
    name: string;
    note?: string;
    directorateId: number;
  }) => {
    await createDepartment(payload);
    await fetchDepartments();
  };

  const editDepartment = async (
    id: number,
    payload: Partial<{ name: string; note: string }>
  ) => {
    await updateDepartment(id, payload);
    await fetchDepartments();
  };

  const removeDepartment = async (id: number) => {
    await deleteDepartment(id);
    await fetchDepartments();
  };

  return {
    items,
    loading,
    error,
    fetchDepartments,
    addDepartment,
    editDepartment,
    removeDepartment,
  };
};
