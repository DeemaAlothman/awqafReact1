// src/api/organization.ts
import axios from "axios";
import { Directorate } from "../types/organization";

export const getAllDirectorates = async (): Promise<Directorate[]> => {
  const res = await axios.get("http://localhost:3000/api/directorates");
  return res.data;
};
