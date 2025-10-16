// src/api/department.ts
import axios from "axios";
import { Department } from "../types/department";

// يسمح نحدد الـ API من .env (Vite) وإلا يفترض localhost
const BASE = import.meta?.env?.VITE_API_URL || "http://localhost:3000";

// ممكن تستخدم instance لو حاب لاحقًا تضيف interceptors
const api = axios.create({
  baseURL: BASE,
});

// ----------------------------------------------------
// Departments
// ----------------------------------------------------

// جلب دوائر المديرية (مع الشجرة divisions.offices عند withTree=true)
export const getDepartmentsByDirectorate = async (
  directorateId: number,
  withTree = true
) => {
  const { data } = await api.get<Department[]>(
    `/departments/directorate/${directorateId}${
      withTree ? "?withTree=true" : ""
    }`
  );
  return data;
};

// جلب دائرة معيّنة (تتفاصيلها + الشعب + المكاتب)
export const getDepartmentById = async (id: number) => {
  const { data } = await api.get<Department>(`/departments/${id}`);
  return data;
};

// إنشاء دائرة
export const createDepartment = async (payload: {
  name: string;
  directorateId: number;
  note?: string;
}) => {
  const { data } = await api.post(`/departments`, payload);
  return data;
};

// تعديل دائرة
export const updateDepartment = async (
  id: number,
  payload: Partial<{ name: string; directorateId: number; note: string }>
) => {
  const { data } = await api.put(`/departments/${id}`, payload);
  return data;
};

// حذف دائرة
export const deleteDepartment = async (id: number) => {
  const { data } = await api.delete(`/departments/${id}`);
  return data;
};

// ----------------------------------------------------
// Divisions (مطلوبة لصفحة تفاصيل الدائرة)
// ----------------------------------------------------

// إنشاء شعبة ضمن دائرة
export const createDivision = async (payload: {
  name: string;
  departmentId: number;
  note?: string;
}) => {
  const { data } = await api.post(`/divisions`, payload);
  return data;
};
