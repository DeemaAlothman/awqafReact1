import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDirectorate } from "../hooks/useDirectorate";
import DirectorateCard from "../components/DirectorateCard";
import DirectorateForm from "../components/DirectorateForm";
import { Directorate } from "../types/directorate";
import { Department } from "../types/department";
import { Employee } from "../types/employee";
import {
  ChevronRight,
  ChevronDown,
  Search,
  Plus,
  Network,
  List,
  Building2,
  Users,
  User,
  Phone,
  Briefcase,
  Edit,
  Trash2,
} from "lucide-react";
import axios from "axios";
import {
  getDepartmentsByDirectorate,
  createDepartment,
} from "../api/department";
import {
  createEmployee,
  getEmployeesByDirectorate,
  updateEmployee,
  deleteEmployee,
} from "../api/employee";

const Modal: React.FC<{
  title: string;
  onClose: () => void;
  onSave: () => void | Promise<void>;
  children: React.ReactNode;
}> = ({ title, onClose, onSave, children }) => (
  <div className="fixed inset-0 bg-black/40 backdrop-blur-sm grid place-items-center z-50">
    <div className="bg-white w-[520px] rounded-2xl p-6 shadow-2xl border border-slate-200">
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

const DirectoratesPage: React.FC = () => {
  const navigate = useNavigate();
const { directorate, loading, fetchDirectorate, updateDirectorate } =
  useDirectorate();

  const [showForm, setShowForm] = useState(false);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loadingDeps, setLoadingDeps] = useState(true);
  const [openDept, setOpenDept] = useState<Record<number, boolean>>({});
  const [openDiv, setOpenDiv] = useState<Record<number, boolean>>({});
  const [query, setQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"list" | "tree">("list");

  // حالة الموظفين
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loadingEmployees, setLoadingEmployees] = useState(false);
  const [showEmployees, setShowEmployees] = useState(false);

  // مودال إضافة/تعديل موظف
  const [addEmpOpen, setAddEmpOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [empName, setEmpName] = useState("");
  const [empPosition, setEmpPosition] = useState("");
  const [empPhone, setEmpPhone] = useState("");
  const [empNote, setEmpNote] = useState("");

  const refetchDeps = async () => {
    if (!directorate?.id) return;
    const data = await getDepartmentsByDirectorate(directorate.id, true);
    setDepartments(data || []);
  };

  const fetchEmployees = async () => {
    if (!directorate?.id) return;
    setLoadingEmployees(true);
    try {
      const data = await getEmployeesByDirectorate(directorate.id);
      setEmployees(data || []);
    } catch (error) {
      console.error("Error fetching employees:", error);
    } finally {
      setLoadingEmployees(false);
    }
  };

  useEffect(() => {
    const run = async () => {
      if (!directorate?.id) return;
      setLoadingDeps(true);
      try {
        await refetchDeps();
        await fetchEmployees();
      } finally {
        setLoadingDeps(false);
      }
    };
    run();
  }, [directorate?.id]);

  const handleAddEmployee = () => {
    setEditingEmployee(null);
    setEmpName("");
    setEmpPosition("");
    setEmpPhone("");
    setEmpNote("");
    setAddEmpOpen(true);
  };

  const handleEditEmployee = (emp: Employee) => {
    setEditingEmployee(emp);
    setEmpName(emp.name);
    setEmpPosition(emp.position || "");
    setEmpPhone(emp.phone || "");
    setEmpNote(emp.note || "");
    setAddEmpOpen(true);
  };

  const handleSaveEmployee = async () => {
    if (!empName.trim()) return;

    try {
      if (editingEmployee) {
        // تعديل موظف موجود
        await updateEmployee(editingEmployee.id, {
          name: empName.trim(),
          position: empPosition.trim() || undefined,
          phone: empPhone.trim() || undefined,
          note: empNote.trim() || undefined,
        });
      } else {
        // إضافة موظف جديد
        await createEmployee({
          name: empName.trim(),
          scope: "directorate",
          scopeId: directorate!.id,
          position: empPosition.trim() || undefined,
          phone: empPhone.trim() || undefined,
          note: empNote.trim() || undefined,
        });
      }

      await fetchEmployees();
      setAddEmpOpen(false);
      setEditingEmployee(null);
      setEmpName("");
      setEmpPosition("");
      setEmpPhone("");
      setEmpNote("");
    } catch (error) {
      console.error("Error saving employee:", error);
    }
  };


  
  const handleDeleteEmployee = async (id: number) => {
    if (!confirm("هل أنت متأكد من حذف هذا الموظف؟")) return;
    try {
      await deleteEmployee(id);
      await fetchEmployees();
    } catch (error) {
      console.error("Error deleting employee:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 grid place-items-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">جارِ التحميل...</p>
        </div>
      </div>
    );
  }

  if (!directorate) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 grid place-items-center">
        <div className="text-center">
          <Building2 className="w-20 h-20 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-600">لا توجد مديرية</p>
        </div>
      </div>
    );
  }

  const toggleDept = (id: number) =>
    setOpenDept((p) => ({ ...p, [id]: !p[id] }));
  const toggleDiv = (id: number) => setOpenDiv((p) => ({ ...p, [id]: !p[id] }));

  const filtered = query.trim()
    ? departments.filter((d) =>
        d.name.toLowerCase().includes(query.trim().toLowerCase())
      )
    : departments;

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/20 to-slate-100"
      dir="rtl"
    >
      <div className="max-w-7xl mx-auto p-6">
        {/* Header - بطاقة المديرية */}
        <div className="mb-6 bg-gradient-to-r from-emerald-500 to-green-600 rounded-2xl p-6 shadow-xl text-white">
          <div className="flex flex-col md:flex-row items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <Building2 className="w-8 h-8" />
                <h1 className="text-2xl font-bold">{directorate.name}</h1>
              </div>

              {/* تفاصيل المديرية */}
              <div className="flex flex-col md:flex-row items-start md:items-center gap-3 text-sm mb-4">
                {directorate.address && (
                  <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
                    <div className="text-xs text-emerald-100">العنوان</div>
                    <div className="text-base font-semibold text-white/90">
                      {directorate.address}
                    </div>
                  </div>
                )}
                {directorate.note && (
                  <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
                    <div className="text-xs text-emerald-100">ملاحظة</div>
                    <div className="text-base font-semibold text-white/90">
                      {directorate.note}
                    </div>
                  </div>
                )}
              </div>

              {/* إحصائيات الدوائر والشعب والموظفين */}
              <div className="flex items-center gap-4 mt-2">
                <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
                  <div className="text-xs text-emerald-100">عدد الدوائر</div>
                  <div className="text-xl font-bold">{departments.length}</div>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
                  <div className="text-xs text-emerald-100">عدد الشعب</div>
                  <div className="text-xl font-bold">
                    {departments.reduce(
                      (sum, d) => sum + (d.divisions?.length || 0),
                      0
                    )}
                  </div>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
                  <div className="text-xs text-emerald-100">عدد الموظفين</div>
                  <div className="text-xl font-bold">{employees.length}</div>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                className="px-4 py-2 rounded-lg bg-white/20 hover:bg-white/30 backdrop-blur-sm font-medium transition-all"
                onClick={() => setShowForm(true)}
              >
                تعديل
              </button>
              <button
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white text-emerald-600 hover:bg-emerald-50 font-medium transition-all shadow-lg"
                onClick={handleAddEmployee}
              >
                <Plus size={18} /> موظف
              </button>
            </div>
          </div>
        </div>

        {/* قسم موظفي المديرية */}
        <div className="mb-6 bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
          <div
            className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-blue-50 to-white border-b border-slate-200 cursor-pointer hover:bg-blue-50/80 transition-colors"
            onClick={() => setShowEmployees(!showEmployees)}
          >
            <div className="flex items-center gap-3">
              <Users className="w-6 h-6 text-blue-600" />
              <h2 className="text-xl font-bold text-slate-800">
                موظفو المديرية
              </h2>
              <span className="text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-medium">
                {employees.length}
              </span>
            </div>
            {showEmployees ? (
              <ChevronDown className="w-6 h-6 text-slate-600" />
            ) : (
              <ChevronRight className="w-6 h-6 text-slate-600" />
            )}
          </div>

          {showEmployees && (
            <div className="p-6">
              {loadingEmployees ? (
                <div className="text-center py-8">
                  <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                  <div className="text-sm text-slate-500">
                    جارِ تحميل الموظفين...
                  </div>
                </div>
              ) : employees.length === 0 ? (
                <div className="text-center py-8">
                  <User className="w-16 h-16 text-slate-300 mx-auto mb-3" />
                  <div className="text-slate-500 mb-4">
                    لا يوجد موظفين في المديرية
                  </div>
                  <button
                    className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-lg font-medium hover:shadow-lg transition-all"
                    onClick={handleAddEmployee}
                  >
                    <Plus size={18} /> إضافة موظف
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {employees.map((emp) => (
                    <div
                      key={emp.id}
                      className="bg-gradient-to-br from-white to-slate-50 rounded-xl border-2 border-slate-200 p-4 hover:shadow-lg hover:border-emerald-300 transition-all group"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-green-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                            {emp.name.charAt(0)}
                          </div>
                          <div>
                            <div className="font-bold text-slate-800 text-lg">
                              {emp.name}
                            </div>
                            {emp.position && (
                              <div className="flex items-center gap-1 text-sm text-slate-600">
                                <Briefcase className="w-3.5 h-3.5" />
                                {emp.position}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => handleEditEmployee(emp)}
                            className="p-1.5 rounded-lg hover:bg-blue-100 text-blue-600 transition-colors"
                            title="تعديل"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteEmployee(emp.id)}
                            className="p-1.5 rounded-lg hover:bg-red-100 text-red-600 transition-colors"
                            title="حذف"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {emp.phone && (
                        <div className="flex items-center gap-2 text-sm text-slate-600 mb-2">
                          <Phone className="w-4 h-4 text-emerald-600" />
                          <a
                            href={`tel:${emp.phone}`}
                            className="hover:text-emerald-600 transition-colors"
                          >
                            {emp.phone}
                          </a>
                        </div>
                      )}

                      {emp.note && (
                        <div className="mt-3 pt-3 border-t border-slate-200">
                          <p className="text-xs text-slate-500 line-clamp-2">
                            {emp.note}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Tabs Navigation */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 mb-6 overflow-hidden">
          <div className="flex border-b border-slate-200">
            <button
              className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 font-semibold transition-all ${
                activeTab === "list"
                  ? "bg-gradient-to-r from-emerald-500 to-green-600 text-white"
                  : "text-slate-600 hover:bg-slate-50"
              }`}
              onClick={() => setActiveTab("list")}
            >
              <List size={20} />
              <span>العرض القائمي</span>
            </button>
            <button
              className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 font-semibold transition-all ${
                activeTab === "tree"
                  ? "bg-gradient-to-r from-emerald-500 to-green-600 text-white"
                  : "text-slate-600 hover:bg-slate-50"
              }`}
              onClick={() => setActiveTab("tree")}
            >
              <Network size={20} />
              <span>الشجرة التنظيمية</span>
            </button>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === "list" ? (
              <>
                {/* شريط البحث والأدوات */}
                <div className="flex items-center gap-3 mb-6">
                  <div className="relative flex-1 max-w-md">
                    <Search className="absolute right-3 top-3 h-5 w-5 text-slate-400" />
                    <input
                      className="w-full pr-10 pl-4 py-3 rounded-xl border-2 border-slate-200 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all"
                      placeholder="ابحث عن دائرة..."
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                    />
                  </div>
                  <button
                    className="inline-flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-xl shadow-md hover:shadow-lg hover:from-emerald-600 hover:to-green-700 font-medium transition-all"
                    onClick={() => navigate("/departments")}
                  >
                    <Plus size={18} /> دائرة جديدة
                  </button>
                </div>

                {/* قائمة الدوائر */}
                {loadingDeps ? (
                  <div className="text-center py-12">
                    <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                    <div className="text-sm text-slate-500">
                      جارِ تحميل الدوائر...
                    </div>
                  </div>
                ) : filtered.length === 0 ? (
                  <div className="text-center py-12">
                    <Users className="w-16 h-16 text-slate-300 mx-auto mb-3" />
                    <div className="text-slate-500">
                      {query.trim() ? "لا توجد نتائج للبحث" : "لا توجد دوائر"}
                    </div>
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {filtered.map((dept) => (
                      <div
                        key={dept.id}
                        className="bg-white border-2 border-slate-200 rounded-xl shadow-sm hover:shadow-md transition-all overflow-hidden"
                      >
                        <div className="flex items-center justify-between px-5 py-4 bg-gradient-to-r from-slate-50 to-white">
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => toggleDept(dept.id)}
                              className="p-2 rounded-lg hover:bg-emerald-100 transition-colors"
                            >
                              {openDept[dept.id] ? (
                                <ChevronDown className="w-5 h-5 text-emerald-600" />
                              ) : (
                                <ChevronRight className="w-5 h-5 text-slate-600" />
                              )}
                            </button>
                            <div
                              className="font-bold text-slate-800 cursor-pointer hover:text-emerald-600 transition-colors text-lg"
                              onClick={() =>
                                navigate(`/departments/${dept.id}`)
                              }
                            >
                              {dept.name}
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-sm bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-lg px-3 py-1 font-medium">
                              {dept.divisions?.length ?? 0} شعبة
                            </span>
                          </div>
                        </div>

                        {openDept[dept.id] && (
                          <div className="px-5 pb-4 pt-2 bg-slate-50/50">
                            {dept.divisions?.length ? (
                              <div className="grid gap-3">
                                {dept.divisions.map((div) => (
                                  <div
                                    key={div.id}
                                    className="rounded-xl border-2 border-slate-200 bg-white overflow-hidden"
                                  >
                                    <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-purple-50 to-white">
                                      <div className="flex items-center gap-2">
                                        <button
                                          onClick={() => toggleDiv(div.id)}
                                          className="p-1.5 rounded-lg hover:bg-purple-100 transition-colors"
                                        >
                                          {openDiv[div.id] ? (
                                            <ChevronDown className="w-4 h-4 text-purple-600" />
                                          ) : (
                                            <ChevronRight className="w-4 h-4 text-slate-600" />
                                          )}
                                        </button>
                                        <div
                                          className="text-slate-800 cursor-pointer hover:text-purple-600 transition-colors font-semibold"
                                          onClick={() =>
                                            navigate(`/divisions/${div.id}`)
                                          }
                                        >
                                          {div.name}
                                        </div>
                                      </div>
                                      <span className="text-xs bg-purple-100 text-purple-700 border border-purple-200 rounded-lg px-2 py-1 font-medium">
                                        {div.offices?.length ?? 0} مكتب
                                      </span>
                                    </div>

                                    {openDiv[div.id] && (
                                      <div className="px-4 py-3 bg-purple-50/30">
                                        {div.offices?.length ? (
                                          <div className="grid gap-2">
                                            {div.offices.map((off) => (
                                              <div
                                                key={off.id}
                                                className="flex items-center px-4 py-2 rounded-lg bg-white border border-slate-200 hover:border-orange-300 hover:bg-orange-50/50 transition-all cursor-pointer"
                                                onClick={() =>
                                                  navigate(`/offices/${off.id}`)
                                                }
                                              >
                                                <div className="text-slate-700 hover:text-orange-600 font-medium">
                                                  {off.name}
                                                </div>
                                              </div>
                                            ))}
                                          </div>
                                        ) : (
                                          <div className="text-xs text-slate-500 text-center py-2">
                                            لا توجد مكاتب
                                          </div>
                                        )}
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <div className="text-xs text-slate-500 text-center py-3">
                                لا توجد شعب
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </>
            ) : (
              /* عرض الشجرة التنظيمية */
              <div className="text-center py-12">
                <Network className="w-20 h-20 text-emerald-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-slate-800 mb-2">
                  الشجرة التنظيمية
                </h3>
                <p className="text-slate-600 mb-6">
                  عرض الهيكل التنظيمي الكامل بشكل مرئي
                </p>
                <button
                  className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
                  onClick={() => navigate("/organization-tree")}
                >
                  عرض الشجرة التنظيمية
                </button>
              </div>
            )}
          </div>
        </div>

        {/* مودال تعديل المديرية */}
        {showForm && (
          <DirectorateForm
            initialData={directorate as Directorate}
            onSubmit={async (data) => {
              try {
                // استخدام دالة updateDirectorate من hook
                await updateDirectorate(data);
                setShowForm(false);
              } catch (err) {
                console.error("Error updating directorate:", err);
              }
            }}
            onClose={() => setShowForm(false)}
          />
        )}

        {/* مودال إضافة/تعديل موظف */}
        {addEmpOpen && (
          <Modal
            title={editingEmployee ? "تعديل موظف" : "إضافة موظف للمديرية"}
            onClose={() => {
              setAddEmpOpen(false);
              setEditingEmployee(null);
            }}
            onSave={handleSaveEmployee}
          >
            <label className="block text-sm font-medium text-slate-700">
              الاسم <span className="text-red-500">*</span>
              <input
                className="mt-1.5 w-full border-2 border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all"
                value={empName}
                onChange={(e) => setEmpName(e.target.value)}
                placeholder="أدخل اسم الموظف"
              />
            </label>
            <label className="block text-sm font-medium text-slate-700">
              المسمّى الوظيفي
              <input
                className="mt-1.5 w-full border-2 border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all"
                value={empPosition}
                onChange={(e) => setEmpPosition(e.target.value)}
                placeholder="مثال: مدير، موظف، منسق..."
              />
            </label>
            <label className="block text-sm font-medium text-slate-700">
              رقم الهاتف
              <input
                className="mt-1.5 w-full border-2 border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all"
                value={empPhone}
                onChange={(e) => setEmpPhone(e.target.value)}
                placeholder="مثال: 0501234567"
              />
            </label>
            <label className="block text-sm font-medium text-slate-700">
              ملاحظة
              <textarea
                className="mt-1.5 w-full border-2 border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all resize-none"
                value={empNote}
                onChange={(e) => setEmpNote(e.target.value)}
                rows={3}
                placeholder="أي ملاحظات إضافية..."
              />
            </label>
          </Modal>
        )}
      </div>
    </div>
  );
};

export default DirectoratesPage;
