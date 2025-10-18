// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import {
//   Building2,
//   Home,
//   Briefcase,
//   Users,
//   User,
//   ChevronDown,
//   ChevronUp,
//   Loader2,
//   ArrowRight,
// } from "lucide-react";
// import { useDirectorate } from "../hooks/useDirectorate";
// import { getDepartmentsByDirectorate } from "../api/department";
// import { Department } from "../types/department";

// const OrganizationTree: React.FC = () => {
//   const navigate = useNavigate();
//   const { directorate, loading: dirLoading } = useDirectorate();
//   const [expandedNodes, setExpandedNodes] = useState<Record<string, boolean>>(
//     {}
//   );
//   const [departments, setDepartments] = useState<Department[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchData = async () => {
//       if (!directorate?.id) return;
//       setLoading(true);
//       try {
//         // جلب الدوائر مع كل التفاصيل المتداخلة
//         const data = await getDepartmentsByDirectorate(directorate.id, true);
//         setDepartments(data || []);
//       } catch (error) {
//         console.error("Error fetching organization data:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, [directorate?.id]);

//   const toggleNode = (nodeId: string) => {
//     setExpandedNodes((prev) => ({
//       ...prev,
//       [nodeId]: !prev[nodeId],
//     }));
//   };

//   const getAllEmployees = (node: any): any[] => {
//     let employees: any[] = [];

//     if (node.departments) {
//       // مديرية
//       node.departments.forEach((dept: any) => {
//         employees = [...employees, ...getAllEmployees(dept)];
//       });
//     } else if (node.divisions) {
//       // دائرة
//       node.divisions.forEach((div: any) => {
//         employees = [...employees, ...getAllEmployees(div)];
//       });
//     } else if (node.offices) {
//       // شعبة
//       node.offices.forEach((office: any) => {
//         employees = [...employees, ...getAllEmployees(office)];
//       });
//     } else if (node.employees) {
//       // مكتب
//       employees = node.employees || [];
//     }

//     // إضافة موظفي العنصر نفسه إن وجدوا
//     if (node.directEmployees) {
//       employees = [...employees, ...node.directEmployees];
//     }

//     return employees;
//   };

//   interface NodeCardProps {
//     data: any;
//     icon: React.ComponentType<{ className?: string }>;
//     color: string;
//     bgColor: string;
//     showEmployees: boolean;
//     type: string;
//   }

//   const NodeCard: React.FC<NodeCardProps> = ({
//     data,
//     icon: Icon,
//     color,
//     bgColor,
//     showEmployees,
//     type,
//   }) => {
//     const isExpanded = expandedNodes[`${type}-${data.id}`];
//     const employees = getAllEmployees(data);
//     const hasEmployees = employees.length > 0;

//     const handleClick = () => {
//       if (hasEmployees) {
//         toggleNode(`${type}-${data.id}`);
//       }
//     };

//     const handleNavigate = (e: React.MouseEvent) => {
//       e.stopPropagation();
//       const routes: Record<string, string> = {
//         department: `/departments/${data.id}`,
//         division: `/divisions/${data.id}`,
//         office: `/offices/${data.id}`,
//       };
//       if (routes[type]) {
//         navigate(routes[type]);
//       }
//     };

//     return (
//       <div className="flex flex-col items-center">
//         <div
//           className={`${bgColor} ${color} rounded-xl shadow-lg px-6 py-4 min-w-[220px] text-center border-2 ${color.replace(
//             "text-",
//             "border-"
//           )} ${
//             hasEmployees ? "cursor-pointer" : ""
//           } hover:shadow-xl transition-all relative group`}
//           onClick={handleClick}
//         >
//           <div className="flex items-center justify-center gap-2 mb-1">
//             <Icon className="w-5 h-5" />
//             <span className="font-bold text-sm">{data.name}</span>
//           </div>
//           {hasEmployees && (
//             <div className="flex items-center justify-center gap-1 text-xs mt-2">
//               <Users className="w-3 h-3" />
//               <span>{employees.length} موظف</span>
//               {isExpanded ? (
//                 <ChevronUp className="w-4 h-4" />
//               ) : (
//                 <ChevronDown className="w-4 h-4" />
//               )}
//             </div>
//           )}
//           {type !== "directorate" && (
//             <button
//               onClick={handleNavigate}
//               className="absolute top-2 left-2 p-1 rounded-lg bg-white/50 hover:bg-white opacity-0 group-hover:opacity-100 transition-opacity"
//               title="عرض التفاصيل"
//             >
//               <ArrowRight className="w-4 h-4" />
//             </button>
//           )}
//         </div>

