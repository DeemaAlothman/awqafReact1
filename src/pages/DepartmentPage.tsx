// import React, { useEffect, useState } from "react";
// import { useParams, Link } from "react-router-dom";
// import { Department } from "../types/department";
// import {
//   getDepartmentById,
//   updateDepartment,
//   createDivision,
// } from "../api/department";
// import {
//   createEmployee,
//   deleteEmployee,
//   updateEmployee,
// } from "../api/employee";
// import { Pencil, Plus, ArrowRight, Trash2 } from "lucide-react";

// const DepartmentPage: React.FC = () => {
//   const { id } = useParams<{ id: string }>();
//   const deptId = Number(id);

//   const [dept, setDept] = useState<Department | null>(null);
//   const [loading, setLoading] = useState(true);

//   // modals
//   const [showEdit, setShowEdit] = useState(false);
//   const [showAddDivision, setShowAddDivision] = useState(false);
//   const [showAddEmp, setShowAddEmp] = useState(false);
//   const [showEditEmp, setShowEditEmp] = useState(false);

//   // dept form
//   const [name, setName] = useState("");
//   const [note, setNote] = useState("");

//   // division form
//   const [divName, setDivName] = useState("");
//   const [divNote, setDivNote] = useState("");

//   // employee form
//   const [empName, setEmpName] = useState("");
//   const [empPosition, setEmpPosition] = useState("");
//   const [empPhone, setEmpPhone] = useState("");
//   const [empENote, setEmpENote] = useState("");

//   // employees list
//   const [employees, setEmployees] = useState<any[]>([]);
//   const [selectedEmp, setSelectedEmp] = useState<any>(null);

//   const fetchData = async () => {
//     setLoading(true);
//     try {
//       const data = await getDepartmentById(deptId);
//       setDept(data);
//       setName(data.name || "");
//       setNote((data as any).note || "");
//       if (data.employees) {
//         setEmployees(data.employees);
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (deptId) fetchData();
//   }, [deptId]);

//   if (loading) return <div className="p-6">جارِ التحميل…</div>;
//   if (!dept) return <div className="p-6 text-red-600">الدائرة غير موجودة.</div>;

//   return (
//     <div className="min-h-screen bg-slate-50" dir="rtl">
//       <div className="max-w-5xl mx-auto p-6">
//         {/* Breadcrumb */}
//         <div className="flex items-center gap-2 text-sm text-slate-600 mb-4">
//           <Link to="/" className="hover:text-emerald-600">
//             المديرية
//           </Link>
//           <ArrowRight className="w-4 h-4" />
//           <span className="text-slate-800 font-medium">{dept.name}</span>
//         </div>

//         {/* Header Card */}
//         <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-4 flex items-start justify-between">
//           <div>
//             <h1 className="text-2xl font-bold bg-gradient-to-r from-green-500 to-emerald-500 bg-clip-text text-transparent">
//               {dept.name}
//             </h1>
//             {(dept as any).note && (
//               <p className="text-slate-600 mt-1">{(dept as any).note}</p>
//             )}
//           </div>
//           <div className="flex gap-2">
//             <button
//               className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700"
//               onClick={() => setShowEdit(true)}
//             >
//               <Pencil size={16} /> تعديل الدائرة
//             </button>
//             <button
//               className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:opacity-95"
//               onClick={() => setShowAddEmp(true)}
//             >
//               <Plus size={16} /> موظف
//             </button>
//           </div>
//         </div>

//         {/* Actions */}
//         <div className="mt-4 flex items-center justify-between">
//           <div className="text-slate-600">
//             عدد الشعب:{" "}
//             <span className="font-semibold">{dept.divisions?.length ?? 0}</span>
//           </div>
//           <button
//             className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:opacity-95"
//             onClick={() => setShowAddDivision(true)}
//           >
//             <Plus size={16} /> إضافة شعبة
//           </button>
//         </div>

