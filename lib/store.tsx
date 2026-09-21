"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { EXPENSE_CATEGORIES } from "./data";

// ─── الأنواع ─────────────────────────────────────────────────
export type Student = {
  id: string;
  name: string;
  track: string;
  governorate: string;
  status: string; // نشط | مكتمل | منسحب
  progress: number; // 0-100
  enrolledAt: string; // yyyy-mm-dd
};

export type Volunteer = {
  id: string;
  name: string;
  role: string;
  governorate: string;
  hours: number; // ساعات هذا الشهر
  joinedAt: string;
};

export type Donation = {
  id: string;
  donor: string;
  amount: number;
  type: string; // فرد | شركة | جمعية
  date: string; // ISO
};

export type Expense = {
  id: string;
  description: string;
  category: string; // أحد تصنيفات الموازنة
  amount: number;
  date: string; // yyyy-mm-dd
};

export type Investment = {
  id: string;
  name: string;
  governorate: string;
  invested: number;
  returned: number;
  roi: number; // ٪
  jobsCreated: number;
  status: string; // نشط | قيد التأسيس | مكتمل
};

export type Trainee = {
  id: string;
  name: string;
  track: string;
  governorate: string;
  status: string; // في التدريب | مكتمل | منسحب
  date: string; // yyyy-mm-dd — تاريخ الالتحاق بالتدريب
};

export type Employee = {
  id: string;
  name: string;
  track: string;
  governorate: string;
  employer: string; // جهة التشغيل
  date: string; // yyyy-mm-dd — تاريخ التوظيف
};

// ─── الخيارات ────────────────────────────────────────────────
export const TRACKS = ["البرمجة", "اللغات", "التصميم", "الإدارة", "التأهيل المهني"];
export const GOVERNORATES = [
  "حلب", "إدلب", "اللاذقية", "طرطوس", "حماة", "حمص", "دمشق", "ريف دمشق",
  "درعا", "القنيطرة", "السويداء", "دير الزور", "الرققة", "الحسكة",
];
export const VOLUNTEER_ROLES = ["منسق ميداني", "مدرّس دورات", "مساعد اجتماعي", "مصمم محتوى", "منسق فعاليات"];
export const DONATION_TYPES = ["فرد", "شركة", "جمعية"];
export const INVESTMENT_STATUSES = ["نشط", "قيد التأسيس", "مكتمل"];
export const STUDENT_STATUSES = ["نشط", "مكتمل", "منسحب"];
export const TRAINEE_STATUSES = ["في التدريب", "مكتمل", "منسحب"];

// ─── مولّد أرقام شبه عشوائي ثابت (نفس البيانات في كل مرة) ────
const mulberry32 = (seed: number) => () => {
  seed |= 0;
  seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};
const rnd = mulberry32(20260921);
const int = (min: number, max: number) => min + Math.floor(rnd() * (max - min + 1));
const pick = <T,>(arr: readonly T[]): T => arr[Math.floor(rnd() * arr.length)];

const MALE = ["أحمد", "محمد", "علي", "حسين", "خالد", "عمر", "زياد", "رامي", "وسيم", "سامر", "بشار", "جود", "كريم", "مازن", "نزار", "هيثم", "إياد", "فادي", "غسان", "لؤي"];
const FEMALE = ["سارة", "ليلى", "رنا", "هدى", "نور", "جودي", "لين", "فرح", "رنيم", "ديمة", "ريم", "سلمى", "ميرا", "هبة", "ندى", "غادة"];
const FAMILY = ["سليمان", "خضر", "عيسى", "ناصر", "عزمي", "شبل", "دياب", "قبيل", "مرعي", "سالم", "الحسن", "خضور", "إبراهيم", "قاسم", "سعيد", "مرزوق", "شاهين", "عبدالله", "الأحمد", "حبيب", "زينب", "صالح", "خليل", "درويش", "حمدان", "الأشقر"];
const COMPANIES = ["شركة أمل للتطوير", "مؤسسة الساحل التقنية", "مجموعة الرافدين التجارية", "شركة نور الشام", "مؤسسة الوفاء للمقاولات", "الشركة العربية للاستثمار", "شركة بردى الصناعية"];
const ASSOCIATIONS = ["جمعية النور الخيرية", "مؤسسة العطاء التنموية", "جمعية الأمل الخيرية", "ملتقى شباب الساحل"];
const EMPLOYERS = ["شركة أمل للتطوير", "مؤسسة الساحل التقنية", "ورشة النور للحرف", "مركز دمشق للتدريب", "تعاونية الأمل الزراعية", "مشفى الشام التخصصي", "مقهى شباب الساحل", "معمل الترميم والحرف", "شركة بردى الصناعية", "مدرسة الياسمين الخاصة"];

