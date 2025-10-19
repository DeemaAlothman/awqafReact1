// src/api/pdf.ts
import axios from "axios";

const API_URL = "http://localhost:3000";

export const downloadStructurePDF = async (): Promise<Blob> => {
  const res = await axios.get(`${API_URL}/pdf/structure?withTree=true`, {
    responseType: "blob",
  });
  return res.data;
};