//         {/* Divisions list */}
//         <div className="mt-3 grid gap-3">
//           {(dept.divisions || []).length ? (
//             dept.divisions!.map((div) => (
//               <Link
//                 key={div.id}
//                 to={`/divisions/${div.id}`}
//                 className="block bg-white border border-slate-200 rounded-xl p-3 hover:border-emerald-300 hover:shadow"
//                 title="عرض تفاصيل الشعبة"
//               >
//                 <div className="flex items-center justify-between">
//                   <div>
//                     <div className="font-medium text-slate-800 hover:text-emerald-600">
//                       {div.name}
//                     </div>
//                     {div.note && (
//                       <div className="text-xs text-slate-500 mt-0.5">
//                         {div.note}
//                       </div>
//                     )}
//                   </div>
//                   <div className="text-xs bg-slate-200 rounded px-2 py-0.5">
//                     مكاتب: {div.offices?.length ?? 0}
//                   </div>
//                 </div>
//               </Link>
//             ))
//           ) : (
//             <div className="text-slate-500">لا توجد شعب بعد.</div>
//           )}
//         </div>

//         {/* Employees List */}
//         <div className="mt-8">
//           <h2 className="text-xl font-semibold mb-3">موظفو الدائرة</h2>
//           {employees.length ? (
//             <div className="grid gap-3">
//               {employees.map((emp) => (
//                 <div
//                   key={emp.id}
//                   className="bg-white border border-slate-200 rounded-xl p-4 flex items-center justify-between hover:shadow-sm"
//                 >
//                   <div>
//                     <div className="font-medium text-slate-800">{emp.name}</div>
//                     {emp.position && (
//                       <div className="text-sm text-slate-600">
//                         {emp.position}
//                       </div>
//                     )}
//                     {emp.phone && (
//                       <div className="text-sm text-slate-500">
//                         📞 {emp.phone}
//                       </div>
//                     )}
//                     {emp.note && (
//                       <div className="text-xs text-slate-400 mt-1">
//                         {emp.note}
//                       </div>
//                     )}
//                   </div>

//                   <div className="flex gap-2">
//                     <button
//                       onClick={() => {
//                         setSelectedEmp(emp);
//                         setEmpName(emp.name);
//                         setEmpPosition(emp.position || "");
//                         setEmpPhone(emp.phone || "");
//                         setEmpENote(emp.note || "");
//                         setShowEditEmp(true);
//                       }}
//                       className="p-2 rounded-lg bg-blue-100 text-blue-700 hover:bg-blue-200"
//                     >
//                       <Pencil size={16} />
//                     </button>

//                     <button
//                       onClick={async () => {
//                         if (confirm(`هل تريد حذف الموظف ${emp.name}؟`)) {
//                           await deleteEmployee(emp.id);
//                           await fetchData();
//                         }
//                       }}
//                       className="p-2 rounded-lg bg-red-100 text-red-700 hover:bg-red-200"
//                     >
//                       <Trash2 size={16} />
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