const fullName = () => `${rnd() < 0.45 ? pick(MALE) : pick(FEMALE)} ${pick(FAMILY)}`;
const isoDay = (d: Date) => d.toISOString().slice(0, 10);

const WEIGHTED_GOVS: [string, number][] = [
  ["حلب", 0.16], ["دمشق", 0.11], ["ريف دمشق", 0.09], ["حمص", 0.12],
  ["اللاذقية", 0.09], ["طرطوس", 0.07], ["إدلب", 0.09], ["حماة", 0.07],
  ["درعا", 0.05], ["السويداء", 0.03], ["القنيطرة", 0.02], ["دير الزور", 0.04],
  ["الرققة", 0.03], ["الحسكة", 0.03],
];
const weightedGov = (): string => {
  const r = rnd();
  let acc = 0;
  for (const [gov, w] of WEIGHTED_GOVS) {
    acc += w;
    if (r <= acc) return gov;
  }
  return "حلب";
};
// ─── توليد البيانات الواقعية ─────────────────────────────────
const TRACK_COUNTS: [string, number][] = [
  ["البرمجة", 320],
  ["اللغات", 265],
  ["التصميم", 198],
  ["الإدارة", 241],
  ["التأهيل المهني", 240],
]; // المجموع = 1,264

const genStudents = (): Student[] => {
  const out: Student[] = [];
  const now = new Date();
  const today = Math.max(1, now.getDate());
  let i = 0;
  for (const [track, count] of TRACK_COUNTS) {
    for (let k = 0; k < count; k++) {
      const r = rnd();
      const status = r < 0.64 ? "نشط" : r < 0.9 ? "مكتمل" : "منسحب";
      const progress =
        status === "مكتمل" ? 100 : status === "منسحب" ? int(5, 35) : int(25, 95);
      const d =
        rnd() < 0.09
          ? new Date(now.getFullYear(), now.getMonth(), int(1, today))
          : new Date(now.getFullYear(), now.getMonth() - int(1, 11), int(1, 28));
      out.push({
        id: `st${++i}`,
        name: fullName(),
        track,
        governorate: weightedGov(),
        status,
        progress,
        enrolledAt: isoDay(d),
      });
    }
  }
  return out;
};

const genVolunteers = (): Volunteer[] => {
  const out: Volunteer[] = [];
  const now = new Date();
  const today = Math.max(1, now.getDate());
  for (let i = 1; i <= 576; i++) {
    const d =
      rnd() < 0.06
        ? new Date(now.getFullYear(), now.getMonth(), int(1, today))
        : new Date(now.getFullYear(), now.getMonth() - int(1, 30), int(1, 28));
    out.push({
      id: `v${i}`,
      name: fullName(),
      role: pick(VOLUNTEER_ROLES),
      governorate: weightedGov(),
      hours: int(4, 14),
      joinedAt: isoDay(d),
    });
  }
  return out;
};

const MONTH_COUNTS = [22, 25, 28, 26, 30, 29]; // تبرعات آخر 6 أشهر (الأقدم → الأحدث)

const genDonations = (): Donation[] => {
  const out: Donation[] = [];
  const now = new Date();
  let i = 0;
  for (let idx = 0; idx < MONTH_COUNTS.length; idx++) {
    const monthsBack = MONTH_COUNTS.length - 1 - idx;
    const maxDay = monthsBack === 0 ? Math.max(1, now.getDate()) : 28;
    for (let k = 0; k < MONTH_COUNTS[idx]; k++) {
      const rt = rnd();
      const type = rt < 0.7 ? "فرد" : rt < 0.9 ? "شركة" : "جمعية";
      const amount =
        type === "فرد"
          ? int(100, 1200) * 1000
          : type === "شركة"
            ? int(1000, 4000) * 1000
            : int(500, 2000) * 1000;
      const donor =
        type === "فرد" ? fullName() : type === "شركة" ? pick(COMPANIES) : pick(ASSOCIATIONS);
      const d = new Date(
        now.getFullYear(),
        now.getMonth() - monthsBack,
        int(1, maxDay),
        int(8, 20),
        int(0, 59)
      );
      out.push({ id: `dn${++i}`, donor, amount, type, date: d.toISOString() });
    }
  }
  return out;
};

