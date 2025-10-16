// src/types/organization.ts
export interface Employee {
  id: number;
  name: string;
  position?: string;
  phone?: string;
  note?: string;
  officeId?: number;
}

export interface Office {
  id: number;
  name: string;
  divisionId?: number;
  note?: string;
  employees: Employee[];
}

export interface Division {
  id: number;
  name: string;
  departmentId: number;
  note?: string;
  offices: Office[];
}

export interface Department {
  id: number;
  name: string;
  directorateId: number;
  note?: string;
  divisions: Division[];
}

export interface Directorate {
  id: number;
  name: string;
  address?: string;
  note?: string;
  departments: Department[];
}
