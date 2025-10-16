import axios from "axios";

const BASE =
  (import.meta as any)?.env?.VITE_API_URL ||
  (typeof window !== "undefined" && (window as any).__API_URL__) ||
  "http://localhost:3000";

export const getOfficeById = async (id: number) => {
  const { data } = await axios.get(`${BASE}/offices/${id}`);
  return data;
};

export const createOffice = async (payload: {
  name: string;
  divisionId?: number | null;
  note?: string;
}) => {
  const { data } = await axios.post(`${BASE}/offices`, payload);
  return data;
};

export const updateOffice = async (
  id: number,
  payload: Partial<{ name: string; divisionId: number | null; note: string }>
) => {
  const { data } = await axios.put(`${BASE}/offices/${id}`, payload);
  return data;
};

export const deleteOffice = async (id: number) => {
  const { data } = await axios.delete(`${BASE}/offices/${id}`);
  return data;
};
