// src/components/Sidebar.tsx
import React, { useEffect, useState } from "react";
import { Directorate } from "../types/directorate";
import { Department } from "../types/department";
import axios from "axios";

interface Props {
  directorate: Directorate;
}

const Sidebar: React.FC<Props> = ({ directorate }) => {
  const [departments, setDepartments] = useState<Department[]>([]);

  useEffect(() => {
    const fetchDepartments = async () => {
      const res = await axios.get("http://localhost:3000/departments");
      setDepartments(res.data);
    };
    fetchDepartments();
  }, []);

  return (
    <div className="w-64 bg-green-100 p-4 h-screen overflow-y-auto border-r border-green-300">
      <h2 className="text-lg font-bold mb-4 text-green-800">
        {directorate.name}
      </h2>
      <ul>
        {departments.map((dept) => (
          <li key={dept.id} className="mb-2">
            <div className="font-semibold text-green-700">{dept.name}</div>
            <ul className="ml-4 mt-1">
              {dept.divisions.map((div) => (
                <li key={div.id} className="mb-1">
                  <div className="text-green-600">{div.name}</div>
                  <ul className="ml-4 mt-1">
                    {div.offices.map((office) => (
                      <li key={office.id} className="text-green-500">
                        {office.name}
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