//         {isExpanded && showEmployees && employees.length > 0 && (
//           <>
//             <div className="w-0.5 h-6 bg-blue-400"></div>
//             <div className="bg-white rounded-xl shadow-xl p-4 border-2 border-blue-300 max-w-md z-10">
//               <div className="font-bold text-gray-700 mb-3 text-center border-b pb-2">
//                 قائمة الموظفين ({employees.length})
//               </div>
//               <div className="space-y-2 max-h-80 overflow-y-auto">
//                 {employees.map((emp: any) => (
//                   <div
//                     key={emp.id}
//                     className="bg-gradient-to-l from-blue-50 to-white rounded-lg px-3 py-2 border border-blue-200 hover:border-blue-400 transition-colors"
//                   >
//                     <div className="flex items-center gap-2">
//                       <User className="w-4 h-4 text-blue-600 flex-shrink-0" />
//                       <div className="flex-1">
//                         <div className="font-medium text-gray-800 text-sm">
//                           {emp.name}
//                         </div>
//                         {emp.position && (
//                           <div className="text-xs text-gray-500">
//                             {emp.position}
//                           </div>
//                         )}
//                         {emp.phone && (
//                           <div className="text-xs text-blue-600 mt-0.5">
//                             {emp.phone}
//                           </div>
//                         )}
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </>
//         )}
//       </div>
//     );
//   };

//   const Office: React.FC<{ office: any }> = ({ office }) => (
//     <div className="flex flex-col items-center">
//       <NodeCard
//         data={office}
//         icon={Users}
//         color="text-orange-700"
//         bgColor="bg-orange-100"
//         showEmployees={true}
//         type="office"
//       />
//     </div>
//   );

//   const Division: React.FC<{ division: any }> = ({ division }) => (
//     <div className="flex flex-col items-center">
//       <NodeCard
//         data={division}
//         icon={Briefcase}
//         color="text-purple-700"
//         bgColor="bg-purple-100"
//         showEmployees={true}
//         type="division"
//       />

//       {division.offices && division.offices.length > 0 && (
//         <>
//           <div className="w-0.5 h-8 bg-gray-400"></div>

//           {division.offices.length === 1 ? (
//             <Office office={division.offices[0]} />
//           ) : (
//             <>
//               <div className="relative">
//                 <div
//                   className="absolute top-0 right-0 left-0 h-0.5 bg-gray-400"
//                   style={{
//                     width: `${(division.offices.length - 1) * 280}px`,
//                     transform: "translateX(-50%)",
//                     left: "50%",
//                   }}
//                 ></div>
//               </div>

//               <div className="flex gap-8 pt-8">
//                 {division.offices.map((office: any) => (
//                   <div key={office.id} className="flex flex-col items-center">
//                     <div className="w-0.5 h-8 bg-gray-400 -mt-8"></div>
//                     <Office office={office} />
//                   </div>
//                 ))}
//               </div>
//             </>
//           )}
//         </>
//       )}
//     </div>
//   );

//   const Department: React.FC<{ department: any }> = ({ department }) => (
//     <div className="flex flex-col items-center">
//       <NodeCard
//         data={department}
//         icon={Home}
//         color="text-green-700"
//         bgColor="bg-green-100"
//         showEmployees={true}
//         type="department"
//       />

//       {department.divisions && department.divisions.length > 0 && (
//         <>
//           <div className="w-0.5 h-8 bg-gray-400"></div>

//           {department.divisions.length === 1 ? (
//             <Division division={department.divisions[0]} />
//           ) : (
//             <>
//               <div className="relative">
//                 <div
//                   className="absolute top-0 right-0 left-0 h-0.5 bg-gray-400"
//                   style={{
//                     width: `${(department.divisions.length - 1) * 400}px`,
//                     transform: "translateX(-50%)",
//                     left: "50%",
//                   }}
//                 ></div>
//               </div>

