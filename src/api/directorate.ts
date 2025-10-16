import axios from "axios";
import { Directorate } from "../types/directorate";

const API_URL = "http://localhost:3000/directorates"; // الرابط الصحيح

export const getDirectorate = async (): Promise<Directorate> => {
  const res = await axios.get(API_URL);
  console.log("Directorate from API:", res.data);
  return res.data;
};

export const createOrUpdateDirectorate = async (data: Partial<Directorate>) => {
  const res = await axios.post(API_URL, data); // POST لإنشاء أو تعديل
  return res.data;
};
