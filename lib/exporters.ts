/**
 * مُحوّلات السجلات إلى صفوف Excel بعناوين عربية.
 * تُستخدم في أزرار التصدير في كل قسم وفي "تصدير كل البيانات" بالإعدادات.
 */
import { computeRegionStats } from "./analytics";
import type {
  Donation,
  Employee,
  Expense,
  Investment,
  Student,
  Trainee,
  Volunteer,
} from "./store";
import type { ExportRow } from "./exportExcel";

export const studentRows = (list: Student[]): ExportRow[] =>
  list.map((s) => ({
    "الاسم": s.name,
    "المسار التعليمي": s.track,
    "المحافظة": s.governorate,
    "الحالة": s.status,
    "نسبة الإنجاز %": s.progress,
    "تاريخ التسجيل": s.enrolledAt,
  }));

export const volunteerRows = (list: Volunteer[]): ExportRow[] =>
  list.map((v) => ({
    "الاسم": v.name,
    "الدور": v.role,
    "المحافظة": v.governorate,
    "ساعات العمل (هذا الشهر)": v.hours,
    "تاريخ الانضمام": v.joinedAt,
  }));

export const donationRows = (list: Donation[]): ExportRow[] =>
  list.map((d) => ({
    "المتبرع": d.donor,
    "نوع المتبرع": d.type,
    "المبلغ (ل.س)": d.amount,
    "تاريخ التبرع": String(d.date).slice(0, 10),
  }));

export const expenseRows = (list: Expense[]): ExportRow[] =>
  list.map((e) => ({
    "الوصف": e.description,
    "البند": e.category,
    "المبلغ (ل.س)": e.amount,
    "تاريخ الصرف": e.date,
  }));

export const investmentRows = (list: Investment[]): ExportRow[] =>
  list.map((p) => ({
    "المشروع": p.name,
    "المحافظة": p.governorate,
    "الحالة": p.status,
    "المبلغ المستثمر (ل.س)": p.invested,
    "المبلغ المسترد (ل.س)": p.returned,
    "العائد على الاستثمار %": p.roi,
    "الوظائف المُنشأة": p.jobsCreated,
  }));

export const traineeRows = (list: Trainee[]): ExportRow[] =>
  list.map((t) => ({
    "الاسم": t.name,
    "المسار التدريبي": t.track,
    "المحافظة": t.governorate,
    "حالة التدريب": t.status,
    "تاريخ الالتحاق": t.date,
  }));

export const employeeRows = (list: Employee[]): ExportRow[] =>
  list.map((e) => ({
    "الاسم": e.name,
    "المسار التدريبي": e.track,
    "المحافظة": e.governorate,
    "جهة التشغيل": e.employer,
    "تاريخ التوظيف": e.date,
  }));

export const regionRows = (
  students: Student[],
  volunteers: Volunteer[],
  investments: Investment[]
): ExportRow[] =>
  computeRegionStats(students, volunteers, investments).map((r) => ({
    "المحافظة": r.name,
    "المستفيدون (طلاب)": r.beneficiaries,
    "المتطوعون": r.volunteers,
    "المشاريع الاستثمارية": r.projects,
  }));

/** كل أقسام المنصة كأوراق متعددة في ملف واحد */
export const allSheets = (data: {
  students: Student[];
  volunteers: Volunteer[];
  donations: Donation[];
  expenses: Expense[];
  investments: Investment[];
  trainees: Trainee[];
  employees: Employee[];
}) => [
  { name: "الطلاب", rows: studentRows(data.students) },
  { name: "المتطوعون", rows: volunteerRows(data.volunteers) },
  { name: "التبرعات", rows: donationRows(data.donations) },
  { name: "المصاريف", rows: expenseRows(data.expenses) },
  { name: "المشاريع الاستثمارية", rows: investmentRows(data.investments) },
  { name: "المتدربون", rows: traineeRows(data.trainees) },
  { name: "الموظفون", rows: employeeRows(data.employees) },
  {
    name: "التوزيع الجغرافي",
    rows: regionRows(data.students, data.volunteers, data.investments),
  },
];