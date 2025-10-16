// src/pages/DepartmentsPage.tsx
import React from "react";
import { useDirectorate } from "../hooks/useDirectorate";
import { useDepartments } from "../hooks/useDepartments";
import DepartmentTree from "../components/DepartmentTree";

const DepartmentsPage: React.FC = () => {
  const { directorate, loading: loadingDir } = useDirectorate();
  const {
    items,
    loading,
    error,
    addDepartment,
    editDepartment,
    removeDepartment,
  } = useDepartments(directorate?.id);

  if (loadingDir) return <div className="p-6">جارِ تحميل المديرية…</div>;
  if (!directorate)
    return <div className="p-6 text-red-600">لا توجد مديرية.</div>;

  return (
    <div className="flex h-screen bg-slate-50">


      {/* Content */}
      <main className="flex-1 p-6 pr-72">
        {/* pr-72 لتفريغ مساحة للسايدبار المثبت يميناً */}
        <h1 className="text-2xl font-bold mb-4 bg-gradient-to-r from-green-500 to-emerald-500 bg-clip-text text-transparent">
          الدوائر التابعة: {directorate.name}
        </h1>

        <DepartmentTree
          departments={items}
          loading={loading}
          error={error}
          onAddDepartment={addDepartment}
          onEditDepartment={editDepartment}
          onDeleteDepartment={removeDepartment}
        />
      </main>
    </div>
  );
};

export default DepartmentsPage;
