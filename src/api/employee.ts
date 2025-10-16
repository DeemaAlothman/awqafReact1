import axios from "axios";

// مثال في أي ملف API
const BASE =
  (import.meta as any)?.env?.VITE_API_URL ?? "http://localhost:3000";


export type EmployeeScope =
  | "directorate"
  | "department"
  | "division"
  | "office";

export const createEmployee = async (payload: {
  name: string;
  position?: string;
  phone?: string;
  note?: string;
  scope: EmployeeScope;
  scopeId: number;
}) => {
  const { data } = await axios.post(`${BASE}/employees`, payload);
  return data;
};

export const updateEmployee = async (
  id: number,
  payload: Partial<{
    name: string;
    position: string;
    phone: string;
    note: string;
    scope: EmployeeScope;
    scopeId: number;
  }>
) => {
  const { data } = await axios.put(`${BASE}/employees/${id}`, payload);
  return data;
};

export const deleteEmployee = async (id: number) => {
  const { data } = await axios.delete(`${BASE}/employees/${id}`);
  return data;
};

export const getEmployeeById = async (id: number) => {
  const { data } = await axios.get(`${BASE}/employees/${id}`);
  return data;
};
