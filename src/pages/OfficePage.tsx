// import React, { useEffect, useState } from "react";
// import { Link, useParams, useNavigate } from "react-router-dom";
// import { getOfficeById, updateOffice, deleteOffice } from "../api/office";
// import {
//   createEmployee, // ⬅️ من api/employee
//   updateEmployee,
//   deleteEmployee,
// } from "../api/employee";
// import { Pencil, Plus, Trash, ArrowRight } from "lucide-react";

// const OfficePage: React.FC = () => {
//   const { id } = useParams<{ id: string }>();
//   const officeId = Number(id);
//   const navigate = useNavigate();

//   const [office, setOffice] = useState<any>(null);
//   const [loading, setLoading] = useState(true);

//   // Modals: edit office
//   const [editOpen, setEditOpen] = useState(false);
//   const [name, setName] = useState("");
//   const [note, setNote] = useState("");

//   // Modal: add employee
//   const [addEmpOpen, setAddEmpOpen] = useState(false);
//   const [empName, setEmpName] = useState("");
//   const [empPosition, setEmpPosition] = useState("");
//   const [empPhone, setEmpPhone] = useState("");
//   const [empNote, setEmpNote] = useState("");

//   // Modal: edit employee
//   const [editEmpId, setEditEmpId] = useState<number | null>(null);
//   const [editEmpName, setEditEmpName] = useState("");
//   const [editEmpPosition, setEditEmpPosition] = useState("");
//   const [editEmpPhone, setEditEmpPhone] = useState("");
//   const [editEmpNote, setEditEmpNote] = useState("");

//   const fetchData = async () => {
//     setLoading(true);
//     try {
//       const data = await getOfficeById(officeId);
//       setOffice(data);
//       setName(data.name || "");
//       setNote(data.note || "");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (officeId) fetchData();
//   }, [officeId]);

//   if (loading) return <div className="p-6">جارِ التحميل…</div>;
//   if (!office) return <div className="p-6 text-red-600">المكتب غير موجود.</div>;

//   const division = office.division;
//   const department = division?.department;

//   return (
//     <div className="min-h-screen bg-slate-50" dir="rtl">
//       <div className="max-w-5xl mx-auto p-6">
//         {/* Breadcrumb */}
//         <div className="flex items-center gap-2 text-sm text-slate-600 mb-4">
//           <Link to="/" className="hover:text-emerald-600">
//             المديرية
//           </Link>
//           <ArrowRight className="w-4 h-4" />
//           {department ? (
//             <>
//               <Link
//                 to={`/departments/${department.id}`}
//                 className="hover:text-emerald-600"
//               >
//                 {department.name}
//               </Link>
//               <ArrowRight className="w-4 h-4" />
//               <Link
//                 to={`/divisions/${division.id}`}
//                 className="hover:text-emerald-600"
//               >
//                 {division.name}
//               </Link>
//               <ArrowRight className="w-4 h-4" />
//             </>
//           ) : null}
//           <span className="text-slate-800 font-medium">{office.name}</span>
//         </div>

//         {/* Header */}
//         <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-4 flex items-start justify-between">
//           <div>
//             <h1 className="text-2xl font-bold bg-gradient-to-r from-green-500 to-emerald-500 bg-clip-text text-transparent">
//               {office.name}
//             </h1>
//             {office.note && (
//               <p className="text-slate-600 mt-1">{office.note}</p>
//             )}
//           </div>
//           <div className="flex gap-2">
//             <button
//               className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700"
//               onClick={() => setEditOpen(true)}
//             >
//               <Pencil size={16} /> تعديل المكتب
//             </button>
//             <button
//               className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:opacity-95"
//               onClick={() => setAddEmpOpen(true)}
//             >
//               <Plus size={16} /> إضافة موظف
//             </button>
//           </div>
//         </div>

//         {/* Employees */}
//         <div className="mt-4">
//           <div className="text-slate-600 mb-2">
//             عدد الموظفين:{" "}
//             <span className="font-semibold">
//               {office.employees?.length ?? 0}
//             </span>
//           </div>

