"use client";

import { useState } from "react";
import { FileSpreadsheet, Loader2 } from "lucide-react";
import { exportToExcel, type ExportRow } from "@/lib/exportExcel";

/** زر تصدير قسم إلى ملف Excel (.xlsx) */
export default function ExportButton({
  fileName,
  sheetName,
  rows,
  label = "تصدير Excel",
}: {
  fileName: string;
  sheetName: string;
  rows: ExportRow[];
  label?: string;
}) {
  const [busy, setBusy] = useState(false);

  const onClick = async () => {
    if (!rows.length) {
      window.alert("لا توجد سجلات للتصدير");
      return;
    }
    setBusy(true);
    try {
      await exportToExcel({ fileName, sheetName, rows });
    } catch {
      window.alert("تعذّر التصدير — حاول مجدداً");
    } finally {
      setBusy(false);
    }
  };

  return (
    <button
      onClick={onClick}
      disabled={busy}
      className="flex items-center gap-1.5 rounded-xl bg-teal-700/10 text-teal-800 text-xs font-extrabold px-3.5 py-2.5 hover:bg-teal-700 hover:text-white transition-colors disabled:opacity-60 whitespace-nowrap"
    >
      {busy ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <FileSpreadsheet className="w-4 h-4" strokeWidth={2.2} />
      )}
      {label}
    </button>
  );
}