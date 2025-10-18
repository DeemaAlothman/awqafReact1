// src/App.tsx
import React, { Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import DirectoratesPage from "./pages/DirectoratesPage";
import DepartmentsPage from "./pages/DepartmentsPage";
import DepartmentPage from "./pages/DepartmentPage";
import DivisionPage from "./pages/DivisionPage";
import OfficePage from "./pages/OfficePage"; // ✅ جديد
import EmployeePage from "./pages/EmployeePage";
import OrganizationTree from "./pages/OrganizationTree";

const Loading: React.FC = () => (
  <div className="min-h-screen grid place-items-center bg-gray-50">
    <div className="px-4 py-2 rounded-lg border shadow-sm text-gray-600">
      جارِ التحميل…
    </div>
  </div>
);

const NotFound: React.FC = () => (
  <div className="min-h-screen grid place-items-center bg-gray-50">
    <div className="px-4 py-2 rounded-lg border shadow-sm text-gray-600">
      الصفحة غير موجودة
    </div>
  </div>
);

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-100" dir="rtl">
        <Suspense fallback={<Loading />}>
          <Routes>
            <Route path="/" element={<DirectoratesPage />} />
            <Route path="/departments" element={<DepartmentsPage />} />
            <Route path="/departments/:id" element={<DepartmentPage />} />
            <Route path="/divisions/:id" element={<DivisionPage />} />
            <Route path="/offices/:id" element={<OfficePage />} />{" "}
            {/* ✅ جديد */}
            <Route path="/employees/:id" element={<EmployeePage />} />
            <Route path="/home" element={<Navigate to="/" replace />} />
            <Route path="/organization-tree" element={<OrganizationTree />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </div>
    </BrowserRouter>
  );
};

export default App;
