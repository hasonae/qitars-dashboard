/**
 * محرك التحليلات — كل إحصائية في اللوحة تُحسب من السجلات مباشرة.
 * لا توجد أي أرقام ثابتة: الإضافة/التعديل/الحذف تنعكس فوراً هنا.
 */
import { EXPENSE_BUDGETS, EXPENSE_CATEGORIES, REGION_META, type RegionData } from "./data";
import type {
  Donation,
  Employee,
  Expense,
  Investment,
  Student,
  Trainee,
  Volunteer,
} from "./store";

export const AR_MONTHS = [
  "كانون الثاني", "شباط", "آذار", "نيسان", "أيار", "حزيران",
  "تموز", "آب", "أيلول", "تشرين الأول", "تشرين الثاني", "كانون الأول",
];

export const monthKey = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;

/** آخر n أشهر (من الأقدم إلى الشهر الحالي) */
export const lastNMonths = (n: number) => {
  const out: { key: string; label: string }[] = [];
  const now = new Date();
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    out.push({ key: monthKey(d), label: AR_MONTHS[d.getMonth()] });
  }
  return out;
};

const inCurrentMonth = (iso: string) => {
  const d = new Date(iso);
  const now = new Date();
  return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
};

// ─── الطلاب ──────────────────────────────────────────────────
export const computeStudentStats = (students: Student[]) => {
  const active = students.filter((s) => s.status === "نشط").length;
  const completed = students.filter((s) => s.status === "مكتمل").length;
  const withdrawn = students.filter((s) => s.status === "منسحب").length;
  const decided = completed + withdrawn;
  const completionRate = decided > 0 ? (completed / decided) * 100 : 0;
  const newThisMonth = students.filter((s) => inCurrentMonth(s.enrolledAt)).length;

  const trackNames = ["البرمجة", "اللغات", "التصميم", "الإدارة", "التأهيل المهني"];
  const byTrack = trackNames.map((track) => ({
    track,
    students: students.filter((s) => s.track === track).length,
  }));

  return {
    enrolled: students.length,
    active,
    completed,
    withdrawn,
    completionRate,
    newThisMonth,
    byTrack,
  };
};

// ─── المتطوعون ───────────────────────────────────────────────
export const computeVolunteerStats = (volunteers: Volunteer[]) => {
  const hoursThisMonth = volunteers.reduce((s, v) => s + Number(v.hours || 0), 0);
  const joinedThisMonth = volunteers.filter((v) => inCurrentMonth(v.joinedAt)).length;
  const before = volunteers.length - joinedThisMonth;
  const growthPct = before > 0 ? (joinedThisMonth / before) * 100 : 0;

  // منحنى تراكمي: عدد المتطوعين حتى نهاية كل شهر (آخر 8 أشهر)
  const months = lastNMonths(8);
  const firstKey = months[0].key;
  const beforeFirst = volunteers.filter(
    (v) => monthKey(new Date(v.joinedAt)) < firstKey
  ).length;
  let running = beforeFirst;
  const monthly = months.map((m) => {
    const joined = volunteers.filter((v) => monthKey(new Date(v.joinedAt)) === m.key).length;
    running += joined;
    return { month: m.label, volunteers: running, joined };
  });

  return { total: volunteers.length, hoursThisMonth, joinedThisMonth, growthPct, monthly };
};


// ─── التبرعات ────────────────────────────────────────────────
export const computeDonationStats = (donations: Donation[]) => {
  const totalRaised = donations.reduce((s, d) => s + Number(d.amount || 0), 0);
  const thisMonth = donations
    .filter((d) => inCurrentMonth(d.date))
    .reduce((s, d) => s + Number(d.amount || 0), 0);
  const donors = new Set(donations.map((d) => d.donor.trim())).size;

  const months = lastNMonths(6);
  const monthly = months.map((m) => {
    const sum = donations
      .filter((d) => monthKey(new Date(d.date)) === m.key)
      .reduce((s, d) => s + Number(d.amount || 0), 0);
    return { month: m.label, amount: Math.round((sum / 1_000_000) * 10) / 10 };
  });

  const prev = monthly[monthly.length - 2]?.amount ?? 0;
  const curr = monthly[monthly.length - 1]?.amount ?? 0;
  const growthPct = prev > 0 ? ((curr - prev) / prev) * 100 : 0;

  const feed = [...donations]
    .sort((a, b) => +new Date(b.date) - +new Date(a.date))
    .slice(0, 5)
    .map((d) => ({
      ...d,
      minutesAgo: Math.max(1, Math.round((Date.now() - +new Date(d.date)) / 60000)),
    }));

  return { totalRaised, thisMonth, donors, growthPct, monthly, feed };
};

