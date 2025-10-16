// src/components/DepartmentTree.tsx
import React, { useMemo, useState } from "react";
import { Department } from "../types/department";
import {
  ChevronRight,
  ChevronDown,
  Plus,
  Search,
  Pencil,
  Trash,
} from "lucide-react";

type Props = {
  departments: Department[];
  loading?: boolean;
  error?: string;
  onAddDepartment?: (name: string, note?: string) => void;
  onEditDepartment?: (
    id: number,
    payload: { name?: string; note?: string }
  ) => void;
  onDeleteDepartment?: (id: number) => void;
};

const DepartmentTree: React.FC<Props> = ({
  departments,
  loading,
  error,
  onAddDepartment,
  onEditDepartment,
  onDeleteDepartment,
}) => {
  const [openDept, setOpenDept] = useState<Record<number, boolean>>({});
  const [openDiv, setOpenDiv] = useState<Record<number, boolean>>({});
  const [query, setQuery] = useState("");
  const [adding, setAdding] = useState(false);
  const [addName, setAddName] = useState("");
  const [addNote, setAddNote] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return departments;
    return departments.filter((d) => d.name.toLowerCase().includes(q));
  }, [departments, query]);

  const toggleDept = (id: number) =>
    setOpenDept((p) => ({ ...p, [id]: !p[id] }));
  const toggleDiv = (id: number) => setOpenDiv((p) => ({ ...p, [id]: !p[id] }));

  return (
    <div className="bg-gradient-to-b from-white to-slate-50 rounded-xl border border-slate-200 shadow-sm">
      {/* Header actions */}
      <div className="p-4 border-b border-slate-200 flex items-center justify-between">
        <div className="relative w-full max-w-md">
          <Search className="absolute right-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            className="w-full pr-8 pl-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            placeholder="ابحث عن دائرة..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <button
          onClick={() => setAdding((v) => !v)}
          className="ml-3 inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow hover:opacity-95"
        >
          <Plus size={16} /> دائرة جديدة
        </button>
      </div>

      {/* Add Row */}
      {adding && (
        <div className="px-4 pt-4 pb-2">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            <input
              className="col-span-1 md:col-span-1 px-3 py-2 rounded-lg border border-slate-300 focus:ring-emerald-500 focus:outline-none"
              placeholder="اسم الدائرة"
              value={addName}
              onChange={(e) => setAddName(e.target.value)}
            />
            <input
              className="col-span-1 md:col-span-2 px-3 py-2 rounded-lg border border-slate-300 focus:ring-emerald-500 focus:outline-none"
              placeholder="ملاحظة (اختياري)"
              value={addNote}
              onChange={(e) => setAddNote(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2 mt-2">
            <button
              onClick={async () => {
                if (!addName.trim()) return;
                await onAddDepartment?.(
                  addName.trim(),
                  addNote.trim() || undefined
                );
                setAddName("");
                setAddNote("");
                setAdding(false);
              }}
              className="px-3 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700"
            >
              حفظ
            </button>
            <button
              onClick={() => {
                setAdding(false);
                setAddName("");
                setAddNote("");
              }}
              className="px-3 py-2 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200"
            >
              إلغاء
            </button>
          </div>
        </div>
      )}

      {/* Body */}
      <div className="p-2">
        {loading && <div className="text-slate-500 p-4">جارِ التحميل…</div>}
        {error && <div className="text-red-600 p-4">{error}</div>}
        {!loading && !error && filtered.length === 0 && (
          <div className="text-slate-500 p-4">لا توجد دوائر مطابقة.</div>
        )}

        <ul className="space-y-1">
          {filtered.map((dept) => (
            <li
              key={dept.id}
              className="rounded-lg hover:bg-slate-100 px-2 py-1"
            >
              {/* Department row */}
              <div className="flex items-center justify-between px-2 py-2">
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => toggleDept(dept.id)}
                    className="p-1 rounded hover:bg-slate-200"
                    title={openDept[dept.id] ? "طيّ" : "توسيع"}
                  >
                    {openDept[dept.id] ? (
                      <ChevronDown size={18} className="text-slate-600" />
                    ) : (
                      <ChevronRight size={18} className="text-slate-600" />
                    )}
                  </button>
                  <div>
                    <div className="font-semibold text-slate-800">
                      {dept.name}
                    </div>
                    {dept.note && (
                      <div className="text-xs text-slate-500 mt-0.5">
                        {dept.note}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs bg-slate-200 rounded px-2 py-0.5">
                    شعب: {dept.divisions?.length ?? 0}
                  </span>
                  <button
                    onClick={() => {
                      const newName = prompt(
                        "تعديل اسم الدائرة:",
                        dept.name || ""
                      );
                      if (newName !== null)
                        onEditDepartment?.(dept.id, {
                          name: newName.trim() || dept.name,
                        });
                    }}
                    className="p-2 rounded-lg bg-white border hover:bg-slate-100"
                    title="تعديل"
                  >
                    <Pencil size={14} className="text-slate-700" />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm("حذف هذه الدائرة؟"))
                        onDeleteDepartment?.(dept.id);
                    }}
                    className="p-2 rounded-lg bg-white border hover:bg-red-50"
                    title="حذف"
                  >
                    <Trash size={14} className="text-red-600" />
                  </button>
                </div>
              </div>

              {/* Divisions */}
              {openDept[dept.id] && (
                <div className="ml-5">
                  {dept.divisions?.length ? (
                    dept.divisions.map((div) => (
                      <div
                        key={div.id}
                        className="rounded-lg hover:bg-slate-100 px-2 py-1"
                      >
                        <div className="flex items-center justify-between px-2 py-2">
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => toggleDiv(div.id)}
                              className="p-1 rounded hover:bg-slate-200"
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
                            <div>
                              <div className="text-slate-700">{div.name}</div>
                              {div.note && (
                                <div className="text-xs text-slate-500 mt-0.5">
                                  {div.note}
                                </div>
                              )}
                            </div>
                          </div>
                          <span className="text-[11px] bg-slate-200 rounded px-2 py-0.5">
                            مكاتب: {div.offices?.length ?? 0}
                          </span>
                        </div>

                        {/* Offices */}
                        {openDiv[div.id] && (
                          <ul className="ml-6">
                            {div.offices?.length ? (
                              div.offices.map((off) => (
                                <li
                                  key={off.id}
                                  className="px-3 py-1.5 text-sm rounded hover:bg-slate-100"
                                >
                                  {off.name}
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
                    <div className="text-xs text-slate-500 px-3 py-1.5">
                      لا يوجد شعب
                    </div>
                  )}
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default DepartmentTree;
