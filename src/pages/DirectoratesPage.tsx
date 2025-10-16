import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDirectorate } from "../hooks/useDirectorate";
import DirectorateCard from "../components/DirectorateCard";
import DirectorateForm from "../components/DirectorateForm";
import { Directorate } from "../types/directorate";
import { Department } from "../types/department";
import { ChevronRight, ChevronDown, Search, Plus } from "lucide-react";
import axios from "axios";
import {
  getDepartmentsByDirectorate,
  createDepartment,
} from "../api/department";
import { createEmployee } from "../api/employee";

const Modal: React.FC<{
  title: string;
  onClose: () => void;
  onSave: () => void | Promise<void>;
  children: React.ReactNode;
}> = ({ title, onClose, onSave, children }) => (
  <div className="fixed inset-0 bg-black/30 grid place-items-center z-50">
    <div className="bg-white w-[520px] rounded-xl p-5 shadow-lg">
      <h3 className="text-lg font-bold mb-3">{title}</h3>
      <div className="space-y-2">{children}</div>
      <div className="flex justify-end gap-2 mt-4">
        <button
          className="px-3 py-2 rounded-lg bg-slate-100 hover:bg-slate-200"
          onClick={onClose}
        >
          إلغاء
        </button>
        <button
          className="px-3 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700"
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
  const { directorate, loading, fetchDirectorate } = useDirectorate();

  const [showForm, setShowForm] = useState(false);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loadingDeps, setLoadingDeps] = useState(true);
  const [openDept, setOpenDept] = useState<Record<number, boolean>>({});
  const [openDiv, setOpenDiv] = useState<Record<number, boolean>>({});
  const [query, setQuery] = useState("");

  // زر/مودال إضافة موظف للمديرية
  const [addEmpOpen, setAddEmpOpen] = useState(false);
  const [empName, setEmpName] = useState("");
  const [empPosition, setEmpPosition] = useState("");
  const [empPhone, setEmpPhone] = useState("");
  const [empNote, setEmpNote] = useState("");

  const refetchDeps = async () => {
    if (!directorate?.id) return;
    const data = await getDepartmentsByDirectorate(directorate.id, true);
    setDepartments(data || []);
  };

  useEffect(() => {
    const run = async () => {
      if (!directorate?.id) return;
      setLoadingDeps(true);
      try {
        await refetchDeps();
      } finally {
        setLoadingDeps(false);
      }
    };
    run();
  }, [directorate?.id]);

  if (loading) return <p className="p-6">Loading...</p>;
  if (!directorate) return <p className="p-6">No directorate found.</p>;

  const toggleDept = (id: number) =>
    setOpenDept((p) => ({ ...p, [id]: !p[id] }));
  const toggleDiv = (id: number) => setOpenDiv((p) => ({ ...p, [id]: !p[id] }));

  const filtered = query.trim()
    ? departments.filter((d) =>
        d.name.toLowerCase().includes(query.trim().toLowerCase())
      )
    : departments;

  return (
    <div className="min-h-screen bg-slate-50" dir="rtl">
      <div className="max-w-6xl mx-auto p-6">
        {/* بطاقة المديرية + زر إضافة موظف */}
        <div className="mb-4 bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex items-start justify-between">
          <div className="flex-1">
            <DirectorateCard
              directorate={directorate}
              onEdit={() => setShowForm(true)}
              onDelete={() => {}}
            />
          </div>
          <button
            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:opacity-95"
            onClick={() => setAddEmpOpen(true)}
            title="إضافة موظف تابع للمديرية"
          >
            <Plus size={16} /> موظف
          </button>
        </div>

        {/* شريط أدوات */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 mb-4 shadow-sm">
          <div className="flex items-center gap-2">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute right-2 top-2.5 h-4 w-4 text-slate-400" />
              <input
                className="w-full pr-8 pl-2 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                placeholder="بحث عن دائرة…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
            {/* إضافة دائرة */}
            <button
              className="inline-flex items-center gap-1 px-3 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg shadow hover:opacity-95"
              onClick={() => {
                // مودال إضافة دائرة كان عندك سابقًا؛ أبقيته لو لزم
                // أو تقدر تشيله إن ما بدك
                // setShowAddDept(true)
                navigate("/departments"); // أو أي سلوك تريده
              }}
            >
              <Plus size={16} /> دائرة
            </button>
          </div>
        </div>

        {/* قائمة الدوائر (بدون تغيير كبير) */}
        {loadingDeps ? (
          <div className="text-sm text-slate-500">جارِ تحميل الدوائر…</div>
        ) : filtered.length === 0 ? (
          <div className="text-sm text-slate-500">لا توجد دوائر.</div>
        ) : (
          <div className="grid gap-3">
            {filtered.map((dept) => (
              <div
                key={dept.id}
                className="bg-white border border-slate-200 rounded-xl shadow-sm"
              >
                <div className="flex items-center justify-between px-4 py-3">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleDept(dept.id)}
                      className="p-1 rounded hover:bg-slate-100"
                    >
                      {openDept[dept.id] ? (
                        <ChevronDown className="w-5 h-5 text-slate-600" />
                      ) : (
                        <ChevronRight className="w-5 h-5 text-slate-600" />
                      )}
                    </button>
                    <div
                      className="font-semibold text-slate-800 cursor-pointer hover:text-emerald-600"
                      onClick={() => navigate(`/departments/${dept.id}`)}
                      title="عرض تفاصيل الدائرة"
                    >
                      {dept.name}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs bg-slate-100 border border-slate-200 rounded px-2 py-1">
                      شعب: {dept.divisions?.length ?? 0}
                    </span>
                  </div>
                </div>

                {openDept[dept.id] && (
                  <div className="px-4 pb-3">
                    {dept.divisions?.length ? (
                      <div className="grid gap-2">
                        {dept.divisions.map((div) => (
                          <div
                            key={div.id}
                            className="rounded-lg border border-slate-200"
                          >
                            <div className="flex items-center justify-between px-3 py-2 bg-slate-50 rounded-t-lg">
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => toggleDiv(div.id)}
                                  className="p-1 rounded hover:bg-slate-100"
                                >
                                  {openDiv[div.id] ? (
                                    <ChevronDown className="w-4 h-4 text-slate-600" />
                                  ) : (
                                    <ChevronRight className="w-4 h-4 text-slate-600" />
                                  )}
                                </button>
                                <div
                                  className="text-slate-800 cursor-pointer hover:text-emerald-600"
                                  onClick={() =>
                                    navigate(`/divisions/${div.id}`)
                                  }
                                  title="عرض تفاصيل الشعبة"
                                >
                                  {div.name}
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-[11px] bg-white border border-slate-200 rounded px-2 py-0.5">
                                  مكاتب: {div.offices?.length ?? 0}
                                </span>
                              </div>
                            </div>

                            {openDiv[div.id] && (
                              <div className="px-3 py-2">
                                {div.offices?.length ? (
                                  <div className="grid gap-1">
                                    {div.offices.map((off) => (
                                      <div
                                        key={off.id}
                                        className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-slate-50"
                                      >
                                        <div
                                          className="text-slate-700 cursor-pointer hover:text-emerald-600"
                                          onClick={() =>
                                            navigate(`/offices/${off.id}`)
                                          }
                                          title="عرض تفاصيل المكتب"
                                        >
                                          {off.name}
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                ) : (
                                  <div className="text-xs text-slate-500 px-1 py-1">
                                    لا يوجد مكاتب
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-xs text-slate-500 px-1 py-1">
                        لا يوجد شعب
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* مودال تعديل/إنشاء المديرية */}
        {showForm && (
          <DirectorateForm
            initialData={directorate as Directorate}
            onSubmit={async (data) => {
              setShowForm(false);
              await fetchDirectorate();
            }}
            onClose={() => setShowForm(false)}
          />
        )}

        {/* مودال إضافة موظف للمديرية */}
        {addEmpOpen && (
          <Modal
            title="إضافة موظف للمديرية"
            onClose={() => setAddEmpOpen(false)}
            onSave={async () => {
              if (!empName.trim()) return;
              await createEmployee({
                name: empName.trim(),
                scope: "directorate",
                scopeId: directorate.id,
                position: empPosition.trim() || undefined,
                phone: empPhone.trim() || undefined,
                note: empNote.trim() || undefined,
              });
              setEmpName("");
              setEmpPosition("");
              setEmpPhone("");
              setEmpNote("");
              setAddEmpOpen(false);
            }}
          >
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
          </Modal>
        )}
      </div>
    </div>
  );
};

export default DirectoratesPage;
