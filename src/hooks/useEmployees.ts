import { useEffect, useState } from "react";
import { Employee } from "../types/employee";
import {
  getEmployeesByDirectorate,
  getEmployeesByDepartment,
  getEmployeesByDivision,
  getEmployeesByOffice,
} from "../api/employee";

type Scope = "directorate" | "department" | "division" | "office";

export const useEmployees = (scope: Scope, id: number) => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchEmployees = async () => {
    try {
      let data: Employee[] = [];

      switch (scope) {
        case "directorate":
          data = await getEmployeesByDirectorate(id);
          break;
        case "department":
          data = await getEmployeesByDepartment(id);
          break;
        case "division":
          data = await getEmployeesByDivision(id);
          break;
        case "office":
          data = await getEmployeesByOffice(id);
          break;
      }

      setEmployees(data);
    } catch (err) {
      console.error("Error fetching employees:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, [scope, id]);

  return { employees, loading, fetchEmployees };
};
