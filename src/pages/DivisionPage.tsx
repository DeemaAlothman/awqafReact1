import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getDivisionById, updateDivision } from "../api/division";
import { createOffice, updateOffice, deleteOffice } from "../api/office";
import { createEmployee } from "../api/employee";
import { Pencil, Plus, Trash, ArrowRight } from "lucide-react";

const DivisionPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const divisionId = Number(id);

  const [division, setDivision] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // modals
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState("");
  const [note, setNote] = useState("");

  const [showAddOffice, setShowAddOffice] = useState(false);
  const [officeName, setOfficeName] = useState("");
  const [officeNote, setOfficeNote] = useState("");

  // زر/مودال إضافة موظف للشعبة
  const [showAddEmp, setShowAddEmp] = useState(false);
  const [empName, setEmpName] = useState("");
  const [empPosition, setEmpPosition] = useState("");
  const [empPhone, setEmpPhone] = useState("");
  const [empENote, setEmpENote] = useState("");

  const [editingOfficeId, setEditingOfficeId] = useState<number | null>(null);
  const [editingOfficeName, setEditingOfficeName] = useState("");
  const [editingOfficeNote, setEditingOfficeNote] = useState("");

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await getDivisionById(divisionId);
      setDivision(data);
      setName(data.name || "");
      setNote(data.note || "");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (divisionId) fetchData();
  }, [divisionId]);

  if (loading) return <div className="p-6">جارِ التحميل…</div>;
  if (!division)
    return <div className="p-6 text-red-600">الشعبة غير موجودة.</div>;

  const dept = division.department;

  return (
    <div className="min-h-screen bg-slate-50" dir="rtl">
      <div className="max-w-5xl mx-auto p-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-slate-600 mb-4">
          <Link to="/" className="hover:text-emerald-600">
            المديرية
          </Link>
          <ArrowRight className="w-4 h-4" />
          <Link
            to={`/departments/${dept?.id}`}
            className="hover:text-emerald-600"
          >
            {dept?.name}
          </Link>
          <ArrowRight className="w-4 h-4" />
          <span className="text-slate-800 font-medium">{division.name}</span>
        </div>

        {/* Header */}
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-4 flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-green-500 to-emerald-500 bg-clip-text text-transparent">
              {division.name}
            </h1>
            {division.note && (
              <p className="text-slate-600 mt-1">{division.note}</p>
            )}
          </div>
          <div className="flex gap-2">
            <button
              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700"
              onClick={() => setEditing(true)}
            >
              <Pencil size={16} /> تعديل الشعبة
            </button>
            <button
              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:opacity-95"
              onClick={() => setShowAddOffice(true)}
            >
              <Plus size={16} /> إضافة مكتب
            </button>
            {/* زر إضافة موظف للشعبة */}
            <button
              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:opacity-95"
              onClick={() => setShowAddEmp(true)}
            >
              <Plus size={16} /> موظف
            </button>
          </div>
        </div>

        {/* Offices list */}
        <div className="mt-4">
          <div className="text-slate-600 mb-2">
            عدد المكاتب:{" "}
            <span className="font-semibold">
              {division.offices?.length ?? 0}
            </span>
          </div>

          {division.offices?.length ? (
            <div className="grid gap-3">
              {division.offices.map((o: any) => (
                <div
                  key={o.id}
                  className="bg-white border border-slate-200 rounded-xl p-3 flex items-center justify-between"
                >
                  <Link
                    to={`/offices/${o.id}`}
                    className="group"
                    title="عرض تفاصيل المكتب"
                  >
                    <div className="font-medium text-slate-800 group-hover:text-emerald-600">
                      {o.name}
                    </div>
                    {o.note && (
                      <div className="text-xs text-slate-500 mt-0.5">
                        {o.note}
                      </div>
                    )}
                  </Link>
                  <div className="flex items-center gap-2">
                    <button
                      className="px-2 py-1 rounded bg-white border hover:bg-slate-100 text-sm"
                      onClick={() => {
                        setEditingOfficeId(o.id);
                        setEditingOfficeName(o.name);
                        setEditingOfficeNote(o.note || "");
                      }}
                    >
                      تعديل
                    </button>
                    <button
                      className="px-2 py-1 rounded bg-red-50 border border-red-200 text-red-700 hover:bg-red-100 text-sm"
                      onClick={async () => {
                        if (!confirm("حذف هذا المكتب؟")) return;
                        await deleteOffice(o.id);
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
            <div className="text-slate-500">لا يوجد مكاتب بعد.</div>
          )}
        </div>
      </div>

      {/* Edit Division Modal */}
      {editing && (
        <div className="fixed inset-0 bg-black/30 grid place-items-center z-50">
          <div className="bg-white w-[520px] rounded-xl p-5 shadow-lg">
            <h3 className="text-lg font-bold mb-3">تعديل بيانات الشعبة</h3>
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
                onClick={() => setEditing(false)}
              >
                إلغاء
              </button>
              <button
                className="px-3 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700"
                onClick={async () => {
                  await updateDivision(divisionId, { name, note });
                  await fetchData();
                  setEditing(false);
                }}
              >
                حفظ
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Office Modal */}
      {showAddOffice && (
        <div className="fixed inset-0 bg-black/30 grid place-items-center z-50">
          <div className="bg-white w-[520px] rounded-xl p-5 shadow-lg">
            <h3 className="text-lg font-bold mb-3">إضافة مكتب جديد</h3>
            <label className="block text-sm mb-2">
              الاسم
              <input
                className="mt-1 w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                value={officeName}
                onChange={(e) => setOfficeName(e.target.value)}
                placeholder="مثال: مكتب التوظيف"
              />
            </label>
            <label className="block text-sm">
              ملاحظة (اختياري)
              <input
                className="mt-1 w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                value={officeNote}
                onChange={(e) => setOfficeNote(e.target.value)}
              />
            </label>
            <div className="flex justify-end gap-2 mt-4">
              <button
                className="px-3 py-2 rounded-lg bg-slate-100 hover:bg-slate-200"
                onClick={() => setShowAddOffice(false)}
              >
                إلغاء
              </button>
              <button
                className="px-3 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700"
                onClick={async () => {
                  if (!officeName.trim()) return;
                  await createOffice({
                    name: officeName.trim(),
                    divisionId,
                    note: officeNote.trim() || undefined,
                  });
                  await fetchData();
                  setOfficeName("");
                  setOfficeNote("");
                  setShowAddOffice(false);
                }}
              >
                حفظ
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Division Employee Modal */}
      {showAddEmp && (
        <div className="fixed inset-0 bg-black/30 grid place-items-center z-50">
          <div className="bg-white w-[520px] rounded-xl p-5 shadow-lg">
            <h3 className="text-lg font-bold mb-3">إضافة موظف للشعبة</h3>
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
                    scope: "division",
                    scopeId: divisionId,
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

      {/* Edit Office Modal */}
      {editingOfficeId !== null && (
        <div className="fixed inset-0 bg-black/30 grid place-items-center z-50">
          <div className="bg-white w-[520px] rounded-xl p-5 shadow-lg">
            <h3 className="text-lg font-bold mb-3">تعديل المكتب</h3>
            <label className="block text-sm mb-2">
              الاسم
              <input
                className="mt-1 w-full border rounded-lg px-3 py-2"
                value={editingOfficeName}
                onChange={(e) => setEditingOfficeName(e.target.value)}
              />
            </label>
            <label className="block text-sm">
              ملاحظة (اختياري)
              <input
                className="mt-1 w-full border rounded-lg px-3 py-2"
                value={editingOfficeNote}
                onChange={(e) => setEditingOfficeNote(e.target.value)}
              />
            </label>
            <div className="flex justify-end gap-2 mt-4">
              <button
                className="px-3 py-2 rounded-lg bg-slate-100 hover:bg-slate-200"
                onClick={() => setEditingOfficeId(null)}
              >
                إلغاء
              </button>
              <button
                className="px-3 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700"
                onClick={async () => {
                  await updateOffice(editingOfficeId!, {
                    name: editingOfficeName,
                    note: editingOfficeNote,
                    divisionId,
                  });
                  await fetchData();
                  setEditingOfficeId(null);
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

export default DivisionPage;