const EXPENSE_ITEMS: Record<string, string[]> = {
  "المشاريع التنموية": ["ترميم ورشة حرفية", "شراء معدات زراعية", "تجهيز مقهى شبابي", "معدات خياطة صناعية", "مواد بناء لمشروع تعاوني"],
  "الدورات والتعليم": ["أجور مدربين", "أجهزة حاسوب للتدريب", "مستلزمات تدريب برمجي", "إنترنت وقاعات تدريب", "شهادات ومطبوعات"],
  "العمليات والإدارة": ["رواتب إدارية", "إيجار مكتب", "مصاريف نقل وتنقل", "اشتراكات برمجية", "قرطاسية ونفقات مكتبية"],
  "المبادرات المجتمعية": ["حملة صحية مجتمعية", "سلة غذائية للأسر", "نشاط رياضي للشباب", "معرض منتجات الحرفيين"],
};

const genExpenses = (): Expense[] => {
  const out: Expense[] = [];
  const now = new Date();
  const plan: [string, number, number, number][] = [
    ["المشاريع التنموية", 12, 1, 4],
    ["الدورات والتعليم", 14, 0.5, 2.5],
    ["العمليات والإدارة", 12, 0.2, 1.5],
    ["المبادرات المجتمعية", 10, 0.2, 1],
  ];
  let i = 0;
  for (const [category, count, lo, hi] of plan) {
    for (let k = 0; k < count; k++) {
      const amount = int(lo * 10, hi * 10) * 100_000;
      const d = new Date(now.getFullYear(), now.getMonth() - int(0, 7), int(1, 28));
      out.push({
        id: `ex${++i}`,
        description: pick(EXPENSE_ITEMS[category] ?? ["مصروف عام"]),
        category,
        amount,
        date: isoDay(d),
      });
    }
  }
  return out;
};

const genInvestments = (): Investment[] => [
  { id: "iv1", name: "مزرعة الأمل التعاونية", governorate: "حماة", invested: 6_500_000, returned: 1_850_000, roi: 28.4, jobsCreated: 26, status: "نشط" },
  { id: "iv2", name: "ورشة الخياطة الرقمية", governorate: "حلب", invested: 4_200_000, returned: 980_000, roi: 23.3, jobsCreated: 18, status: "نشط" },
  { id: "iv3", name: "مقهى شباب الساحل", governorate: "طرطوس", invested: 3_800_000, returned: 410_000, roi: 10.8, jobsCreated: 12, status: "قيد التأسيس" },
  { id: "iv4", name: "معمل الترميم والحرف", governorate: "دمشق", invested: 5_100_000, returned: 1_120_000, roi: 21.9, jobsCreated: 22, status: "نشط" },
  { id: "iv5", name: "تعاونية الأمل الزراعية", governorate: "اللاذقية", invested: 4_800_000, returned: 1_340_000, roi: 27.9, jobsCreated: 24, status: "نشط" },
  { id: "iv6", name: "ورشة النجارة الحديثة", governorate: "إدلب", invested: 3_200_000, returned: 520_000, roi: 16.2, jobsCreated: 11, status: "نشط" },
  { id: "iv7", name: "مركز التدريب التقني", governorate: "حمص", invested: 7_400_000, returned: 1_980_000, roi: 26.7, jobsCreated: 31, status: "نشط" },
  { id: "iv8", name: "مشروع تربية النحل", governorate: "ريف دمشق", invested: 2_600_000, returned: 540_000, roi: 20.7, jobsCreated: 9, status: "نشط" },
  { id: "iv9", name: "مخبز الحي التعاوني", governorate: "درعا", invested: 2_900_000, returned: 300_000, roi: 10.3, jobsCreated: 8, status: "قيد التأسيس" },
  { id: "iv10", name: "مشغل التطريز النسائي", governorate: "السويداء", invested: 2_100_000, returned: 620_000, roi: 29.5, jobsCreated: 14, status: "نشط" },
  { id: "iv11", name: "ورشة صيانة الأجهزة", governorate: "الرققة", invested: 1_900_000, returned: 410_000, roi: 21.6, jobsCreated: 7, status: "نشط" },
  { id: "iv12", name: "مشروع الطاقة الشمسية", governorate: "دير الزور", invested: 3_600_000, returned: 260_000, roi: 7.2, jobsCreated: 6, status: "قيد التأسيس" },
];

// عدد المتدربين وعدد الموظفين — كيانان مستقلان تماماً:
// حذف أو تعديل متدرب لا يمسّ سجل الموظفين والعكس صحيح.
const TRAINEE_COUNT = 210;
const EMPLOYEE_COUNT = 131;

const genTrainees = (): Trainee[] => {
  const out: Trainee[] = [];
  const now = new Date();
  for (let i = 1; i <= TRAINEE_COUNT; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() - int(0, 11), int(1, 28));
    const r = rnd();
    const status = r < 0.55 ? "في التدريب" : r < 0.9 ? "مكتمل" : "منسحب";
    out.push({
      id: `tr${i}`,
      name: fullName(),
      track: pick(TRACKS),
      governorate: weightedGov(),
      status,
      date: isoDay(d),
    });
  }
  return out;
};

