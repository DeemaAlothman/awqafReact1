import { useEffect, useState } from "react";
import { Directorate } from "../types/directorate";
import { getDirectorate } from "../api/directorate";

export const useDirectorate = () => {
  const [directorate, setDirectorate] = useState<Directorate | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchDirectorate = async () => {
    try {
      const data = await getDirectorate();
      setDirectorate(data);
    } catch (err) {
      console.error("Error fetching directorate:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDirectorate();
  }, []);

  return { directorate, loading, fetchDirectorate };
};
