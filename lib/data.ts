/**
 * إعدادات ومعلومات ثابتة (خطة الموازنة، التصنيفات، المحافظات)
 * ملاحظة: كل الإحصاءات تُحسب مباشرة من السجلات في lib/store.tsx
 * عبر محرك التحليلات lib/analytics.ts — لا توجد أي أرقام ثابتة.
 */

// ─── الموازنة المعتمدة لكل تصنيف (خطة، وليست سجلات) ──────────
export const EXPENSE_CATEGORIES = [
  "المشاريع التنموية",
  "الدورات والتعليم",
  "العمليات والإدارة",
  "المبادرات المجتمعية",
] as const;

export type ExpenseCategory = (typeof EXPENSE_CATEGORIES)[number];

export const EXPENSE_BUDGETS: Record<ExpenseCategory, number> = {
  "المشاريع التنموية": 40_000_000,
  "الدورات والتعليم": 30_000_000,
  "العمليات والإدارة": 18_000_000,
  "المبادرات المجتمعية": 8_000_000,
};

// ─── المحافظات الـ14 (المعرّفات تطابق مسارات الخريطة) ────────
export const REGION_META: { id: string; name: string }[] = [
  { id: "aleppo", name: "حلب" },
  { id: "idlib", name: "إدلب" },
  { id: "latakia", name: "اللاذقية" },
  { id: "tartus", name: "طرطوس" },
  { id: "hama", name: "حماة" },
  { id: "homs", name: "حمص" },
  { id: "damascus", name: "دمشق" },
  { id: "rifdimashq", name: "ريف دمشق" },
  { id: "daraa", name: "درعا" },
  { id: "qunaytra", name: "القنيطرة" },
  { id: "sweida", name: "السويداء" },
  { id: "deirezzor", name: "دير الزور" },
  { id: "raqqa", name: "الرققة" },
  { id: "hasakah", name: "الحسكة" },
];

/** بيانات محافظة للخريطة (تُبنى من السجلات) */
export type RegionData = {
  id: string;
  name: string;
  beneficiaries: number;
  volunteers: number;
  projects: number;
};
