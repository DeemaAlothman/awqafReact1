// src/components/Sidebar.tsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Directorate } from "../types/directorate";
import { Department } from "../types/department";
import { ChevronRight, ChevronDown, Search, Plus } from "lucide-react";
import {
  getDepartmentsByDirectorate,
  createDepartment,
} from "../api/department";

/* ============ مودال عام ============ */
type BaseModalProps = {
  title: string;
  fields: React.ReactNode;
  onCancel: () => void;
  onSave: () => void | Promise<void>;
  saving?: boolean;
};

const ModalCard: React.FC<BaseModalProps> = ({
  title,
  fields,
  onCancel,
  onSave,
  saving,
}) => (
  <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
    <div className="bg-white w-[460px] rounded-xl p-4 shadow-lg">
      <h3 className="text-lg font-bold mb-3">{title}</h3>
      <div>{fields}</div>
      <div className="flex justify-end gap-2 mt-4">
        <button
          className="px-3 py-2 rounded-lg bg-slate-100 hover:bg-slate-200"
          onClick={onCancel}
          disabled={!!saving}
        >
          إلغاء
        </button>
        <button
          className="px-3 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-60"
          onClick={onSave}
          disabled={!!saving}
        >
          {saving ? "جارِ الحفظ..." : "حفظ"}
        </button>
      </div>
    </div>
  </div>
);

/* ============ مودالات الإضافة السريعة ============ */
const AddDepartmentModal: React.FC<{
  directorateId: number;
  onClose: () => void;
  onSaved: () => Promise<void>;
}> = ({ directorateId, onClose, onSaved }) => {
  const [name, setName] = useState("");
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);

  return (
    <ModalCard
      title="إضافة دائرة جديدة"
      saving={saving}
      onCancel={onClose}
      onSave={async () => {
        if (!name.trim()) return;
        setSaving(true);
        await createDepartment({
          name: name.trim(),
          directorateId,
          note: note.trim() || undefined,
        });
        await onSaved();
        setSaving(false);
        onClose();
      }}
      fields={
        <>
          <label className="block text-sm mb-2">
            اسم الدائرة
            <input
              className="mt-1 w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="مثال: الشؤون الإدارية"
              required
            />
          </label>
          <label className="block text-sm">
            ملاحظة (اختياري)
            <input
              className="mt-1 w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="أي تفاصيل إضافية"
            />
          </label>
        </>
      }
    />
  );
};

const AddDivisionModal: React.FC<{
  departmentId: number;
  onClose: () => void;
  onSaved: () => Promise<void>;
}> = ({ departmentId, onClose, onSaved }) => {
  const [name, setName] = useState("");
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);

  return (
    <ModalCard
      title="إضافة شعبة جديدة"
      saving={saving}
      onCancel={onClose}
      onSave={async () => {
        if (!name.trim()) return;
        setSaving(true);
        await axios.post("http://localhost:3000/divisions", {
          name: name.trim(),
          departmentId,
          note: note.trim() || undefined,
        });
        await onSaved();
        setSaving(false);
        onClose();
      }}
      fields={
        <>
          <label className="block text-sm mb-2">
            اسم الشعبة
            <input
              className="mt-1 w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="مثال: الموارد البشرية"
              required
            />
          </label>
          <label className="block text-sm">
            ملاحظة (اختياري)
            <input
              className="mt-1 w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="أي تفاصيل إضافية"
            />
          </label>
        </>
      }
    />
  );
};

const AddOfficeModal: React.FC<{
  divisionId: number;
  onClose: () => void;
  onSaved: () => Promise<void>;
}> = ({ divisionId, onClose, onSaved }) => {
  const [name, setName] = useState("");
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);

  return (
    <ModalCard
      title="إضافة مكتب جديد"
      saving={saving}
      onCancel={onClose}
      onSave={async () => {
        if (!name.trim()) return;
        setSaving(true);
        await axios.post("http://localhost:3000/offices", {
          name: name.trim(),
          divisionId,
          note: note.trim() || undefined,
        });
        await onSaved();
        setSaving(false);
        onClose();
      }}
      fields={
        <>
          <label className="block text-sm mb-2">
            اسم المكتب
            <input
              className="mt-1 w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="مثال: مكتب التوظيف"
              required
            />
          </label>
          <label className="block text-sm">
            ملاحظة (اختياري)
            <input
              className="mt-1 w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="أي تفاصيل إضافية"
            />
          </label>
        </>
      }
    />
  );
};

