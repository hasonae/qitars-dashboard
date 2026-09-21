"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Pencil, Plus, Search, Trash2 } from "lucide-react";
import { formatNumber } from "@/lib/format";

export type Column<T> = {
  key: string;
  label: string;
  format?: (value: unknown, row: T) => string;
};

type Props<T extends { id: string }> = {
  title: string;
  subtitle?: string;
  columns: Column<T>[];
  rows: T[];
  addLabel: string;
  onAdd: () => void;
  onEdit: (row: T) => void;
  onDelete: (row: T) => void;
  /** عناصر إضافية في رأس الجدول (مثل زر تصدير Excel) */
  headerExtra?: ReactNode;
  /** زر إجراء مخصص لكل صف (مثل "توظيف") */
  customAction?: {
    icon: React.ComponentType<{ className?: string }>;
    title: string;
    className: string;
    onClick: (row: T) => void;
  };
};

/** جدول بيانات موحد مع بحث وإضافة/تعديل/حذف */
export default function DataTable<T extends { id: string }>({
  title,
  subtitle,
  columns,
  rows,
  addLabel,
  onAdd,
  onEdit,
  onDelete,
  headerExtra,
  customAction,
}: Props<T>) {
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 20;

  const filtered = useMemo(() => {
    const needle = q.trim();
    if (!needle) return rows;
    return rows.filter((r) =>
      Object.values(r).some((v) => String(v).includes(needle))
    );
  }, [rows, q]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));

  // إعادة للصفحة الأولى عند تغيير البحث
  useEffect(() => {
    setPage(1);
  }, [q, rows.length]);

  const current = page > pageCount ? pageCount : page;
  const pageRows = filtered.slice((current - 1) * pageSize, current * pageSize);

  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      className="glass-card card-hover p-5 sm:p-6"
    >
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div>
          <h2 className="widget-title">{title}</h2>
          {subtitle && <p className="widget-sub mt-0.5">{subtitle}</p>}
        </div>
        <div className="flex items-center gap-2">
          {headerExtra && <div className="flex items-center gap-2">{headerExtra}</div>}
          <div className="flex items-center gap-2 bg-white/80 border border-teal-900/10 rounded-xl px-3 py-2 shadow-soft focus-within:ring-2 focus-within:ring-teal-500/30 transition-all">
            <Search className="w-4 h-4 text-teal-700/60" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="بحث…"
              className="w-28 sm:w-40 bg-transparent text-sm outline-none placeholder:text-teal-900/40"
            />
          </div>
          <button
            onClick={onAdd}
            className="flex items-center gap-1.5 rounded-xl bg-gold-gradient text-teal-900 text-xs font-extrabold px-3.5 py-2.5 shadow-soft hover:shadow-lifted hover:-translate-y-0.5 transition-all"
          >
            <Plus className="w-4 h-4" strokeWidth={2.4} />
            {addLabel}
          </button>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-teal-900/10">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-teal-700 text-white">
              {columns.map((c) => (
                <th key={c.key} className="px-3.5 py-2.5 text-right text-xs font-bold whitespace-nowrap">
                  {c.label}
                </th>
              ))}
              <th className="px-3.5 py-2.5 text-center text-xs font-bold whitespace-nowrap">إجراءات</th>
            </tr>
          </thead>
          <tbody>
            {pageRows.map((row, i) => (
              <tr
                key={row.id}
                className={`border-t border-teal-900/8 transition-colors hover:bg-teal-50/60 ${
                  i % 2 === 1 ? "bg-white/40" : "bg-transparent"
                }`}
              >
                {columns.map((c) => (
                  <td key={c.key} className="px-3.5 py-2.5 whitespace-nowrap text-teal-900 font-medium">
                    {c.format
                      ? c.format((row as Record<string, unknown>)[c.key], row)
                      : String((row as Record<string, unknown>)[c.key] ?? "")}
                  </td>
                ))}
                <td className="px-3.5 py-2.5">
                  <div className="flex items-center justify-center gap-1.5">
                    {customAction && (
                      <button
                        onClick={() => customAction.onClick(row)}
                        aria-label={customAction.title}
                        title={customAction.title}
                        className={customAction.className}
                      >
                        <customAction.icon className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      onClick={() => onEdit(row)}
                      aria-label="تعديل"
                      className="w-8 h-8 rounded-lg bg-teal-700/10 text-teal-700 flex items-center justify-center hover:bg-teal-700 hover:text-white transition-colors"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDelete(row)}
                      aria-label="حذف"
                      className="w-8 h-8 rounded-lg bg-rose-500/10 text-rose-600 flex items-center justify-center hover:bg-rose-500 hover:text-white transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td
                  colSpan={columns.length + 1}
                  className="px-3.5 py-8 text-center text-teal-900/50 text-xs font-medium"
                >
                  لا توجد سجلات مطابقة
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* الترقيم */}
      <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
        <p className="text-[10px] text-teal-900/50">
          عرض {formatNumber(pageRows.length)} من {formatNumber(filtered.length)} سجل
          {q.trim() ? " (نتائج البحث)" : ""} · التعديلات تُحفظ تلقائياً وتُحتسب في الإحصاءات
        </p>
        {pageCount > 1 && (
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={current === 1}
              aria-label="الصفحة السابقة"
              className="w-8 h-8 rounded-lg bg-teal-700/10 text-teal-700 flex items-center justify-center hover:bg-teal-700 hover:text-white transition-colors disabled:opacity-30 disabled:hover:bg-teal-700/10 disabled:hover:text-teal-700"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <span className="text-[11px] font-bold text-teal-900/70 px-2">
              صفحة {formatNumber(current)} / {formatNumber(pageCount)}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(pageCount, p + 1))}
              disabled={current === pageCount}
              aria-label="الصفحة التالية"
              className="w-8 h-8 rounded-lg bg-teal-700/10 text-teal-700 flex items-center justify-center hover:bg-teal-700 hover:text-white transition-colors disabled:opacity-30 disabled:hover:bg-teal-700/10 disabled:hover:text-teal-700"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </motion.section>
  );
}
