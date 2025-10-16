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
  note?: string;
  divisionId?: number;
  employees?: Employee[];
}

export interface Division {
  id: number;
  name: string;
  note?: string;
  offices: Office[];
}

export interface Department {
  id: number;
  name: string;
  note?: string;
  divisions: Division[];
}
