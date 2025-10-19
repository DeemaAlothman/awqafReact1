// src/hooks/usePDF.ts
import { useState } from "react";
import { downloadStructurePDF } from "../api/pdf";

export const usePDF = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const downloadPDF = async () => {
    setLoading(true);
    setError(null);
    try {
      const blob = await downloadStructurePDF();

      // إنشاء رابط تحميل
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `organizational-structure-${
        new Date().toISOString().split("T")[0]
      }.pdf`;
      document.body.appendChild(link);
      link.click();

      // تنظيف
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      return true;
    } catch (err) {
      console.error("Error downloading PDF:", err);
      setError("حدث خطأ أثناء تحميل ملف PDF");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { downloadPDF, loading, error };
};
