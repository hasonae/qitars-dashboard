"use client";

import { useState } from "react";
import { RotateCcw, Database, FileSpreadsheet, Loader2 } from "lucide-react";
import { useQitars } from "@/lib/store";
import { formatNumber } from "@/lib/format";
import { allSheets } from "@/lib/exporters";
import { exportWorkbook } from "@/lib/exportExcel";

/** إدارة البيانات — عرض الحجم، تصدير كل البيانات، وإعادة التعيين للبيانات الأولية */
export default function DataSettings() {
  const { students, volunteers, donations, expenses, investments, trainees, employees, resetAll } =
    useQitars();
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);

  const total =
    students.length +
    volunteers.length +
    donations.length +
    expenses.length +
    investments.length +
    trainees.length +
    employees.length;

  const rows = [
    ["الطلاب", students.length],
    ["المتطوعون", volunteers.length],
    ["التبرعات", donations.length],
    ["المصاريف", expenses.length],
    ["المشاريع الاستثمارية", investments.length],
    ["المتدربون", trainees.length],
    ["الموظفون", employees.length],
  ] as const;

  const exportAll = async () => {
    setBusy(true);
    try {
      await exportWorkbook({
        fileName: "Qitars-كل-البيانات",
        sheets: allSheets({ students, volunteers, donations, expenses, investments, trainees, employees }),
      });
      setMsg("تم تصدير كل البيانات بنجاح — 8 أوراق في ملف واحد");
    } catch {
      setMsg("تعذّر التصدير — حاول مجدداً");
    } finally {
      setBusy(false);
      setTimeout(() => setMsg(""), 3000);
    }
  };

  return (
    <section className="glass-card card-hover p-5 sm:p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-9 h-9 rounded-lg bg-teal-700/10 text-teal-700 flex items-center justify-center">
          <Database className="w-[18px] h-[18px]" strokeWidth={1.9} />
        </div>
        <div>
          <h2 className="widget-title">قاعدة البيانات المحلية</h2>
          <p className="widget-sub mt-0.5">
            كل السجلات محفوظة في المتصفح — الإحصاءات تُحسب منها مباشرة
          </p>
        </div>
      </div>

      <ul className="space-y-2 mb-4">
        {rows.map(([label, count]) => (
          <li
            key={label}
            className="flex items-center justify-between rounded-lg bg-white/60 border border-teal-900/5 px-3 py-2 text-xs font-medium text-teal-900"
          >
            {label}
            <span className="font-extrabold text-teal-700">{formatNumber(count)}</span>
          </li>
        ))}
        <li className="flex items-center justify-between rounded-lg bg-teal-700/10 px-3 py-2 text-xs font-bold text-teal-900">
          إجمالي السجلات
          <span className="font-extrabold">{formatNumber(total)}</span>
        </li>
      </ul>

      {msg && (
        <p className="mb-3 text-xs font-bold text-emerald-700 bg-emerald-50 rounded-lg px-3 py-2">
          {msg}
        </p>
      )}

      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={exportAll}
          disabled={busy}
          className="flex items-center gap-1.5 rounded-xl bg-teal-700 text-white text-xs font-extrabold px-4 py-2.5 hover:bg-teal-600 transition-colors disabled:opacity-60"
        >
          {busy ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <FileSpreadsheet className="w-4 h-4" strokeWidth={2.2} />
          )}
          تصدير كل البيانات (Excel)
        </button>
        <button
          onClick={() => {
            if (window.confirm("سيتم استبدال كل السجلات الحالية بالبيانات الأساسية. متابعة؟")) {
              resetAll();
              setMsg("تمت إعادة تعيين البيانات بنجاح");
              setTimeout(() => setMsg(""), 2600);
            }
          }}
          className="flex items-center gap-1.5 rounded-xl bg-rose-500/10 text-rose-600 text-xs font-extrabold px-4 py-2.5 hover:bg-rose-500 hover:text-white transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          إعادة تعيين البيانات
        </button>
      </div>
    </section>
  );
}
