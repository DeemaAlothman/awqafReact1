import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  getEmployeeById,
  updateEmployee,
  deleteEmployee,
} from "../api/employee";
import { Pencil, Trash, ArrowRight } from "lucide-react";

const EmployeePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const empId = Number(id);
  const navigate = useNavigate();

  const [emp, setEmp] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [editOpen, setEditOpen] = useState(false);
  const [name, setName] = useState("");
  const [position, setPosition] = useState("");
  const [phone, setPhone] = useState("");
  const [note, setNote] = useState("");

  // نقل الموظف (مثال بسيط بإدخال ID المستوى)
  const [newOfficeId, setNewOfficeId] = useState<string>("");

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await getEmployeeById(empId);
      setEmp(data);
      setName(data.name || "");
      setPosition(data.position || "");
      setPhone(data.phone || "");
      setNote(data.note || "");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (empId) fetchData();
  }, [empId]);

  if (loading) return <div className="p-6">جارِ التحميل…</div>;
  if (!emp) return <div className="p-6 text-red-600">الموظّف غير موجود.</div>;

  const office = emp.office;
  const division = office?.division;
  const department = division?.department;

  return (
    <div className="min-h-screen bg-slate-50" dir="rtl">
      <div className="max-w-4xl mx-auto p-6">
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
              <Link
                to={`/offices/${office.id}`}
                className="hover:text-emerald-600"
              >
                {office.name}
              </Link>
              <ArrowRight className="w-4 h-4" />
            </>
          ) : null}
          <span className="text-slate-800 font-medium">{emp.name}</span>
        </div>

        {/* Header */}
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-4 flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-green-500 to-emerald-500 bg-clip-text text-transparent">
              {emp.name}
            </h1>
            <div className="text-slate-600 mt-1 text-sm">
              {emp.position || "بدون مسمى"} {emp.phone ? `– ${emp.phone}` : ""}
            </div>
            {emp.note && <p className="text-slate-600 mt-1">{emp.note}</p>}
          </div>
          <div className="flex gap-2">
            <button
              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700"
              onClick={() => setEditOpen(true)}
            >
              <Pencil size={16} /> تعديل
            </button>
            <button
              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-red-50 border border-red-200 text-red-700 hover:bg-red-100"
              onClick={async () => {
                if (!confirm("حذف هذا الموظف؟")) return;
                await deleteEmployee(empId);
                if (office?.id) navigate(`/offices/${office.id}`);
                else navigate(-1);
              }}
            >
              <Trash size={16} /> حذف
            </button>
          </div>
        </div>

        {/* كرت نقل الموظف (مثال عبر إدخال Office ID) */}
        <div className="mt-4 bg-white border border-slate-200 rounded-xl p-4">
          <div className="text-sm text-slate-700 mb-2">
            نقل الموظّف إلى مكتب آخر (أدخل رقم مكتب):
          </div>
          <div className="flex gap-2">
            <input
              className="border rounded-lg px-3 py-2 flex-1"
              placeholder="Office ID"
              value={newOfficeId}
              onChange={(e) => setNewOfficeId(e.target.value)}
            />
            <button
              className="px-3 py-2 rounded-lg bg-slate-100 hover:bg-slate-200"
              onClick={async () => {
                if (!newOfficeId.trim()) return;
                await updateEmployee(empId, {
                  scope: "office", // ⬅️ lowercase
                  scopeId: Number(newOfficeId),
                });
                await fetchData();
                setNewOfficeId("");
              }}
            >
              نقل
            </button>
            {/* أمثلة سريعة لتغيير النطاق الحالي */}
            {division?.id && (
              <button
                className="px-3 py-2 rounded-lg bg-slate-100 hover:bg-slate-200"
                onClick={async () => {
                  await updateEmployee(empId, {
                    scope: "division",
                    scopeId: division.id,
                  });
                  await fetchData();
                }}
              >
                تعيين على الشعبة الحالية
              </button>
            )}
            {department?.id && (
              <button
                className="px-3 py-2 rounded-lg bg-slate-100 hover:bg-slate-200"
                onClick={async () => {
                  await updateEmployee(empId, {
                    scope: "department",
                    scopeId: department.id,
                  });
                  await fetchData();
                }}
              >
                تعيين على الدائرة الحالية
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Edit Employee Modal */}
      {editOpen && (
        <div className="fixed inset-0 bg-black/30 grid place-items-center z-50">
          <div className="bg-white w-[520px] rounded-xl p-5 shadow-lg">
            <h3 className="text-lg font-bold mb-3">تعديل بيانات الموظّف</h3>
            <div className="grid gap-2">
              <label className="block text-sm">
                الاسم
                <input
                  className="mt-1 w-full border rounded-lg px-3 py-2"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </label>
              <label className="block text-sm">
                المسمّى
                <input
                  className="mt-1 w-full border rounded-lg px-3 py-2"
                  value={position}
                  onChange={(e) => setPosition(e.target.value)}
                />
              </label>
              <label className="block text-sm">
                الهاتف
                <input
                  className="mt-1 w-full border rounded-lg px-3 py-2"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </label>
              <label className="block text-sm">
                ملاحظة
                <input
                  className="mt-1 w-full border rounded-lg px-3 py-2"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                />
              </label>
            </div>
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
                  await updateEmployee(empId, { name, position, phone, note });
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
    </div>
  );
};

export default EmployeePage;