//               <div className="flex gap-12 pt-8">
//                 {department.divisions.map((division: any) => (
//                   <div key={division.id} className="flex flex-col items-center">
//                     <div className="w-0.5 h-8 bg-gray-400 -mt-8"></div>
//                     <Division division={division} />
//                   </div>
//                 ))}
//               </div>
//             </>
//           )}
//         </>
//       )}
//     </div>
//   );

//   const Directorate: React.FC<{ directorate: any }> = ({ directorate }) => (
//     <div className="flex flex-col items-center">
//       <NodeCard
//         data={directorate}
//         icon={Building2}
//         color="text-blue-700"
//         bgColor="bg-blue-100"
//         showEmployees={true}
//         type="directorate"
//       />

//       {departments.length > 0 && (
//         <>
//           <div className="w-0.5 h-12 bg-gray-400"></div>

//           {departments.length === 1 ? (
//             <Department department={departments[0]} />
//           ) : (
//             <>
//               <div className="relative">
//                 <div
//                   className="absolute top-0 right-0 left-0 h-0.5 bg-gray-400"
//                   style={{
//                     width: `${(departments.length - 1) * 600}px`,
//                     transform: "translateX(-50%)",
//                     left: "50%",
//                   }}
//                 ></div>
//               </div>

//               <div className="flex gap-16 pt-12">
//                 {departments.map((department) => (
//                   <div
//                     key={department.id}
//                     className="flex flex-col items-center"
//                   >
//                     <div className="w-0.5 h-12 bg-gray-400 -mt-12"></div>
//                     <Department department={department} />
//                   </div>
//                 ))}
//               </div>
//             </>
//           )}
//         </>
//       )}
//     </div>
//   );

//   if (dirLoading || loading) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 grid place-items-center">
//         <div className="text-center">
//           <Loader2 className="w-16 h-16 text-emerald-500 animate-spin mx-auto mb-4" />
//           <p className="text-slate-600 font-medium">
//             جارِ تحميل الهيكل التنظيمي...
//           </p>
//         </div>
//       </div>
//     );
//   }

//   if (!directorate) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 grid place-items-center">
//         <div className="text-center">
//           <Building2 className="w-20 h-20 text-slate-300 mx-auto mb-4" />
//           <p className="text-slate-600 font-medium">لا توجد مديرية</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div
//       className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-100 p-8 overflow-auto"
//       dir="rtl"
//     >
//       {/* Header */}
//       <div className="mb-8">
//         <div className="flex items-center justify-between mb-6">
//           <button
//             onClick={() => navigate(-1)}
//             className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-xl shadow-md hover:shadow-lg transition-all border border-slate-200"
//           >
//             <ArrowRight className="w-5 h-5" />
//             <span className="font-medium">رجوع</span>
//           </button>
//         </div>

//         <div className="text-center">
//           <h1 className="text-4xl font-bold text-slate-800 mb-3">
//             الهيكل التنظيمي
//           </h1>
//           <p className="text-slate-600 mb-6">
//             اضغط على أي عنصر لعرض الموظفين التابعين له
//           </p>

//           {/* Legend */}
//           <div className="inline-flex gap-6 bg-white rounded-xl shadow-lg px-8 py-4 border border-slate-200">
//             <div className="flex items-center gap-2">
//               <div className="w-5 h-5 bg-blue-100 border-2 border-blue-700 rounded-lg"></div>
//               <span className="text-sm font-semibold text-slate-700">
//                 مديرية
//               </span>
//             </div>
//             <div className="flex items-center gap-2">
//               <div className="w-5 h-5 bg-green-100 border-2 border-green-700 rounded-lg"></div>
//               <span className="text-sm font-semibold text-slate-700">
//                 دائرة
//               </span>
//             </div>
//             <div className="flex items-center gap-2">
//               <div className="w-5 h-5 bg-purple-100 border-2 border-purple-700 rounded-lg"></div>
//               <span className="text-sm font-semibold text-slate-700">شعبة</span>
//             </div>
//             <div className="flex items-center gap-2">
//               <div className="w-5 h-5 bg-orange-100 border-2 border-orange-700 rounded-lg"></div>
//               <span className="text-sm font-semibold text-slate-700">مكتب</span>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Tree */}
//       <div className="flex justify-center pb-12">
//         {departments.length === 0 ? (
//           <div className="text-center py-12 bg-white rounded-xl shadow-lg px-12 border border-slate-200">
//             <Building2 className="w-16 h-16 text-slate-300 mx-auto mb-3" />
//             <p className="text-slate-600 font-medium">
//               لا توجد دوائر في هذه المديرية
//             </p>
//           </div>
//         ) : (
//           <Directorate directorate={directorate} />
//         )}
//       </div>
//     </div>
//   );
// };