//           {office.employees?.length ? (
//             <div className="grid gap-3">
//               {office.employees.map((e: any) => (
//                 <div
//                   key={e.id}
//                   className="bg-white border border-slate-200 rounded-xl p-3 flex items-center justify-between"
//                 >
//                   <div>
//                     <Link
//                       to={`/employees/${e.id}`}
//                       className="font-medium text-slate-800 hover:text-emerald-600"
//                       title="عرض تفاصيل الموظف"
//                     >
//                       {e.name}
//                     </Link>
//                     <div className="text-xs text-slate-500">
//                       {e.position ? e.position : "بدون مسمّى"}
//                       {e.phone ? ` – ${e.phone}` : ""}
//                     </div>
//                     {e.note && (
//                       <div className="text-xs text-slate-500 mt-0.5">
//                         {e.note}
//                       </div>
//                     )}
//                   </div>

//                   <div className="flex items-center gap-2">
//                     <button
//                       className="px-2 py-1 rounded bg-white border hover:bg-slate-100 text-sm"
//                       onClick={() => {
//                         setEditEmpId(e.id);
//                         setEditEmpName(e.name);
//                         setEditEmpPosition(e.position || "");
//                         setEditEmpPhone(e.phone || "");
//                         setEditEmpNote(e.note || "");
//                       }}
//                     >
//                       تعديل
//                     </button>
//                     <button
//                       className="px-2 py-1 rounded bg-red-50 border border-red-200 text-red-700 hover:bg-red-100 text-sm"
//                       onClick={async () => {
//                         if (!confirm("حذف هذا الموظف؟")) return;
//                         await deleteEmployee(e.id);
//                         await fetchData();
//                       }}
//                     >
//                       <Trash className="inline w-4 h-4 -mt-0.5" /> حذف
//                     </button>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           ) : (
//             <div className="text-slate-500">لا يوجد موظفون بعد.</div>
//           )}
//         </div>
//       </div>

