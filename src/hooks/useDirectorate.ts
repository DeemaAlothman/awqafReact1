// src/hooks/useDirectorate.ts
import { useEffect, useState, useCallback } from "react";
import { Directorate } from "../types/directorate";
import { getDirectorate, createOrUpdateDirectorate } from "../api/directorate";

export const useDirectorate = () => {
  const [directorate, setDirectorate] = useState<Directorate | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchDirectorate = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getDirectorate();
      setDirectorate(data);
    } catch (err) {
      console.error("Error fetching directorate:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // دالة للتعديل/إنشاء المديرية
  const updateDirectorate = async (data: Partial<Directorate>) => {
    try {
      const updated = await createOrUpdateDirectorate(data);
      setDirectorate(updated); // تحديث الstate مباشرة
      return updated;
    } catch (err) {
      console.error("Error updating directorate:", err);
      throw err;
    }
  };

  useEffect(() => {
    fetchDirectorate();
  }, [fetchDirectorate]);

  return { directorate, loading, fetchDirectorate, updateDirectorate };
};
