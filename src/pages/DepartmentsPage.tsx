// src/pages/DepartmentsPage.tsx
import React, { useState } from "react";
import { useDirectorate } from "../hooks/useDirectorate";
import { useDepartments } from "../hooks/useDepartments";
import { Plus, Pencil, Trash } from "lucide-react";

const DepartmentsPage: React.FC = () => {
  const { directorate, loading: loadingDir } = useDirectorate();
  const {
    items: departments,
    loading,
    error,
    addDepartment,
    editDepartment,
    removeDepartment,
  } = useDepartments(directorate?.id);

  const [newDept, setNewDept] = useState({ name: "", note: "" });
  const [editMode, setEditMode] = useState<number | null>(null);
  const [editDept, setEditDept] = useState({ name: "", note: "" });

  if (loadingDir) return <div className="p-6">جارِ تحميل المديرية…</div>;
  if (!directorate)
    return <div className="p-6 text-red-600">لا توجد مديرية.</div>;

  const handleAdd = async () => {
    if (!newDept.name.trim()) return;
    await addDepartment({
      name: newDept.name,
      note: newDept.note,
      directorateId: directorate.id,
    });
    setNewDept({ name: "", note: "" });
  };

  const handleEdit = async (id: number) => {
    await editDepartment(id, {
      name: editDept.name,
      note: editDept.note,
    });
    setEditMode(null);
  };

  const handleDelete = async (id: number) => {
    if (confirm("هل أنت متأكد من حذف هذه الدائرة؟")) {
      await removeDepartment(id);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow p-6">
        <h1 className="text-2xl font-bold mb-4 bg-gradient-to-r from-green-500 to-emerald-500 bg-clip-text text-transparent">
          الدوائر التابعة: {directorate.name}
        </h1>

        {/* إضافة دائرة جديدة */}
        <div className="flex flex-col sm:flex-row gap-2 mb-6">
          <input
            type="text"
            placeholder="اسم الدائرة"
            value={newDept.name}
            onChange={(e) => setNewDept({ ...newDept, name: e.target.value })}
            className="border rounded-lg p-2 flex-1"
          />
          <input
            type="text"
            placeholder="ملاحظات"
            value={newDept.note}
            onChange={(e) => setNewDept({ ...newDept, note: e.target.value })}
            className="border rounded-lg p-2 flex-1"
          />
          <button
            onClick={handleAdd}
            className="bg-green-500 hover:bg-green-600 text-white rounded-lg px-4 py-2 flex items-center gap-2"
          >
            <Plus size={18} /> إضافة
          </button>
        </div>

        {loading && <div>جارِ التحميل...</div>}
        {error && <div className="text-red-500">حدث خطأ في تحميل البيانات</div>}

        {/* عرض الدوائر */}
        <div className="space-y-4">
          {departments.map((dept) => (
            <div
              key={dept.id}
              className="flex flex-col sm:flex-row justify-between items-start sm:items-center border p-4 rounded-xl shadow-sm bg-slate-100"
            >
              {editMode === dept.id ? (
                <div className="flex flex-col sm:flex-row gap-2 w-full">
                  <input
                    type="text"
                    value={editDept.name}
                    onChange={(e) =>
                      setEditDept({ ...editDept, name: e.target.value })
                    }
                    className="border rounded-lg p-2 flex-1"
                  />
                  <input
                    type="text"
                    value={editDept.note}
                    onChange={(e) =>
                      setEditDept({ ...editDept, note: e.target.value })
                    }
                    className="border rounded-lg p-2 flex-1"
                  />
                  <button
                    onClick={() => handleEdit(dept.id)}
                    className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg px-4 py-2"
                  >
                    حفظ
                  </button>
                </div>
              ) : (
                <>
                  <div>
                    <h2 className="text-lg font-semibold">{dept.name}</h2>
                    {dept.note && (
                      <p className="text-gray-600 text-sm">{dept.note}</p>
                    )}
                  </div>
                  <div className="flex gap-2 mt-2 sm:mt-0">
                    <button
                      onClick={() => {
                        setEditMode(dept.id);
                        setEditDept({ name: dept.name, note: dept.note || "" });
                      }}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      <Pencil size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(dept.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash size={18} />
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}

          {departments.length === 0 && (
            <div className="text-center text-gray-500 mt-6">
              لا توجد دوائر بعد.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DepartmentsPage;
