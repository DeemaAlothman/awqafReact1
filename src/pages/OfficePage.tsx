import React, { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { getOfficeById, updateOffice, deleteOffice } from "../api/office";
import {
  createEmployee, // ⬅️ من api/employee
  updateEmployee,
  deleteEmployee,
} from "../api/employee";
import { Pencil, Plus, Trash, ArrowRight } from "lucide-react";

const OfficePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const officeId = Number(id);
  const navigate = useNavigate();

  const [office, setOffice] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Modals: edit office
  const [editOpen, setEditOpen] = useState(false);
  const [name, setName] = useState("");
  const [note, setNote] = useState("");

  // Modal: add employee
  const [addEmpOpen, setAddEmpOpen] = useState(false);
  const [empName, setEmpName] = useState("");
  const [empPosition, setEmpPosition] = useState("");
  const [empPhone, setEmpPhone] = useState("");
  const [empNote, setEmpNote] = useState("");

  // Modal: edit employee
  const [editEmpId, setEditEmpId] = useState<number | null>(null);
  const [editEmpName, setEditEmpName] = useState("");
  const [editEmpPosition, setEditEmpPosition] = useState("");
  const [editEmpPhone, setEditEmpPhone] = useState("");
  const [editEmpNote, setEditEmpNote] = useState("");

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await getOfficeById(officeId);
      setOffice(data);
      setName(data.name || "");
      setNote(data.note || "");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (officeId) fetchData();
  }, [officeId]);

  if (loading) return <div className="p-6">جارِ التحميل…</div>;
  if (!office) return <div className="p-6 text-red-600">المكتب غير موجود.</div>;

  const division = office.division;
  const department = division?.department;

  return (
    <div className="min-h-screen bg-slate-50" dir="rtl">
      <div className="max-w-5xl mx-auto p-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-slate-600 mb-4">
          <Link to="/" className="hover:text-emerald-600">
            المديرية
          </Link>
          <ArrowRight className="w-4 h-4" />
          {department ? (
            <>
              <Link
                to={`/departments/${department.id}`}
                className="hover:text-emerald-600"
              >
                {department.name}
              </Link>
              <ArrowRight className="w-4 h-4" />
              <Link
                to={`/divisions/${division.id}`}
                className="hover:text-emerald-600"
              >
                {division.name}
              </Link>
              <ArrowRight className="w-4 h-4" />
            </>
          ) : null}
          <span className="text-slate-800 font-medium">{office.name}</span>
        </div>

        {/* Header */}
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-4 flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-green-500 to-emerald-500 bg-clip-text text-transparent">
              {office.name}
            </h1>
            {office.note && (
              <p className="text-slate-600 mt-1">{office.note}</p>
            )}
          </div>
          <div className="flex gap-2">
            <button
              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700"
              onClick={() => setEditOpen(true)}
            >
              <Pencil size={16} /> تعديل المكتب
            </button>
            <button
              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:opacity-95"
              onClick={() => setAddEmpOpen(true)}
            >
              <Plus size={16} /> إضافة موظف
            </button>
          </div>
        </div>

        {/* Employees */}
        <div className="mt-4">
          <div className="text-slate-600 mb-2">
            عدد الموظفين:{" "}
            <span className="font-semibold">
              {office.employees?.length ?? 0}
            </span>
          </div>

          {office.employees?.length ? (
            <div className="grid gap-3">
              {office.employees.map((e: any) => (
                <div
                  key={e.id}
                  className="bg-white border border-slate-200 rounded-xl p-3 flex items-center justify-between"
                >
                  <div>
                    <Link
                      to={`/employees/${e.id}`}
                      className="font-medium text-slate-800 hover:text-emerald-600"
                      title="عرض تفاصيل الموظف"
                    >
                      {e.name}
                    </Link>
                    <div className="text-xs text-slate-500">
                      {e.position ? e.position : "بدون مسمّى"}
                      {e.phone ? ` – ${e.phone}` : ""}
                    </div>
                    {e.note && (
                      <div className="text-xs text-slate-500 mt-0.5">
                        {e.note}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      className="px-2 py-1 rounded bg-white border hover:bg-slate-100 text-sm"
                      onClick={() => {
                        setEditEmpId(e.id);
                        setEditEmpName(e.name);
                        setEditEmpPosition(e.position || "");
                        setEditEmpPhone(e.phone || "");
                        setEditEmpNote(e.note || "");
                      }}
                    >
                      تعديل
                    </button>
                    <button
                      className="px-2 py-1 rounded bg-red-50 border border-red-200 text-red-700 hover:bg-red-100 text-sm"
                      onClick={async () => {
                        if (!confirm("حذف هذا الموظف؟")) return;
                        await deleteEmployee(e.id);
                        await fetchData();
                      }}
                    >
                      <Trash className="inline w-4 h-4 -mt-0.5" /> حذف
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-slate-500">لا يوجد موظفون بعد.</div>
          )}
        </div>
      </div>

      {/* Edit Office Modal */}
      {editOpen && (
        <div className="fixed inset-0 bg-black/30 grid place-items-center z-50">
          <div className="bg-white w-[520px] rounded-xl p-5 shadow-lg">
            <h3 className="text-lg font-bold mb-3">تعديل بيانات المكتب</h3>
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
                onClick={() => setEditOpen(false)}
              >
                إلغاء
              </button>
              <button
                className="px-3 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700"
                onClick={async () => {
                  await updateOffice(officeId, {
                    name,
                    note,
                    divisionId: office?.division?.id,
                  });
                  await fetchData();
                  setEditOpen(false);
                }}
              >
                حفظ
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Employee Modal */}
      {addEmpOpen && (
        <div className="fixed inset-0 bg-black/30 grid place-items-center z-50">
          <div className="bg-white w-[520px] rounded-xl p-5 shadow-lg">
            <h3 className="text-lg font-bold mb-3">إضافة موظف</h3>
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
                  value={empNote}
                  onChange={(e) => setEmpNote(e.target.value)}
                />
              </label>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <button
                className="px-3 py-2 rounded-lg bg-slate-100 hover:bg-slate-200"
                onClick={() => setAddEmpOpen(false)}
              >
                إلغاء
              </button>
              <button
                className="px-3 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700"
                onClick={async () => {
                  if (!empName.trim()) return;
                  await createEmployee({
                    name: empName.trim(),
                    scope: "office", // ⬅️ الآن من api/employee
                    scopeId: officeId,
                    position: empPosition.trim() || undefined,
                    phone: empPhone.trim() || undefined,
                    note: empNote.trim() || undefined,
                  });
                  await fetchData();
                  setEmpName("");
                  setEmpPosition("");
                  setEmpPhone("");
                  setEmpNote("");
                  setAddEmpOpen(false);
                }}
              >
                حفظ
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Employee Modal */}
      {editEmpId !== null && (
        <div className="fixed inset-0 bg-black/30 grid place-items-center z-50">
          <div className="bg-white w-[520px] rounded-xl p-5 shadow-lg">
            <h3 className="text-lg font-bold mb-3">تعديل موظف</h3>
            <div className="grid gap-2">
              <label className="block text-sm">
                الاسم
                <input
                  className="mt-1 w-full border rounded-lg px-3 py-2"
                  value={editEmpName}
                  onChange={(e) => setEditEmpName(e.target.value)}
                />
              </label>
              <label className="block text-sm">
                المسمّى
                <input
                  className="mt-1 w-full border rounded-lg px-3 py-2"
                  value={editEmpPosition}
                  onChange={(e) => setEditEmpPosition(e.target.value)}
                />
              </label>
              <label className="block text-sm">
                الهاتف
                <input
                  className="mt-1 w-full border rounded-lg px-3 py-2"
                  value={editEmpPhone}
                  onChange={(e) => setEditEmpPhone(e.target.value)}
                />
              </label>
              <label className="block text-sm">
                ملاحظة
                <input
                  className="mt-1 w-full border rounded-lg px-3 py-2"
                  value={editEmpNote}
                  onChange={(e) => setEditEmpNote(e.target.value)}
                />
              </label>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <button
                className="px-3 py-2 rounded-lg bg-slate-100 hover:bg-slate-200"
                onClick={() => setEditEmpId(null)}
              >
                إلغاء
              </button>
              <button
                className="px-3 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700"
                onClick={async () => {
                  await updateEmployee(editEmpId!, {
                    name: editEmpName,
                    position: editEmpPosition,
                    phone: editEmpPhone,
                    note: editEmpNote,
                  });
                  await fetchData();
                  setEditEmpId(null);
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

export default OfficePage;
