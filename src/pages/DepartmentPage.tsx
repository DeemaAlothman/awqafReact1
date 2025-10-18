import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Department } from "../types/department";
import {
  getDepartmentById,
  updateDepartment,
  createDivision,
} from "../api/department";
import {
  createEmployee,
  deleteEmployee,
  updateEmployee,
} from "../api/employee";
import {
  Pencil,
  Plus,
  ArrowRight,
  Trash2,
  Users,
  Briefcase,
  Building2,
  Phone,
  FileText,
  Home,
} from "lucide-react";
import { deleteDivision, updateDivision } from "../api/division";
import { useEmployees } from "../hooks/useEmployees";

const Modal: React.FC<{
  title: string;
  onClose: () => void;
  onSave: () => void | Promise<void>;
  children: React.ReactNode;
}> = ({ title, onClose, onSave, children }) => (
  <div className="fixed inset-0 bg-black/40 backdrop-blur-sm grid place-items-center z-50">
    <div className="bg-white w-[540px] rounded-2xl p-6 shadow-2xl border border-slate-200">
      <h3 className="text-xl font-bold mb-4 text-slate-800">{title}</h3>
      <div className="space-y-3">{children}</div>
      <div className="flex justify-end gap-3 mt-6">
        <button
          className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 font-medium text-slate-700 transition-colors"
          onClick={onClose}
        >
          إلغاء
        </button>
        <button
          className="px-4 py-2 rounded-lg bg-gradient-to-r from-emerald-500 to-green-600 text-white hover:from-emerald-600 hover:to-green-700 font-medium transition-all shadow-md hover:shadow-lg"
          onClick={onSave}
        >
          حفظ
        </button>
      </div>
    </div>
  </div>
);

const DepartmentPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const deptId = Number(id);

  const [dept, setDept] = useState<Department | null>(null);
  const [loading, setLoading] = useState(true);

  // modals
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState("");
  const [note, setNote] = useState("");

  const [showAddDivision, setShowAddDivision] = useState(false);
  const [divName, setDivName] = useState("");
  const [divNote, setDivNote] = useState("");

  const [showAddEmp, setShowAddEmp] = useState(false);
  const [empName, setEmpName] = useState("");
  const [empPosition, setEmpPosition] = useState("");
  const [empPhone, setEmpPhone] = useState("");
  const [empENote, setEmpENote] = useState("");

  const [editingDivisionId, setEditingDivisionId] = useState<number | null>(
    null
  );
  const [editingDivisionName, setEditingDivisionName] = useState("");
  const [editingDivisionNote, setEditingDivisionNote] = useState("");

  const [editingEmpId, setEditingEmpId] = useState<number | null>(null);
  const [editingEmpName, setEditingEmpName] = useState("");
  const [editingEmpPosition, setEditingEmpPosition] = useState("");
  const [editingEmpPhone, setEditingEmpPhone] = useState("");
  const [editingEmpNote, setEditingEmpNote] = useState("");

  const {
    employees,
    loading: empLoading,
    fetchEmployees,
  } = useEmployees("department", deptId);

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await getDepartmentById(deptId);
      setDept(data);
      setName(data.name || "");
      setNote((data as any).note || "");
      fetchEmployees();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (deptId) fetchData();
  }, [deptId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 grid place-items-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">جارِ التحميل...</p>
        </div>
      </div>
    );
  }

  if (!dept) {
    return (
      <div className="min-h-screen bg-slate-50 grid place-items-center">
        <div className="text-center">
          <Home className="w-20 h-20 text-slate-300 mx-auto mb-4" />
          <p className="text-red-600 font-medium">الدائرة غير موجودة</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50" dir="rtl">
      <div className="max-w-6xl mx-auto p-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-slate-600 mb-6">
          <Link
            to="/"
            className="hover:text-slate-900 transition-colors font-medium"
          >
            المديرية
          </Link>
          <ArrowRight className="w-4 h-4" />
          <span className="text-slate-800 font-semibold">{dept.name}</span>
        </div>

        {/* Header Card */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm mb-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center">
                  <Home className="w-6 h-6 text-slate-700" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-slate-800">
                    {dept.name}
                  </h1>
                  {note && (
                    <p className="text-slate-600 text-sm mt-1">{note}</p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-4 mt-4 mr-15">
                <div className="bg-slate-50 border border-slate-200 rounded-lg px-4 py-2">
                  <div className="text-xs text-slate-500">عدد الشعب</div>
                  <div className="text-xl font-bold text-slate-800">
                    {dept.divisions?.length ?? 0}
                  </div>
                </div>
                <div className="bg-slate-50 border border-slate-200 rounded-lg px-4 py-2">
                  <div className="text-xs text-slate-500">عدد الموظفين</div>
                  <div className="text-xl font-bold text-slate-800">
                    {employees.length}
                  </div>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition-all flex items-center gap-2"
                onClick={() => setEditing(true)}
              >
                <Pencil size={16} /> تعديل
              </button>
              <button
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-emerald-500 to-green-600 text-white hover:from-emerald-600 hover:to-green-700 font-medium transition-all shadow-md"
                onClick={() => setShowAddEmp(true)}
              >
                <Plus size={18} /> موظف
              </button>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Divisions Section */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                  <Briefcase className="w-5 h-5 text-slate-700" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-800">الشعب</h2>
                  <span className="text-xs text-slate-500">
                    {dept.divisions?.length ?? 0} شعبة
                  </span>
                </div>
              </div>
              <button
                className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-gradient-to-r from-emerald-500 to-green-600 text-white hover:from-emerald-600 hover:to-green-700 font-medium transition-all shadow-sm text-sm"
                onClick={() => setShowAddDivision(true)}
              >
                <Plus size={16} /> إضافة
              </button>
            </div>

            <div className="space-y-3 max-h-[500px] overflow-y-auto">
              {dept.divisions?.length ? (
                dept.divisions.map((div) => (
                  <div
                    key={div.id}
                    className="bg-slate-50 border border-slate-200 rounded-xl p-4 hover:bg-slate-100 hover:border-slate-300 transition-all"
                  >
                    <div className="flex items-start justify-between">
                      <Link
                        to={`/divisions/${div.id}`}
                        className="flex-1"
                        title="عرض تفاصيل الشعبة"
                      >
                        <div className="font-semibold text-slate-800 hover:text-slate-900 transition-colors mb-1">
                          {div.name}
                        </div>
                        {div.note && (
                          <div className="text-xs text-slate-500 flex items-start gap-1">
                            <FileText className="w-3 h-3 mt-0.5 flex-shrink-0" />
                            <span>{div.note}</span>
                          </div>
                        )}
                        <div className="text-xs text-purple-600 mt-1">
                          {div.offices?.length ?? 0} مكتب
                        </div>
                      </Link>
                      <div className="flex gap-2">
                        <button
                          className="p-2 rounded-lg bg-slate-200 text-slate-700 hover:bg-slate-300 transition-colors"
                          onClick={() => {
                            setEditingDivisionId(div.id);
                            setEditingDivisionName(div.name);
                            setEditingDivisionNote(div.note || "");
                          }}
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          className="p-2 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 transition-colors"
                          onClick={async () => {
                            if (!confirm("حذف هذه الشعبة؟")) return;
                            await deleteDivision(div.id);
                            await fetchData();
                          }}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12">
                  <Briefcase className="w-16 h-16 text-slate-300 mx-auto mb-3" />
                  <p className="text-slate-500">لا يوجد شعب بعد</p>
                </div>
              )}
            </div>
          </div>

          {/* Employees Section */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-slate-700" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-800">
                  موظفو الدائرة
                </h2>
                <span className="text-xs text-slate-500">
                  {employees.length} موظف
                </span>
              </div>
            </div>

            <div className="space-y-3 max-h-[500px] overflow-y-auto">
              {empLoading ? (
                <div className="text-center py-12">
                  <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                  <p className="text-slate-500 text-sm">
                    جارِ تحميل الموظفين...
                  </p>
                </div>
              ) : employees.length ? (
                employees.map((emp) => (
                  <div
                    key={emp.id}
                    className="bg-slate-50 border border-slate-200 rounded-xl p-4 hover:bg-slate-100 hover:border-slate-300 transition-all"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="font-semibold text-slate-800 mb-1">
                          {emp.name}
                        </div>
                        {emp.position && (
                          <div className="text-sm text-slate-600 mb-1">
                            💼 {emp.position}
                          </div>
                        )}
                        {emp.phone && (
                          <div className="text-sm text-slate-600 flex items-center gap-1">
                            <Phone className="w-3 h-3" />
                            {emp.phone}
                          </div>
                        )}
                        {emp.note && (
                          <div className="text-xs text-slate-500 mt-2 flex items-start gap-1">
                            <FileText className="w-3 h-3 mt-0.5 flex-shrink-0" />
                            <span>{emp.note}</span>
                          </div>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <button
                          className="p-2 rounded-lg bg-slate-200 text-slate-700 hover:bg-slate-300 transition-colors"
                          onClick={() => {
                            setEditingEmpId(emp.id);
                            setEditingEmpName(emp.name);
                            setEditingEmpPosition(emp.position || "");
                            setEditingEmpPhone(emp.phone || "");
                            setEditingEmpNote(emp.note || "");
                          }}
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          className="p-2 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 transition-colors"
                          onClick={async () => {
                            if (!confirm("حذف هذا الموظف؟")) return;
                            await deleteEmployee(emp.id);
                            await fetchEmployees();
                          }}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12">
                  <Users className="w-16 h-16 text-slate-300 mx-auto mb-3" />
                  <p className="text-slate-500">لا يوجد موظفون بعد</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Edit Department Modal */}
      {editing && (
        <Modal
          title="تعديل بيانات الدائرة"
          onClose={() => setEditing(false)}
          onSave={async () => {
            await updateDepartment(deptId, { name, note });
            await fetchData();
            setEditing(false);
          }}
        >
          <label className="block text-sm font-medium text-slate-700">
            الاسم <span className="text-red-500">*</span>
            <input
              className="mt-1.5 w-full border-2 border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="أدخل اسم الدائرة"
            />
          </label>
          <label className="block text-sm font-medium text-slate-700">
            ملاحظة
            <textarea
              className="mt-1.5 w-full border-2 border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all resize-none"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={3}
              placeholder="أي ملاحظات إضافية..."
            />
          </label>
        </Modal>
      )}

      {/* Add Division Modal */}
      {showAddDivision && (
        <Modal
          title="إضافة شعبة جديدة"
          onClose={() => setShowAddDivision(false)}
          onSave={async () => {
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
          <label className="block text-sm font-medium text-slate-700">
            اسم الشعبة <span className="text-red-500">*</span>
            <input
              className="mt-1.5 w-full border-2 border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-200 transition-all"
              value={divName}
              onChange={(e) => setDivName(e.target.value)}
              placeholder="مثال: شعبة التوظيف"
            />
          </label>
          <label className="block text-sm font-medium text-slate-700">
            ملاحظة
            <textarea
              className="mt-1.5 w-full border-2 border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-200 transition-all resize-none"
              value={divNote}
              onChange={(e) => setDivNote(e.target.value)}
              rows={3}
              placeholder="أي ملاحظات إضافية..."
            />
          </label>
        </Modal>
      )}

      {/* Add Employee Modal */}
      {showAddEmp && (
        <Modal
          title="إضافة موظف للدائرة"
          onClose={() => setShowAddEmp(false)}
          onSave={async () => {
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
            fetchEmployees();
          }}
        >
          <label className="block text-sm font-medium text-slate-700">
            الاسم <span className="text-red-500">*</span>
            <input
              className="mt-1.5 w-full border-2 border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-200 transition-all"
              value={empName}
              onChange={(e) => setEmpName(e.target.value)}
              placeholder="أدخل اسم الموظف"
            />
          </label>
          <label className="block text-sm font-medium text-slate-700">
            المسمّى الوظيفي
            <input
              className="mt-1.5 w-full border-2 border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-200 transition-all"
              value={empPosition}
              onChange={(e) => setEmpPosition(e.target.value)}
              placeholder="مثال: مدير، موظف، منسق..."
            />
          </label>
          <label className="block text-sm font-medium text-slate-700">
            رقم الهاتف
            <input
              className="mt-1.5 w-full border-2 border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-200 transition-all"
              value={empPhone}
              onChange={(e) => setEmpPhone(e.target.value)}
              placeholder="مثال: 0501234567"
            />
          </label>
          <label className="block text-sm font-medium text-slate-700">
            ملاحظة
            <textarea
              className="mt-1.5 w-full border-2 border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-200 transition-all resize-none"
              value={empENote}
              onChange={(e) => setEmpENote(e.target.value)}
              rows={3}
              placeholder="أي ملاحظات إضافية..."
            />
          </label>
        </Modal>
      )}

      {/* Edit Division Modal */}
      {editingDivisionId !== null && (
        <Modal
          title="تعديل الشعبة"
          onClose={() => setEditingDivisionId(null)}
          onSave={async () => {
            await updateDivision(editingDivisionId!, {
              name: editingDivisionName,
              note: editingDivisionNote,
              departmentId: deptId,
            });
            await fetchData();
            setEditingDivisionId(null);
          }}
        >
          <label className="block text-sm font-medium text-slate-700">
            الاسم <span className="text-red-500">*</span>
            <input
              className="mt-1.5 w-full border-2 border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-200 transition-all"
              value={editingDivisionName}
              onChange={(e) => setEditingDivisionName(e.target.value)}
            />
          </label>
          <label className="block text-sm font-medium text-slate-700">
            ملاحظة
            <textarea
              className="mt-1.5 w-full border-2 border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-200 transition-all resize-none"
              value={editingDivisionNote}
              onChange={(e) => setEditingDivisionNote(e.target.value)}
              rows={3}
            />
          </label>
        </Modal>
      )}

      {/* Edit Employee Modal */}
      {editingEmpId !== null && (
        <Modal
          title="تعديل بيانات الموظف"
          onClose={() => setEditingEmpId(null)}
          onSave={async () => {
            if (!editingEmpName.trim()) return;
            await updateEmployee(editingEmpId!, {
              name: editingEmpName.trim(),
              position: editingEmpPosition.trim() || undefined,
              phone: editingEmpPhone.trim() || undefined,
              note: editingEmpNote.trim() || undefined,
            });
            setEditingEmpId(null);
            fetchEmployees();
          }}
        >
          <label className="block text-sm font-medium text-slate-700">
            الاسم <span className="text-red-500">*</span>
            <input
              className="mt-1.5 w-full border-2 border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-200 transition-all"
              value={editingEmpName}
              onChange={(e) => setEditingEmpName(e.target.value)}
            />
          </label>
          <label className="block text-sm font-medium text-slate-700">
            المسمّى الوظيفي
            <input
              className="mt-1.5 w-full border-2 border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-200 transition-all"
              value={editingEmpPosition}
              onChange={(e) => setEditingEmpPosition(e.target.value)}
            />
          </label>
          <label className="block text-sm font-medium text-slate-700">
            رقم الهاتف
            <input
              className="mt-1.5 w-full border-2 border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-200 transition-all"
              value={editingEmpPhone}
              onChange={(e) => setEditingEmpPhone(e.target.value)}
            />
          </label>
          <label className="block text-sm font-medium text-slate-700">
            ملاحظة
            <textarea
              className="mt-1.5 w-full border-2 border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-200 transition-all resize-none"
              value={editingEmpNote}
              onChange={(e) => setEditingEmpNote(e.target.value)}
              rows={3}
            />
          </label>
        </Modal>
      )}
    </div>
  );
};

export default DepartmentPage;