const AddEmployeeModal: React.FC<{
  officeId: number;
  onClose: () => void;
  onSaved: () => Promise<void>;
}> = ({ officeId, onClose, onSaved }) => {
  const [name, setName] = useState("");
  const [position, setPosition] = useState("");
  const [phone, setPhone] = useState("");
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);

  return (
    <ModalCard
      title="إضافة موظف"
      saving={saving}
      onCancel={onClose}
      onSave={async () => {
        if (!name.trim()) return;
        setSaving(true);
        await axios.post("http://localhost:3000/employees", {
          name: name.trim(),
          position: position.trim() || undefined,
          phone: phone.trim() || undefined,
          note: note.trim() || undefined,
          officeId,
        });
        await onSaved();
        setSaving(false);
        onClose();
      }}
      fields={
        <div className="space-y-2">
          <label className="block text-sm">
            الاسم
            <input
              className="mt-1 w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="مثال: أحمد محمود"
              required
            />
          </label>
          <label className="block text-sm">
            المسمّى (اختياري)
            <input
              className="mt-1 w-full border rounded-lg px-3 py-2"
              value={position}
              onChange={(e) => setPosition(e.target.value)}
              placeholder="مثال: موظف توظيف"
            />
          </label>
          <label className="block text-sm">
            الهاتف (اختياري)
            <input
              className="mt-1 w-full border rounded-lg px-3 py-2"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+963-9xx-xxx"
            />
          </label>
          <label className="block text-sm">
            ملاحظة (اختياري)
            <input
              className="mt-1 w-full border rounded-lg px-3 py-2"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="أي تفاصيل إضافية"
            />
          </label>
        </div>
      }
    />
  );
};

/* ============ السايدبار ============ */
interface Props {
  directorate: Directorate;
}