// export default OrganizationTree;
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Building2,
  Home,
  Briefcase,
  Users,
  User,
  ChevronDown,
  ChevronUp,
  Loader2,
  ArrowRight,
} from "lucide-react";
import { useDirectorate } from "../hooks/useDirectorate";
import { getDepartmentsByDirectorate } from "../api/department";
import {
  getEmployeesByDirectorate,
  getEmployeesByDepartment,
  getEmployeesByDivision,
  getEmployeesByOffice,
} from "../api/employee";
import { Department } from "../types/department";
import { Employee } from "../types/employee";

const OrganizationTree: React.FC = () => {
  const navigate = useNavigate();
  const { directorate, loading: dirLoading } = useDirectorate();
  const [expandedNodes, setExpandedNodes] = useState<Record<string, boolean>>(
    {}
  );
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [employeesCache, setEmployeesCache] = useState<
    Record<string, Employee[]>
  >({});

  useEffect(() => {
    const fetchData = async () => {
      if (!directorate?.id) return;
      setLoading(true);
      try {
        const data = await getDepartmentsByDirectorate(directorate.id, true);
        setDepartments(data || []);
      } catch (error) {
        console.error("Error fetching organization data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [directorate?.id]);

  const fetchEmployees = async (type: string, id: number) => {
    const cacheKey = `${type}-${id}`;

    if (employeesCache[cacheKey]) {
      return employeesCache[cacheKey];
    }

    try {
      let employees: Employee[] = [];

      switch (type) {
        case "directorate":
          employees = await getEmployeesByDirectorate(id);
          break;
        case "department":
          employees = await getEmployeesByDepartment(id);
          break;
        case "division":
          employees = await getEmployeesByDivision(id);
          break;
        case "office":
          employees = await getEmployeesByOffice(id);
          break;
      }

      setEmployeesCache((prev) => ({
        ...prev,
        [cacheKey]: employees,
      }));

      return employees;
    } catch (error) {
      console.error("Error fetching employees:", error);
      return [];
    }
  };

  const toggleNode = async (type: string, id: number) => {
    const nodeKey = `${type}-${id}`;
    const isExpanding = !expandedNodes[nodeKey];

    if (isExpanding) {
      await fetchEmployees(type, id);
    }

    setExpandedNodes((prev) => ({
      ...prev,
      [nodeKey]: isExpanding,
    }));
  };

  interface NodeCardProps {
    data: any;
    icon: React.ComponentType<{ className?: string }>;
    color: string;
    bgColor: string;
    type: string;
  }

  const NodeCard: React.FC<NodeCardProps> = ({
    data,
    icon: Icon,
    color,
    bgColor,
    type,
  }) => {
    const nodeKey = `${type}-${data.id}`;
    const isExpanded = expandedNodes[nodeKey];
    const employees = employeesCache[nodeKey] || [];

    return (
      <div className="flex flex-col items-center relative">
        <div
          className={`${bgColor} ${color} rounded-xl shadow-lg px-6 py-4 text-center border-2 ${color.replace(
            "text-",
            "border-"
          )} cursor-pointer hover:shadow-xl transition-all`}
          style={{ width: `${CARD_WIDTH}px` }}
          onClick={() => toggleNode(type, data.id)}
        >
          <div className="flex items-center justify-center gap-2 mb-1">
            <Icon className="w-5 h-5" />
            <span className="font-bold text-sm">{data.name}</span>
          </div>
          <div className="flex items-center justify-center gap-1 text-xs mt-2">
            <Users className="w-3 h-3" />
            <span>عرض الموظفين</span>
            {isExpanded ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </div>
        </div>

        {isExpanded && employees.length > 0 && (
          <div className="absolute top-full mt-2 z-50">
            <div className="bg-white rounded-xl shadow-2xl p-4 border-2 border-blue-300 min-w-[320px] max-w-md">
              <div className="font-bold text-gray-700 mb-3 text-center border-b pb-2">
                قائمة الموظفين ({employees.length})
              </div>
              <div className="space-y-2 max-h-80 overflow-y-auto">
                {employees.map((emp: Employee) => (
                  <div
                    key={emp.id}
                    className="bg-gradient-to-l from-blue-50 to-white rounded-lg px-3 py-2 border border-blue-200 hover:border-blue-400 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-blue-600 flex-shrink-0" />
                      <div className="flex-1">
                        <div className="font-medium text-gray-800 text-sm">
                          {emp.name}
                        </div>
                        {emp.position && (
                          <div className="text-xs text-gray-500">
                            {emp.position}
                          </div>
                        )}
                        {emp.phone && (
                          <div className="text-xs text-blue-600 mt-0.5">
                            {emp.phone}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {isExpanded && employees.length === 0 && (
          <div className="absolute top-full mt-2 z-50">
            <div className="bg-white rounded-xl shadow-xl p-4 border-2 border-slate-200 min-w-[280px]">
              <div className="text-sm text-slate-500 text-center">
                لا يوجد موظفين
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  // حساب عرض كل مستوى
  const CARD_WIDTH = 240;
  const MIN_SPACING = 80;

  const calculateNodeWidth = (
    node: any,
    level: "office" | "division" | "department"
  ): number => {
    if (level === "office") {
      return CARD_WIDTH;
    }

    if (level === "division") {
      const offices = node.offices || [];
      if (offices.length === 0) return CARD_WIDTH;
      if (offices.length === 1) return CARD_WIDTH;
      return offices.length * (CARD_WIDTH + MIN_SPACING) - MIN_SPACING;
    }

    if (level === "department") {
      const divisions = node.divisions || [];
      if (divisions.length === 0) return CARD_WIDTH;
      if (divisions.length === 1) {
        return calculateNodeWidth(divisions[0], "division");
      }
      const totalWidth = divisions.reduce((sum: number, div: any) => {
        return sum + calculateNodeWidth(div, "division");
      }, 0);
      return totalWidth + (divisions.length - 1) * MIN_SPACING;
    }

    return CARD_WIDTH;
  };

  const Office: React.FC<{ office: any }> = ({ office }) => (
    <div
      className="flex flex-col items-center"
      style={{ minWidth: `${CARD_WIDTH}px` }}
    >
      <NodeCard
        data={office}
        icon={Users}
        color="text-orange-700"
        bgColor="bg-orange-100"
        type="office"
      />
    </div>
  );

  const Division: React.FC<{ division: any }> = ({ division }) => {
    const hasOffices = division.offices && division.offices.length > 0;
    const divisionWidth = calculateNodeWidth(division, "division");

    return (
      <div
        className="flex flex-col items-center"
        style={{ width: `${divisionWidth}px` }}
      >
        <NodeCard
          data={division}
          icon={Briefcase}
          color="text-purple-700"
          bgColor="bg-purple-100"
          type="division"
        />

        {hasOffices && (
          <>
            <div className="w-0.5 h-12 bg-slate-400"></div>

            {division.offices.length === 1 ? (
              <Office office={division.offices[0]} />
            ) : (
              <>
                <div
                  className="relative h-px bg-slate-400 mx-auto"
                  style={{ width: `${divisionWidth - CARD_WIDTH / 2}px` }}
                ></div>

                <div className="flex gap-20 justify-center pt-12">
                  {division.offices.map((office: any) => (
                    <div key={office.id} className="flex flex-col items-center">
                      <div className="w-0.5 h-12 bg-slate-400 -mt-12"></div>
                      <Office office={office} />
                    </div>
                  ))}
                </div>
              </>
            )}
          </>
        )}
      </div>
    );
  };

  const Department: React.FC<{ department: any }> = ({ department }) => {
    const hasDivisions =
      department.divisions && department.divisions.length > 0;
    const departmentWidth = calculateNodeWidth(department, "department");

    return (
      <div
        className="flex flex-col items-center"
        style={{ width: `${departmentWidth}px` }}
      >
        <NodeCard
          data={department}
          icon={Home}
          color="text-green-700"
          bgColor="bg-green-100"
          type="department"
        />

        {hasDivisions && (
          <>
            <div className="w-0.5 h-12 bg-slate-400"></div>

            {department.divisions.length === 1 ? (
              <Division division={department.divisions[0]} />
            ) : (
              <>
                <div
                  className="relative h-px bg-slate-400 mx-auto"
                  style={{ width: `${departmentWidth - CARD_WIDTH / 2}px` }}
                ></div>

                <div className="flex gap-20 justify-center pt-12">
                  {department.divisions.map((division: any) => (
                    <div
                      key={division.id}
                      className="flex flex-col items-center"
                    >
                      <div className="w-0.5 h-12 bg-slate-400 -mt-12"></div>
                      <Division division={division} />
                    </div>
                  ))}
                </div>
              </>
            )}
          </>
        )}
      </div>
    );
  };

  const Directorate: React.FC<{ directorate: any }> = ({ directorate }) => {
    const totalWidth =
      departments.reduce((sum, dept) => {
        return sum + calculateNodeWidth(dept, "department");
      }, 0) +
      (departments.length - 1) * MIN_SPACING;

    return (
      <div
        className="flex flex-col items-center"
        style={{ width: departments.length === 1 ? "auto" : `${totalWidth}px` }}
      >
        <NodeCard
          data={directorate}
          icon={Building2}
          color="text-blue-700"
          bgColor="bg-blue-100"
          type="directorate"
        />

        {departments.length > 0 && (
          <>
            <div className="w-0.5 h-16 bg-slate-400"></div>

            {departments.length === 1 ? (
              <Department department={departments[0]} />
            ) : (
              <>
                <div
                  className="relative h-px bg-slate-400 mx-auto"
                  style={{ width: `${totalWidth - CARD_WIDTH / 2}px` }}
                ></div>

                <div className="flex gap-20 justify-center pt-16">
                  {departments.map((department) => (
                    <div
                      key={department.id}
                      className="flex flex-col items-center"
                    >
                      <div className="w-0.5 h-16 bg-slate-400 -mt-16"></div>
                      <Department department={department} />
                    </div>
                  ))}
                </div>
              </>
            )}
          </>
        )}
      </div>
    );
  };

  if (dirLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 grid place-items-center">
        <div className="text-center">
          <Loader2 className="w-16 h-16 text-emerald-500 animate-spin mx-auto mb-4" />
          <p className="text-slate-600 font-medium">
            جارِ تحميل الهيكل التنظيمي...
          </p>
        </div>
      </div>
    );
  }

  if (!directorate) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 grid place-items-center">
        <div className="text-center">
          <Building2 className="w-20 h-20 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-600 font-medium">لا توجد مديرية</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-100 p-8 overflow-auto"
      dir="rtl"
    >
      {/* Header */}
      <div className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-xl shadow-md hover:shadow-lg transition-all border border-slate-200"
          >
            <ArrowRight className="w-5 h-5" />
            <span className="font-medium">رجوع</span>
          </button>
        </div>

        <div className="text-center">
          <h1 className="text-4xl font-bold text-slate-800 mb-3">
            الهيكل التنظيمي
          </h1>
          <p className="text-slate-600 mb-6">
            اضغط على أي عنصر لعرض الموظفين التابعين له
          </p>

          {/* Legend */}
          <div className="inline-flex gap-6 bg-white rounded-xl shadow-lg px-8 py-4 border border-slate-200">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 bg-blue-100 border-2 border-blue-700 rounded-lg"></div>
              <span className="text-sm font-semibold text-slate-700">
                مديرية
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 bg-green-100 border-2 border-green-700 rounded-lg"></div>
              <span className="text-sm font-semibold text-slate-700">
                دائرة
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 bg-purple-100 border-2 border-purple-700 rounded-lg"></div>
              <span className="text-sm font-semibold text-slate-700">شعبة</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 bg-orange-100 border-2 border-orange-700 rounded-lg"></div>
              <span className="text-sm font-semibold text-slate-700">مكتب</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tree */}
      <div className="overflow-x-auto w-full pb-12">
        <div className="flex min-w-max px-4">
          {departments.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl shadow-lg px-12 border border-slate-200">
              <Building2 className="w-16 h-16 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-600 font-medium">
                لا توجد دوائر في هذه المديرية
              </p>
            </div>
          ) : (
            <Directorate directorate={directorate} />
          )}
        </div>
      </div>
    </div>
  );
};

export default OrganizationTree;