// src/types/department.ts
export interface Office {
  id: number;
  name: string;
}

export interface Division {
  id: number;
  name: string;
  offices: Office[];
}

export interface Department {
  id: number;
  name: string;
  note?: string;
  divisions: Division[];
}