const genEmployees = (): Employee[] => {
  const out: Employee[] = [];
  const now = new Date();
  for (let i = 1; i <= EMPLOYEE_COUNT; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() - int(0, 11), int(1, 28));
    out.push({
      id: `em${i}`,
      name: fullName(),
      track: pick(TRACKS),
      governorate: weightedGov(),
      employer: pick(EMPLOYERS),
      date: isoDay(d),
    });
  }
  return out;
};

// ─── الحالة الأولية ──────────────────────────────────────────
export type StoreState = {
  students: Student[];
  volunteers: Volunteer[];
  donations: Donation[];
  expenses: Expense[];
  investments: Investment[];
  trainees: Trainee[];
  employees: Employee[];
};

const STORAGE_KEY = "qitars-data-v4";

/** توليد البيانات الأولية الكاملة (تُستخدم عند أول تشغيل وعند إعادة التعيين) */
export const buildSeed = (): StoreState => ({
  students: genStudents(),
  volunteers: genVolunteers(),
  donations: genDonations(),
  expenses: genExpenses(),
  investments: genInvestments(),
  trainees: genTrainees(),
  employees: genEmployees(),
});


// â”€â”€â”€ ط§ظ„ظ…ط®ط²ظ† ظˆط§ظ„ط³ظٹط§ظ‚ â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const nid = () => `x${Date.now()}${Math.floor(Math.random() * 1000)}`;

type Crud<T> = {
  add: (item: Omit<T, "id">) => void;
  update: (id: string, patch: Partial<T>) => void;
  remove: (id: string) => void;
};

type StoreContextValue = StoreState & {
  studentsCrud: Crud<Student>;
  volunteersCrud: Crud<Volunteer>;
  donationsCrud: Crud<Donation>;
  expensesCrud: Crud<Expense>;
  investmentsCrud: Crud<Investment>;
  traineesCrud: Crud<Trainee>;
  employeesCrud: Crud<Employee>;
  resetAll: () => void;
};

const StoreContext = createContext<StoreContextValue | null>(null);

export function QitarsProvider({ children }: { children: ReactNode }) {
  // التحميل المتزامن من localStorage داخل مُهيّئ useState نفسه (قبل أي حفظ) —
  // يضمن بقاء التعديلات بعد إغلاق الموقع وإعادة فتحه، ويمنع أي سباق قد يكتب
  // البيانات الأساسية فوق البيانات المحفوظة.
  const [state, setState] = useState<StoreState>(() => {
    if (typeof window === "undefined") return buildSeed();
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<StoreState>;
        const seed = buildSeed();
        return {
          students: parsed.students ?? seed.students,
          volunteers: parsed.volunteers ?? seed.volunteers,
          donations: parsed.donations ?? seed.donations,
          expenses: parsed.expenses ?? seed.expenses,
          investments: parsed.investments ?? seed.investments,
          trainees: parsed.trainees ?? seed.trainees,
          employees: parsed.employees ?? seed.employees,
        };
      }
    } catch {
      /* تجاهل */
    }
    return buildSeed();
  });

  // حفظ تلقائي: أي تعديل يُكتب فوراً في التخزين الدائم للمتصفح
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* تجاهل */
    }
  }, [state]);

  const makeCrud = <K extends keyof StoreState>(key: K): Crud<StoreState[K][number]> => ({
    add: (item) =>
      setState((st) => ({
        ...st,
        [key]: [{ ...(item as object), id: nid() }, ...(st[key] as unknown[])],
      })),
    update: (id, patch) =>
      setState((st) => ({
        ...st,
        [key]: (st[key] as { id: string }[]).map((r) =>
          r.id === id ? { ...r, ...patch } : r
        ),
      })),
    remove: (id) =>
      setState((st) => ({
        ...st,
        [key]: (st[key] as { id: string }[]).filter((r) => r.id !== id),
      })),
  });

  const value: StoreContextValue = {
    ...state,
    studentsCrud: makeCrud("students"),
    volunteersCrud: makeCrud("volunteers"),
    donationsCrud: makeCrud("donations"),
    expensesCrud: makeCrud("expenses"),
    investmentsCrud: makeCrud("investments"),
    traineesCrud: makeCrud("trainees"),
    employeesCrud: makeCrud("employees"),
    resetAll: () => {
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch {
        /* طھط¬ط§ظ‡ظ„ */
      }
      setState(buildSeed());
    },
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useQitars(): StoreContextValue {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useQitars must be used inside QitarsProvider");
  return ctx;
}