const Sidebar: React.FC<Props> = ({ directorate }) => {
  const navigate = useNavigate();

  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [openDept, setOpenDept] = useState<Record<number, boolean>>({});
  const [openDiv, setOpenDiv] = useState<Record<number, boolean>>({});
  const [query, setQuery] = useState("");

  // مودالات
  const [showAddDept, setShowAddDept] = useState(false);
  const [showAddDivFor, setShowAddDivFor] = useState<number | null>(null);
  const [showAddOfficeFor, setShowAddOfficeFor] = useState<number | null>(null);
  const [showAddEmpFor, setShowAddEmpFor] = useState<number | null>(null);

  const refetch = async () => {
    if (!directorate?.id) return;
    const data = await getDepartmentsByDirectorate(directorate.id, true);
    setDepartments(data || []);
  };

  useEffect(() => {
    const fetchDepartments = async () => {
      if (!directorate?.id) return;
      setLoading(true);
      try {
        await refetch();
      } catch (e) {
        console.error("Error fetching departments:", e);
        setDepartments([]);
      } finally {
        setLoading(false);
      }
    };
    fetchDepartments();
  }, [directorate?.id]);

  const toggleDept = (id: number) =>
    setOpenDept((prev) => ({ ...prev, [id]: !prev[id] }));
  const toggleDiv = (id: number) =>
    setOpenDiv((prev) => ({ ...prev, [id]: !prev[id] }));

  const filteredDepartments = query.trim()
    ? departments.filter((d) =>
        d.name.toLowerCase().includes(query.trim().toLowerCase())
      )
    : departments;

  return (
    <div
      className={`${
        isCollapsed ? "w-16" : "w-64"
      } h-screen bg-gradient-to-b from-white to-slate-100 text-slate-800 fixed right-0 transition-all duration-300 ease-in-out shadow-md border-l border-slate-200`}
      dir="rtl"
    >
      {/* Header */}
      <div className="p-4 border-b border-slate-200 flex items-center justify-between">
        {!isCollapsed && (
          <h2 className="text-xl font-bold bg-gradient-to-r from-green-500 to-emerald-500 bg-clip-text text-transparent">
            {directorate?.name || "المديرية"}
          </h2>
        )}
        <button
          onClick={() => setIsCollapsed((v) => !v)}
          className="p-1.5 rounded-lg hover:bg-slate-200 transition-colors"
          title={isCollapsed ? "توسيع" : "طيّ"}
        >
          <ChevronRight
            className={`w-4 h-4 text-slate-600 transition-transform ${
              isCollapsed ? "rotate-180" : ""
            }`}
          />
        </button>
      </div>

      {/* Search + Quick Add */}
      <div className="px-3 pt-3">
        {!isCollapsed && (
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute right-2 top-2.5 h-4 w-4 text-slate-400" />
              <input
                className="w-full pr-8 pl-2 py-1 rounded border border-slate-300 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                placeholder="بحث عن دائرة..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
            <button
              className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg shadow hover:opacity-95"
              title="إضافة دائرة"
              onClick={() => setShowAddDept(true)}
            >
              <Plus size={16} /> دائرة
            </button>
          </div>
        )}
      </div>

      {/* Body */}
      <div className="mt-4 px-2 overflow-y-auto h-[calc(100vh-160px)]">
        {loading ? (
          <div className="text-sm text-slate-500 p-3">جارِ التحميل…</div>
        ) : filteredDepartments.length === 0 ? (
          <div className="text-sm text-slate-500 p-3">لا توجد نتائج.</div>
        ) : (
          <ul className="space-y-1">
            {filteredDepartments.map((dept) => (
              <li key={dept.id} className="mb-1">
                {/* Department row */}
                <div className="flex items-center justify-between rounded-lg px-3 py-2.5 transition-all duration-200 group relative hover:bg-slate-200">
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => toggleDept(dept.id)}
                      className="p-1 hover:bg-slate-200 rounded"
                      title={openDept[dept.id] ? "طيّ" : "توسيع"}
                    >
                      {openDept[dept.id] ? (
                        <ChevronDown size={16} className="text-slate-600" />
                      ) : (
                        <ChevronRight size={16} className="text-slate-600" />
                      )}
                    </button>
                    {/* ← التنقّل لصفحة تفاصيل الدائرة */}
                    <span
                      className="font-semibold text-slate-700 cursor-pointer hover:text-emerald-600"
                      onClick={() => navigate(`/departments/${dept.id}`)}
                      title="عرض تفاصيل الدائرة"
                    >
                      {dept.name}
                    </span>
                  </div>

                  {!isCollapsed && (
                    <div className="flex items-center gap-2">
                      <span className="text-xs bg-slate-200 rounded px-2 py-0.5">
                        شعب: {dept.divisions?.length ?? 0}
                      </span>
                      <button
                        className="text-emerald-600 text-xs hover:underline"
                        onClick={() => setShowAddDivFor(dept.id)}
                      >
                        + شعبة
                      </button>
                    </div>
                  )}
                </div>

                {/* Divisions */}
                {openDept[dept.id] && (
                  <div className="ml-4 mt-1">
                    {dept.divisions && dept.divisions.length > 0 ? (
                      dept.divisions.map((div) => (
                        <div key={div.id} className="mb-1">
                          <div className="flex items-center justify-between rounded-lg px-3 py-2 hover:bg-slate-200">
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => toggleDiv(div.id)}
                                className="p-1 hover:bg-slate-200 rounded"
                                title={openDiv[div.id] ? "طيّ" : "توسيع"}
                              >
                                {openDiv[div.id] ? (
                                  <ChevronDown
                                    size={16}
                                    className="text-slate-600"
                                  />
                                ) : (
                                  <ChevronRight
                                    size={16}
                                    className="text-slate-600"
                                  />
                                )}
                              </button>
                              <span className="text-slate-700 text-[15px]">
                                {div.name}
                              </span>
                            </div>

                            {!isCollapsed && (
                              <div className="flex items-center gap-2">
                                <span className="text-[11px] bg-slate-200 rounded px-2 py-0.5">
                                  مكاتب: {div.offices?.length ?? 0}
                                </span>
                                <button
                                  className="text-emerald-600 text-xs hover:underline"
                                  onClick={() => setShowAddOfficeFor(div.id)}
                                >
                                  + مكتب
                                </button>
                              </div>
                            )}
                          </div>

                          {/* Offices */}
                          {openDiv[div.id] && (
                            <ul className="ml-6 mt-1">
                              {div.offices && div.offices.length > 0 ? (
                                div.offices.map((off) => (
                                  <li
                                    key={off.id}
                                    className="flex items-center justify-between px-3 py-1.5 text-sm rounded-lg hover:bg-slate-200"
                                  >
                                    <span className="text-slate-700">
                                      {off.name}
                                    </span>
                                    {!isCollapsed && (
                                      <button
                                        className="text-emerald-600 text-xs hover:underline"
                                        onClick={() => setShowAddEmpFor(off.id)}
                                      >
                                        + موظف
                                      </button>
                                    )}
                                  </li>
                                ))
                              ) : (
                                <li className="text-xs text-slate-500 px-3 py-1.5">
                                  لا يوجد مكاتب
                                </li>
                              )}
                            </ul>
                          )}
                        </div>
                      ))
                    ) : (
                      <div className="ml-2 text-xs text-slate-500 py-1">
                        لا يوجد شعب
                      </div>
                    )}
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Footer actions */}
      <div className="absolute bottom-4 left-0 right-0 px-2">
        <div className="flex gap-2">
          <button className="w-full px-3 py-2.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm">
            استيراد CSV
          </button>
        </div>
      </div>

      {/* Modals */}
      {showAddDept && (
        <AddDepartmentModal
          directorateId={directorate.id}
          onClose={() => setShowAddDept(false)}
          onSaved={async () => {
            await refetch();
          }}
        />
      )}

      {showAddDivFor !== null && (
        <AddDivisionModal
          departmentId={showAddDivFor}
          onClose={() => setShowAddDivFor(null)}
          onSaved={async () => {
            await refetch();
            setOpenDept((prev) => ({ ...prev, [showAddDivFor!]: true }));
          }}
        />
      )}

      {showAddOfficeFor !== null && (
        <AddOfficeModal
          divisionId={showAddOfficeFor}
          onClose={() => setShowAddOfficeFor(null)}
          onSaved={async () => {
            await refetch();
            setOpenDiv((prev) => ({ ...prev, [showAddOfficeFor!]: true }));
          }}
        />
      )}

      {showAddEmpFor !== null && (
        <AddEmployeeModal
          officeId={showAddEmpFor}
          onClose={() => setShowAddEmpFor(null)}
          onSaved={async () => {
            await refetch();
          }}
        />
      )}
    </div>
  );
};

export default Sidebar;
