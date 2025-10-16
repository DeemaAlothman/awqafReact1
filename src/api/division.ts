import axios from "axios";
const BASE = import.meta?.env?.VITE_API_URL || "http://localhost:3000";
const api = axios.create({ baseURL: BASE });

// Divisions
export const getDivisionById = async (id: number) => {
  const { data } = await api.get(`/divisions/${id}`);
  return data as {
    id: number;
    name: string;
    note?: string;
    department: {
      id: number;
      name: string;
      directorate?: { id: number; name: string };
    };
    offices: { id: number; name: string; note?: string }[];
  };
};

export const createDivision = async (payload: {
  name: string;
  departmentId: number;
  note?: string;
}) => {
  const { data } = await api.post(`/divisions`, payload);
  return data;
};

export const updateDivision = async (
  id: number,
  payload: Partial<{ name: string; note: string; departmentId: number }>
) => {
  const { data } = await api.put(`/divisions/${id}`, payload);
  return data;
};

export const deleteDivision = async (id: number) => {
  const { data } = await api.delete(`/divisions/${id}`);
  return data;
};

// Offices (مرتبطة بالشعبة)
export const createOffice = async (payload: {
  name: string;
  divisionId: number;
  note?: string;
}) => {
  const { data } = await api.post(`/offices`, payload);
  return data;
};
export const updateOffice = async (
  id: number,
  payload: Partial<{ name: string; note: string; divisionId: number }>
) => {
  const { data } = await api.put(`/offices/${id}`, payload);
  return data;
};
export const deleteOffice = async (id: number) => {
  const { data } = await api.delete(`/offices/${id}`);
  return data;
};
