import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Department } from "../types/department";
import {
  getDepartmentById,
  updateDepartment,
  createDivision,
} from "../api/department";
import { createEmployee } from "../api/employee";
import { Pencil, Plus, ArrowRight } from "lucide-react";

const DepartmentPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const deptId = Number(id);

  const [dept, setDept] = useState<Department | null>(null);
  const [loading, setLoading] = useState(true);

  // modals
  const [showEdit, setShowEdit] = useState(false);
  const [showAddDivision, setShowAddDivision] = useState(false);
  const [showAddEmp, setShowAddEmp] = useState(false);

  // dept form
  const [name, setName] = useState("");
  const [note, setNote] = useState("");

  // division form
  const [divName, setDivName] = useState("");
  const [divNote, setDivNote] = useState("");

  // employee form
  const [empName, setEmpName] = useState("");
  const [empPosition, setEmpPosition] = useState("");
  const [empPhone, setEmpPhone] = useState("");
  const [empENote, setEmpENote] = useState("");

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await getDepartmentById(deptId);
      setDept(data);
      setName(data.name || "");
      setNote((data as any).note || "");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (deptId) fetchData();
  }, [deptId]);

  if (loading) return <div className="p-6">جارِ التحميل…</div>;
  if (!dept) return <div className="p-6 text-red-600">الدائرة غير موجودة.</div>;

  return (
    <div className="min-h-screen bg-slate-50" dir="rtl">
      <div className="max-w-5xl mx-auto p-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-slate-600 mb-4">
          <Link to="/" className="hover:text-emerald-600">
            المديرية
          </Link>
          <ArrowRight className="w-4 h-4" />
          <span className="text-slate-800 font-medium">{dept.name}</span>
        </div>

        {/* Header Card */}
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-4 flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-green-500 to-emerald-500 bg-clip-text text-transparent">
              {dept.name}
            </h1>
            {(dept as any).note && (
              <p className="text-slate-600 mt-1">{(dept as any).note}</p>
            )}
          </div>
          <div className="flex gap-2">
            <button
              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700"
              onClick={() => setShowEdit(true)}
            >
              <Pencil size={16} /> تعديل الدائرة
            </button>
            <button
              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:opacity-95"
              onClick={() => setShowAddEmp(true)}
            >
              <Plus size={16} /> موظف
            </button>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-4 flex items-center justify-between">
          <div className="text-slate-600">
            عدد الشعب:{" "}
            <span className="font-semibold">{dept.divisions?.length ?? 0}</span>
          </div>
          <button
            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:opacity-95"
            onClick={() => setShowAddDivision(true)}
          >
            <Plus size={16} /> إضافة شعبة
          </button>
        </div>

        {/* Divisions list */}
        <div className="mt-3 grid gap-3">
          {(dept.divisions || []).length ? (
            dept.divisions!.map((div) => (
              <Link
                key={div.id}
                to={`/divisions/${div.id}`}
                className="block bg-white border border-slate-200 rounded-xl p-3 hover:border-emerald-300 hover:shadow"
                title="عرض تفاصيل الشعبة"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-slate-800 hover:text-emerald-600">
                      {div.name}
                    </div>
                    {div.note && (
                      <div className="text-xs text-slate-500 mt-0.5">
                        {div.note}
                      </div>
                    )}
                  </div>
                  <div className="text-xs bg-slate-200 rounded px-2 py-0.5">
                    مكاتب: {div.offices?.length ?? 0}
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="text-slate-500">لا توجد شعب بعد.</div>
          )}
        </div>
      </div>

      {/* Edit Department Modal */}
      {showEdit && (
        <div className="fixed inset-0 bg-black/30 grid place-items-center z-50">
          <div className="bg-white w-[520px] rounded-xl p-5 shadow-lg">
            <h3 className="text-lg font-bold mb-3">تعديل بيانات الدائرة</h3>
            <label className="block text-sm mb-2">
              الاسم
              <input
                className="mt-1 w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </label>
            <label className="block text-sm">
              ملاحظة (اختياري)
              <input
                className="mt-1 w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
            </label>
            <div className="flex justify-end gap-2 mt-4">
              <button
                className="px-3 py-2 rounded-lg bg-slate-100 hover:bg-slate-200"
                onClick={() => setShowEdit(false)}
              >
                إلغاء
              </button>
              <button
                className="px-3 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700"
                onClick={async () => {
                  await updateDepartment(deptId, { name, note });
                  await fetchData();
                  setShowEdit(false);
                }}
              >
                حفظ
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Division Modal */}
      {showAddDivision && (
        <div className="fixed inset-0 bg-black/30 grid place-items-center z-50">
          <div className="bg-white w-[520px] rounded-xl p-5 shadow-lg">
            <h3 className="text-lg font-bold mb-3">إضافة شعبة جديدة</h3>
            <label className="block text-sm mb-2">
              اسم الشعبة
              <input
                className="mt-1 w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                value={divName}
                onChange={(e) => setDivName(e.target.value)}
                placeholder="مثال: الموارد البشرية"
              />
            </label>
            <label className="block text-sm">
              ملاحظة (اختياري)
              <input
                className="mt-1 w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                value={divNote}
                onChange={(e) => setDivNote(e.target.value)}
              />
            </label>
            <div className="flex justify-end gap-2 mt-4">
              <button
                className="px-3 py-2 rounded-lg bg-slate-100 hover:bg-slate-200"
                onClick={() => setShowAddDivision(false)}
              >
                إلغاء
              </button>
              <button
                className="px-3 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700"
                onClick={async () => {
                  if (!divName.trim()) return;
                  await createDivision({
                    name: divName.trim(),
                    departmentId: deptId,
                    note: divNote.trim() || undefined,
                  });
                  await fetchData();
                  setDivName("");
                  setDivNote("");
                  setShowAddDivision(false);
                }}
              >
                حفظ
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Department Employee Modal */}
      {showAddEmp && (
        <div className="fixed inset-0 bg-black/30 grid place-items-center z-50">
          <div className="bg-white w-[520px] rounded-xl p-5 shadow-lg">
            <h3 className="text-lg font-bold mb-3">إضافة موظف للدائرة</h3>
            <div className="grid gap-2">
              <label className="block text-sm">
                الاسم
                <input
                  className="mt-1 w-full border rounded-lg px-3 py-2"
                  value={empName}
                  onChange={(e) => setEmpName(e.target.value)}
                />
              </label>
              <label className="block text-sm">
                المسمّى (اختياري)
                <input
                  className="mt-1 w-full border rounded-lg px-3 py-2"
                  value={empPosition}
                  onChange={(e) => setEmpPosition(e.target.value)}
                />
              </label>
              <label className="block text-sm">
                الهاتف (اختياري)
                <input
                  className="mt-1 w-full border rounded-lg px-3 py-2"
                  value={empPhone}
                  onChange={(e) => setEmpPhone(e.target.value)}
                />
              </label>
              <label className="block text-sm">
                ملاحظة (اختياري)
                <input
                  className="mt-1 w-full border rounded-lg px-3 py-2"
                  value={empENote}
                  onChange={(e) => setEmpENote(e.target.value)}
                />
              </label>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <button
                className="px-3 py-2 rounded-lg bg-slate-100 hover:bg-slate-200"
                onClick={() => setShowAddEmp(false)}
              >
                إلغاء
              </button>
              <button
                className="px-3 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700"
                onClick={async () => {
                  if (!empName.trim()) return;
                  await createEmployee({
                    name: empName.trim(),
                    scope: "department",
                    scopeId: deptId,
                    position: empPosition.trim() || undefined,
                    phone: empPhone.trim() || undefined,
                    note: empENote.trim() || undefined,
                  });
                  setEmpName("");
                  setEmpPosition("");
                  setEmpPhone("");
                  setEmpENote("");
                  setShowAddEmp(false);
                }}
              >
                حفظ
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DepartmentPage;
