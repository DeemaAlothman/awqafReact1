import axios from "axios";
import { Employee } from "../types/employee";

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


export const getEmployeesByDirectorate = async (
  directorateId: number
): Promise<Employee[]> => {
  const res = await axios.get(`${BASE}/employees/directorate/${directorateId}`);
  return res.data;
};

// 🟢 جلب الموظفين حسب الدائرة
export const getEmployeesByDepartment = async (
  departmentId: number
): Promise<Employee[]> => {
  const res = await axios.get(`${BASE}/employees/department/${departmentId}`);
  return res.data;
};

// 🟢 جلب الموظفين حسب الشعبة
export const getEmployeesByDivision = async (divisionId: number) => {
  const res = await axios.get(`${BASE}/employees/division/${divisionId}`);
  return res.data;
};


// 🟢 جلب الموظفين حسب المكتب
export const getEmployeesByOffice = async (
  officeId: number
): Promise<Employee[]> => {
  const res = await axios.get(`${BASE}/employees/office/${officeId}`);
  return res.data;
};