//       {/* Edit Department Modal */}
//       {showEdit && (
//         <div className="fixed inset-0 bg-black/30 grid place-items-center z-50">
//           <div className="bg-white w-[520px] rounded-xl p-5 shadow-lg">
//             <h3 className="text-lg font-bold mb-3">تعديل بيانات الدائرة</h3>
//             <label className="block text-sm mb-2">
//               الاسم
//               <input
//                 className="mt-1 w-full border rounded-lg px-3 py-2"
//                 value={name}
//                 onChange={(e) => setName(e.target.value)}
//               />
//             </label>
//             <label className="block text-sm">
//               ملاحظة (اختياري)
//               <input
//                 className="mt-1 w-full border rounded-lg px-3 py-2"
//                 value={note}
//                 onChange={(e) => setNote(e.target.value)}
//               />
//             </label>
//             <div className="flex justify-end gap-2 mt-4">
//               <button
//                 className="px-3 py-2 rounded-lg bg-slate-100 hover:bg-slate-200"
//                 onClick={() => setShowEdit(false)}
//               >
//                 إلغاء
//               </button>
//               <button
//                 className="px-3 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700"
//                 onClick={async () => {
//                   await updateDepartment(deptId, { name, note });
//                   await fetchData();
//                   setShowEdit(false);
//                 }}
//               >
//                 حفظ
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Add Division Modal */}
//       {showAddDivision && (
//         <div className="fixed inset-0 bg-black/30 grid place-items-center z-50">
//           <div className="bg-white w-[520px] rounded-xl p-5 shadow-lg">
//             <h3 className="text-lg font-bold mb-3">إضافة شعبة جديدة</h3>
//             <label className="block text-sm mb-2">
//               اسم الشعبة
//               <input
//                 className="mt-1 w-full border rounded-lg px-3 py-2"
//                 value={divName}
//                 onChange={(e) => setDivName(e.target.value)}
//               />
//             </label>
//             <label className="block text-sm">
//               ملاحظة (اختياري)
//               <input
//                 className="mt-1 w-full border rounded-lg px-3 py-2"
//                 value={divNote}
//                 onChange={(e) => setDivNote(e.target.value)}
//               />
//             </label>
//             <div className="flex justify-end gap-2 mt-4">
//               <button
//                 className="px-3 py-2 rounded-lg bg-slate-100 hover:bg-slate-200"
//                 onClick={() => setShowAddDivision(false)}
//               >
//                 إلغاء
//               </button>
//               <button
//                 className="px-3 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700"
//                 onClick={async () => {
//                   if (!divName.trim()) return;
//                   await createDivision({
//                     name: divName.trim(),
//                     departmentId: deptId,
//                     note: divNote.trim() || undefined,
//                   });
//                   await fetchData();
//                   setDivName("");
//                   setDivNote("");
//                   setShowAddDivision(false);
//                 }}
//               >
//                 حفظ
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Add Department Employee Modal */}
//       {showAddEmp && (
//         <div className="fixed inset-0 bg-black/30 grid place-items-center z-50">
//           <div className="bg-white w-[520px] rounded-xl p-5 shadow-lg">
//             <h3 className="text-lg font-bold mb-3">إضافة موظف للدائرة</h3>
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
//                   value={empENote}
//                   onChange={(e) => setEmpENote(e.target.value)}
//                 />
//               </label>
//             </div>
//             <div className="flex justify-end gap-2 mt-4">
//               <button
//                 className="px-3 py-2 rounded-lg bg-slate-100 hover:bg-slate-200"
//                 onClick={() => setShowAddEmp(false)}
//               >
//                 إلغاء
//               </button>
//               <button
//                 className="px-3 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700"
//                 onClick={async () => {
//                   if (!empName.trim()) return;
//                   await createEmployee({
//                     name: empName.trim(),
//                     scope: "department",
//                     scopeId: deptId,
//                     position: empPosition.trim() || undefined,
//                     phone: empPhone.trim() || undefined,
//                     note: empENote.trim() || undefined,
//                   });
//                   await fetchData();
//                   setEmpName("");
//                   setEmpPosition("");
//                   setEmpPhone("");
//                   setEmpENote("");
//                   setShowAddEmp(false);
//                 }}
//               >
//                 حفظ
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Edit Employee Modal */}
//       {showEditEmp && selectedEmp && (
//         <div className="fixed inset-0 bg-black/30 grid place-items-center z-50">
//           <div className="bg-white w-[520px] rounded-xl p-5 shadow-lg">
//             <h3 className="text-lg font-bold mb-3">
//               تعديل بيانات الموظف {selectedEmp.name}
//             </h3>
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
//                 المسمّى
//                 <input
//                   className="mt-1 w-full border rounded-lg px-3 py-2"
//                   value={empPosition}
//                   onChange={(e) => setEmpPosition(e.target.value)}
//                 />
//               </label>
//               <label className="block text-sm">
//                 الهاتف
//                 <input
//                   className="mt-1 w-full border rounded-lg px-3 py-2"
//                   value={empPhone}
//                   onChange={(e) => setEmpPhone(e.target.value)}
//                 />
//               </label>
//               <label className="block text-sm">
//                 ملاحظة
//                 <input
//                   className="mt-1 w-full border rounded-lg px-3 py-2"
//                   value={empENote}
//                   onChange={(e) => setEmpENote(e.target.value)}
//                 />
//               </label>
//             </div>
//             <div className="flex justify-end gap-2 mt-4">
//               <button
//                 className="px-3 py-2 rounded-lg bg-slate-100 hover:bg-slate-200"
//                 onClick={() => setShowEditEmp(false)}
//               >
//                 إلغاء
//               </button>
//               <button
//                 className="px-3 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
//                 onClick={async () => {
//                   await updateEmployee(selectedEmp.id, {
//                     name: empName.trim(),
//                     position: empPosition.trim() || undefined,
//                     phone: empPhone.trim() || undefined,
//                     note: empENote.trim() || undefined,
//                   });
//                   await fetchData();
//                   setShowEditEmp(false);
//                 }}
//               >
//                 حفظ التعديلات
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default DepartmentPage;



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

const DepartmentPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const deptId = Number(id);

  const [dept, setDept] = useState<Department | null>(null);
  const [loading, setLoading] = useState(true);

  // modals
  const [showEdit, setShowEdit] = useState(false);
  const [showAddDivision, setShowAddDivision] = useState(false);
  const [showAddEmp, setShowAddEmp] = useState(false);
  const [showEditEmp, setShowEditEmp] = useState(false);

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

  // employees list
  const [employees, setEmployees] = useState<any[]>([]);
  const [selectedEmp, setSelectedEmp] = useState<any>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await getDepartmentById(deptId);
      setDept(data);
      setName(data.name || "");
      setNote((data as any).note || "");
      if (data.employees) {
        setEmployees(data.employees);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (deptId) fetchData();
  }, [deptId]);

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

  if (!dept) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 grid place-items-center">
        <div className="text-center">
          <Building2 className="w-20 h-20 text-slate-300 mx-auto mb-4" />
          <p className="text-red-600 font-medium">الدائرة غير موجودة</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50/20 to-slate-100"
      dir="rtl"
    >
      <div className="max-w-6xl mx-auto p-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-slate-600 mb-6">
          <Link
            to="/"
            className="hover:text-emerald-600 transition-colors font-medium"
          >
            المديرية
          </Link>
          <ArrowRight className="w-4 h-4" />
          <span className="text-slate-800 font-semibold">{dept.name}</span>
        </div>

        {/* Header Card */}
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl p-6 shadow-xl text-white mb-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <Building2 className="w-8 h-8" />
                <h1 className="text-3xl font-bold">{dept.name}</h1>
              </div>
              {(dept as any).note && (
                <p className="text-green-50 text-sm max-w-2xl">
                  {(dept as any).note}
                </p>
              )}
              <div className="flex items-center gap-4 mt-4">
                <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
                  <div className="text-xs text-green-100">عدد الشعب</div>
                  <div className="text-xl font-bold">
                    {dept.divisions?.length ?? 0}
                  </div>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
                  <div className="text-xs text-green-100">عدد الموظفين</div>
                  <div className="text-xl font-bold">{employees.length}</div>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                className="px-4 py-2 rounded-lg bg-white/20 hover:bg-white/30 backdrop-blur-sm font-medium transition-all flex items-center gap-2"
                onClick={() => setShowEdit(true)}
              >
                <Pencil size={16} /> تعديل
              </button>
              <button
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white text-green-600 hover:bg-green-50 font-medium transition-all shadow-lg"
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
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Briefcase className="w-6 h-6 text-purple-600" />
                <h2 className="text-xl font-bold text-slate-800">الشعب</h2>
                <span className="bg-purple-100 text-purple-700 text-sm font-semibold px-2 py-1 rounded-lg">
                  {dept.divisions?.length ?? 0}
                </span>
              </div>
              <button
                className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-purple-600 text-white hover:from-purple-600 hover:to-purple-700 font-medium transition-all shadow-md text-sm"
                onClick={() => setShowAddDivision(true)}
              >
                <Plus size={16} /> إضافة
              </button>
            </div>

            <div className="space-y-3 max-h-[500px] overflow-y-auto">
              {(dept.divisions || []).length ? (
                dept.divisions!.map((div) => (
                  <Link
                    key={div.id}
                    to={`/divisions/${div.id}`}
                    className="block bg-gradient-to-r from-purple-50 to-white border-2 border-purple-200 rounded-xl p-4 hover:border-purple-400 hover:shadow-md transition-all"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="font-semibold text-slate-800 hover:text-purple-600 transition-colors mb-1">
                          {div.name}
                        </div>
                        {div.note && (
                          <div className="text-xs text-slate-500 mt-1 flex items-start gap-1">
                            <FileText className="w-3 h-3 mt-0.5 flex-shrink-0" />
                            <span>{div.note}</span>
                          </div>
                        )}
                      </div>
                      <div className="bg-purple-100 text-purple-700 text-xs font-semibold rounded-lg px-3 py-1">
                        {div.offices?.length ?? 0} مكتب
                      </div>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="text-center py-12">
                  <Briefcase className="w-16 h-16 text-slate-300 mx-auto mb-3" />
                  <p className="text-slate-500">لا توجد شعب بعد</p>
                </div>
              )}
            </div>
          </div>

          {/* Employees Section */}
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
            <div className="flex items-center gap-2 mb-4">
              <Users className="w-6 h-6 text-blue-600" />
              <h2 className="text-xl font-bold text-slate-800">
                موظفو الدائرة
              </h2>
              <span className="bg-blue-100 text-blue-700 text-sm font-semibold px-2 py-1 rounded-lg">
                {employees.length}
              </span>
            </div>

            <div className="space-y-3 max-h-[500px] overflow-y-auto">
              {employees.length ? (
                employees.map((emp) => (
                  <div
                    key={emp.id}
                    className="bg-gradient-to-l from-blue-50 to-white border-2 border-blue-200 rounded-xl p-4 hover:border-blue-400 hover:shadow-md transition-all"
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
                          <div className="text-sm text-blue-600 flex items-center gap-1">
                            <Phone className="w-3 h-3" />
                            {emp.phone}
                          </div>
                        )}
                        {emp.note && (
                          <div className="text-xs text-slate-400 mt-2 flex items-start gap-1">
                            <FileText className="w-3 h-3 mt-0.5 flex-shrink-0" />
                            <span>{emp.note}</span>
                          </div>
                        )}
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setSelectedEmp(emp);
                            setEmpName(emp.name);
                            setEmpPosition(emp.position || "");
                            setEmpPhone(emp.phone || "");
                            setEmpENote(emp.note || "");
                            setShowEditEmp(true);
                          }}
                          className="p-2 rounded-lg bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors"
                        >
                          <Pencil size={16} />
                        </button>

                        <button
                          onClick={async () => {
                            if (confirm(`هل تريد حذف الموظف ${emp.name}؟`)) {
                              await deleteEmployee(emp.id);
                              await fetchData();
                            }
                          }}
                          className="p-2 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 transition-colors"
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
      {showEdit && (
        <Modal
          title="تعديل بيانات الدائرة"
          onClose={() => setShowEdit(false)}
          onSave={async () => {
            await updateDepartment(deptId, { name, note });
            await fetchData();
            setShowEdit(false);
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
              className="mt-1.5 w-full border-2 border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all"
              value={divName}
              onChange={(e) => setDivName(e.target.value)}
              placeholder="أدخل اسم الشعبة"
            />
          </label>
          <label className="block text-sm font-medium text-slate-700">
            ملاحظة
            <textarea
              className="mt-1.5 w-full border-2 border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all resize-none"
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
            await fetchData();
            setEmpName("");
            setEmpPosition("");
            setEmpPhone("");
            setEmpENote("");
            setShowAddEmp(false);
          }}
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
              value={empENote}
              onChange={(e) => setEmpENote(e.target.value)}
              rows={3}
              placeholder="أي ملاحظات إضافية..."
            />
          </label>
        </Modal>
      )}

      {/* Edit Employee Modal */}
      {showEditEmp && selectedEmp && (
        <Modal
          title={`تعديل بيانات الموظف ${selectedEmp.name}`}
          onClose={() => setShowEditEmp(false)}
          onSave={async () => {
            await updateEmployee(selectedEmp.id, {
              name: empName.trim(),
              position: empPosition.trim() || undefined,
              phone: empPhone.trim() || undefined,
              note: empENote.trim() || undefined,
            });
            await fetchData();
            setShowEditEmp(false);
          }}
        >
          <label className="block text-sm font-medium text-slate-700">
            الاسم <span className="text-red-500">*</span>
            <input
              className="mt-1.5 w-full border-2 border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
              value={empName}
              onChange={(e) => setEmpName(e.target.value)}
            />
          </label>
          <label className="block text-sm font-medium text-slate-700">
            المسمّى الوظيفي
            <input
              className="mt-1.5 w-full border-2 border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
              value={empPosition}
              onChange={(e) => setEmpPosition(e.target.value)}
            />
          </label>
          <label className="block text-sm font-medium text-slate-700">
            رقم الهاتف
            <input
              className="mt-1.5 w-full border-2 border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
              value={empPhone}
              onChange={(e) => setEmpPhone(e.target.value)}
            />
          </label>
          <label className="block text-sm font-medium text-slate-700">
            ملاحظة
            <textarea
              className="mt-1.5 w-full border-2 border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all resize-none"
              value={empENote}
              onChange={(e) => setEmpENote(e.target.value)}
              rows={3}
            />
          </label>
        </Modal>
      )}
    </div>
  );
};

export default DepartmentPage;