//       {/* Edit Office Modal */}
//       {editOpen && (
//         <div className="fixed inset-0 bg-black/30 grid place-items-center z-50">
//           <div className="bg-white w-[520px] rounded-xl p-5 shadow-lg">
//             <h3 className="text-lg font-bold mb-3">تعديل بيانات المكتب</h3>
//             <label className="block text-sm mb-2">
//               الاسم
//               <input
//                 className="mt-1 w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-emerald-500"
//                 value={name}
//                 onChange={(e) => setName(e.target.value)}
//               />
//             </label>
//             <label className="block text-sm">
//               ملاحظة (اختياري)
//               <input
//                 className="mt-1 w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-emerald-500"
//                 value={note}
//                 onChange={(e) => setNote(e.target.value)}
//               />
//             </label>
//             <div className="flex justify-end gap-2 mt-4">
//               <button
//                 className="px-3 py-2 rounded-lg bg-slate-100 hover:bg-slate-200"
//                 onClick={() => setEditOpen(false)}
//               >
//                 إلغاء
//               </button>
//               <button
//                 className="px-3 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700"
//                 onClick={async () => {
//                   await updateOffice(officeId, {
//                     name,
//                     note,
//                     divisionId: office?.division?.id,
//                   });
//                   await fetchData();
//                   setEditOpen(false);
//                 }}
//               >
//                 حفظ
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Add Employee Modal */}
//       {addEmpOpen && (
//         <div className="fixed inset-0 bg-black/30 grid place-items-center z-50">
//           <div className="bg-white w-[520px] rounded-xl p-5 shadow-lg">
//             <h3 className="text-lg font-bold mb-3">إضافة موظف</h3>
//             <div className="grid gap-2">
//               <label className="block text-sm">
//                 الاسم
//                 <input
//                   className="mt-1 w-full border rounded-lg px-3 py-2"
//                   value={empName}
//                   onChange={(e) => setEmpName(e.target.value)}
//                 />
//               </label>
//               <label className="block text-sm">
//                 المسمّى (اختياري)
//                 <input
//                   className="mt-1 w-full border rounded-lg px-3 py-2"
//                   value={empPosition}
//                   onChange={(e) => setEmpPosition(e.target.value)}
//                 />
//               </label>
//               <label className="block text-sm">
//                 الهاتف (اختياري)
//                 <input
//                   className="mt-1 w-full border rounded-lg px-3 py-2"
//                   value={empPhone}
//                   onChange={(e) => setEmpPhone(e.target.value)}
//                 />
//               </label>
//               <label className="block text-sm">
//                 ملاحظة (اختياري)
//                 <input
//                   className="mt-1 w-full border rounded-lg px-3 py-2"
//                   value={empNote}
//                   onChange={(e) => setEmpNote(e.target.value)}
//                 />
//               </label>
//             </div>
//             <div className="flex justify-end gap-2 mt-4">
//               <button
//                 className="px-3 py-2 rounded-lg bg-slate-100 hover:bg-slate-200"
//                 onClick={() => setAddEmpOpen(false)}
//               >
//                 إلغاء
//               </button>
//               <button
//                 className="px-3 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700"
//                 onClick={async () => {
//                   if (!empName.trim()) return;
//                   await createEmployee({
//                     name: empName.trim(),
//                     scope: "office", // ⬅️ الآن من api/employee
//                     scopeId: officeId,
//                     position: empPosition.trim() || undefined,
//                     phone: empPhone.trim() || undefined,
//                     note: empNote.trim() || undefined,
//                   });
//                   await fetchData();
//                   setEmpName("");
//                   setEmpPosition("");
//                   setEmpPhone("");
//                   setEmpNote("");
//                   setAddEmpOpen(false);
//                 }}
//               >
//                 حفظ
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Edit Employee Modal */}
//       {editEmpId !== null && (
//         <div className="fixed inset-0 bg-black/30 grid place-items-center z-50">
//           <div className="bg-white w-[520px] rounded-xl p-5 shadow-lg">
//             <h3 className="text-lg font-bold mb-3">تعديل موظف</h3>
//             <div className="grid gap-2">
//               <label className="block text-sm">
//                 الاسم
//                 <input
//                   className="mt-1 w-full border rounded-lg px-3 py-2"
//                   value={editEmpName}
//                   onChange={(e) => setEditEmpName(e.target.value)}
//                 />
//               </label>
//               <label className="block text-sm">
//                 المسمّى
//                 <input
//                   className="mt-1 w-full border rounded-lg px-3 py-2"
//                   value={editEmpPosition}
//                   onChange={(e) => setEditEmpPosition(e.target.value)}
//                 />
//               </label>
//               <label className="block text-sm">
//                 الهاتف
//                 <input
//                   className="mt-1 w-full border rounded-lg px-3 py-2"
//                   value={editEmpPhone}
//                   onChange={(e) => setEditEmpPhone(e.target.value)}
//                 />
//               </label>
//               <label className="block text-sm">
//                 ملاحظة
//                 <input
//                   className="mt-1 w-full border rounded-lg px-3 py-2"
//                   value={editEmpNote}
//                   onChange={(e) => setEditEmpNote(e.target.value)}
//                 />
//               </label>
//             </div>
//             <div className="flex justify-end gap-2 mt-4">
//               <button
//                 className="px-3 py-2 rounded-lg bg-slate-100 hover:bg-slate-200"
//                 onClick={() => setEditEmpId(null)}
//               >
//                 إلغاء
//               </button>
//               <button
//                 className="px-3 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700"
//                 onClick={async () => {
//                   await updateEmployee(editEmpId!, {
//                     name: editEmpName,
//                     position: editEmpPosition,
//                     phone: editEmpPhone,
//                     note: editEmpNote,
//                   });
//                   await fetchData();
//                   setEditEmpId(null);
//                 }}
//               >
//                 حفظ
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default OfficePage;



import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getOfficeById, updateOffice } from "../api/office";
import {
  createEmployee,
  updateEmployee,
  deleteEmployee,
} from "../api/employee";
import { useEmployees } from "../hooks/useEmployees";
import {
  Pencil,
  Plus,
  Trash2,
  ArrowRight,
  Users,
  Phone,
  FileText,
} from "lucide-react";

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

const OfficePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const officeId = Number(id);

  const [office, setOffice] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Edit Office
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState("");
  const [note, setNote] = useState("");

  // Add Employee
  const [showAddEmp, setShowAddEmp] = useState(false);
  const [empName, setEmpName] = useState("");
  const [empPosition, setEmpPosition] = useState("");
  const [empPhone, setEmpPhone] = useState("");
  const [empENote, setEmpENote] = useState("");

  // Edit Employee
  const [editingEmpId, setEditingEmpId] = useState<number | null>(null);
  const [editingEmpName, setEditingEmpName] = useState("");
  const [editingEmpPosition, setEditingEmpPosition] = useState("");
  const [editingEmpPhone, setEditingEmpPhone] = useState("");
  const [editingEmpNote, setEditingEmpNote] = useState("");

  const {
    employees,
    loading: empLoading,
    fetchEmployees,
  } = useEmployees("office", officeId);

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await getOfficeById(officeId);
      setOffice(data);
      setName(data.name || "");
      setNote(data.note || "");
      fetchEmployees();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (officeId) fetchData();
  }, [officeId]);

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

  if (!office) {
    return (
      <div className="min-h-screen bg-slate-50 grid place-items-center">
        <div className="text-center">
          <Users className="w-20 h-20 text-slate-300 mx-auto mb-4" />
          <p className="text-red-600 font-medium">المكتب غير موجود</p>
        </div>
      </div>
    );
  }

  const dept = office.department;

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
          <Link
            to={`/departments/${dept?.id}`}
            className="hover:text-slate-900 transition-colors font-medium"
          >
            {dept?.name}
          </Link>
          <ArrowRight className="w-4 h-4" />
          <span className="text-slate-800 font-semibold">{office.name}</span>
        </div>

        {/* Header Card */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm mb-6 flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">{office.name}</h1>
            {office.note && (
              <p className="text-slate-600 mt-1">{office.note}</p>
            )}
            <div className="flex items-center gap-4 mt-4">
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

        {/* Employees Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-slate-700" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-800">موظفو المكتب</h2>
              <span className="text-xs text-slate-500">
                {employees.length} موظف
              </span>
            </div>
          </div>

          <div className="space-y-3 max-h-[500px] overflow-y-auto">
            {empLoading ? (
              <div className="text-center py-12">
                <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                <p className="text-slate-500 text-sm">جارِ تحميل الموظفين...</p>
              </div>
            ) : employees.length ? (
              employees.map((emp) => (
                <div
                  key={emp.id}
                  className="bg-slate-50 border border-slate-200 rounded-xl p-4 hover:bg-slate-100 hover:border-slate-300 transition-all flex justify-between items-start"
                >
                  <div>
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

      {/* Edit Office Modal */}
      {editing && (
        <Modal
          title="تعديل بيانات المكتب"
          onClose={() => setEditing(false)}
          onSave={async () => {
            await updateOffice(officeId, { name, note });
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
              placeholder="أدخل اسم المكتب"
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

      {/* Add Employee Modal */}
      {showAddEmp && (
        <Modal
          title="إضافة موظف للمكتب"
          onClose={() => setShowAddEmp(false)}
          onSave={async () => {
            if (!empName.trim()) return;
            await createEmployee({
              name: empName.trim(),
              scope: "office",
              scopeId: officeId,
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

      {/* Edit Employee Modal */}
      {editingEmpId !== null && (
        <Modal
          title="تعديل بيانات الموظف"
          onClose={() => setEditingEmpId(null)}
          onSave={async () => {
            await updateEmployee(editingEmpId, {
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
              className="mt-1.5 w-full border-2 border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all"
              value={editingEmpName}
              onChange={(e) => setEditingEmpName(e.target.value)}
            />
          </label>
          <label className="block text-sm font-medium text-slate-700">
            المسمّى الوظيفي
            <input
              className="mt-1.5 w-full border-2 border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all"
              value={editingEmpPosition}
              onChange={(e) => setEditingEmpPosition(e.target.value)}
            />
          </label>
          <label className="block text-sm font-medium text-slate-700">
            رقم الهاتف
            <input
              className="mt-1.5 w-full border-2 border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all"
              value={editingEmpPhone}
              onChange={(e) => setEditingEmpPhone(e.target.value)}
            />
          </label>
          <label className="block text-sm font-medium text-slate-700">
            ملاحظة
            <textarea
              className="mt-1.5 w-full border-2 border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all resize-none"
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

export default OfficePage;