// ─── المصاريف (مقابل الموازنة المعتمدة) ──────────────────────
export const computeExpenseStats = (expenses: Expense[]) => {
  const byCategory = EXPENSE_CATEGORIES.map((name) => {
    const spent = expenses
      .filter((e) => e.category === name)
      .reduce((s, e) => s + Number(e.amount || 0), 0);
    const budget = EXPENSE_BUDGETS[name];
    return { name, spent, budget, pct: budget > 0 ? (spent / budget) * 100 : 0 };
  });
  const totalSpent = byCategory.reduce((s, c) => s + c.spent, 0);
  const totalBudget = byCategory.reduce((s, c) => s + c.budget, 0);
  return {
    byCategory,
    totalSpent,
    totalBudget,
    usagePct: totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0,
  };
};

// ─── أنواع الأعمال والتشغيل ──────────────────────────────────
// المتدربون والموظفون كيانان مستقلان: كل عدّاد من سجله الخاص فقط.
export const computeJobStats = (
  trainees: Trainee[],
  employees: Employee[],
  students: Student[]
) => {
  const trained = trainees.length; // من سجل المتدربين فقط
  const employed = employees.length; // من سجل الموظفين فقط
  const rate = trained > 0 ? (employed / trained) * 100 : 0;
  const partners = new Set(
    employees.map((p) => p.employer.trim()).filter(Boolean)
  ).size;

  // مؤشر الجاهزية لكل مسار = متوسط تقدم الطلاب في المسارات المرتبطة به
  const trackMap: { skill: string; tracks: string[] }[] = [
    { skill: "تقنية المعلومات", tracks: ["البرمجة"] },
    { skill: "التصميم والإبداع", tracks: ["التصميم"] },
    { skill: "التعليم والتدريب", tracks: ["اللغات"] },
    { skill: "الحرف اليدوية", tracks: ["التأهيل المهني"] },
    { skill: "التسويق الرقمي", tracks: ["البرمجة", "التصميم"] },
    { skill: "الإدارة والمحاسبة", tracks: ["الإدارة"] },
  ];
  const radar = trackMap.map(({ skill, tracks }) => {
    const list = students.filter((s) => tracks.includes(s.track));
    const value = list.length
      ? list.reduce((sum, s) => sum + Number(s.progress || 0), 0) / list.length
      : 0;
    return { skill, value: Math.round(value) };
  });

  return { trained, employed, rate, partners, radar };
};

// ─── الاستثمارات ─────────────────────────────────────────────
export const computeInvestmentStats = (investments: Investment[]) => {
  const active = investments.filter((p) => p.status === "نشط").length;
  const totalInvested = investments.reduce((s, p) => s + Number(p.invested || 0), 0);
  const avgRoi = investments.length
    ? investments.reduce((s, p) => s + Number(p.roi || 0), 0) / investments.length
    : 0;
  const jobs = investments.reduce((s, p) => s + Number(p.jobsCreated || 0), 0);
  return { active, totalInvested, avgRoi, jobs };
};

// ─── التوزيع الجغرافي (من الطلاب + المتطوعين + المشاريع) ─────
export const computeRegionStats = (
  students: Student[],
  volunteers: Volunteer[],
  investments: Investment[]
): RegionData[] =>
  REGION_META.map((r) => ({
    id: r.id,
    name: r.name,
    beneficiaries: students.filter((s) => s.governorate === r.name).length,
    volunteers: volunteers.filter((v) => v.governorate === r.name).length,
    projects: investments.filter((p) => p.governorate === r.name).length,
  }));
