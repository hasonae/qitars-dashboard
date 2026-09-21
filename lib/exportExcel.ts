/**
 * تصدير البيانات إلى ملفات Excel حقيقية (.xlsx) — عبر مكتبة xlsx (SheetJS).
 * التحميل يتم ديناميكياً عند الضغط فقط حتى لا يثقل حجم الصفحة.
 * الأوراق تُعرض باتجاه RTL مع عروض أعمدة تلقائية.
 */

export type ExportRow = Record<string, string | number>;

type XLSXModule = typeof import("xlsx");

const stamp = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate()
  ).padStart(2, "0")}`;
};

const sheetFromRows = (XLSX: XLSXModule, rows: ExportRow[]) => {
  const ws = XLSX.utils.json_to_sheet(rows);
  const headers = Object.keys(rows[0] ?? {});
  ws["!cols"] = headers.map((h) => ({
    wch: Math.max(10, h.length + 4, ...rows.map((r) => String(r[h] ?? "").length + 2)),
  }));
  // اتجاه الورقة من اليمين إلى اليسار
  (ws as unknown as { "!views": unknown[] })["!views"] = [{ RTL: true }];
  return ws;
};

const safeSheetName = (name: string) => name.replace(/[\\/*?:[\]]/g, "").slice(0, 31) || "بيانات";

/** تصدير قائمة سجلات إلى ملف Excel بورقة واحدة */
export async function exportToExcel(opts: {
  fileName: string;
  sheetName: string;
  rows: ExportRow[];
}) {
  if (!opts.rows.length) throw new Error("NO_ROWS");
  const XLSX = await import("xlsx");
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, sheetFromRows(XLSX, opts.rows), safeSheetName(opts.sheetName));
  XLSX.writeFile(wb, `${opts.fileName}-${stamp()}.xlsx`);
}

/** تصدير عدة قوائم إلى ملف Excel واحد بأوراق متعددة */
export async function exportWorkbook(opts: {
  fileName: string;
  sheets: { name: string; rows: ExportRow[] }[];
}) {
  const sheets = opts.sheets.filter((s) => s.rows.length > 0);
  if (!sheets.length) throw new Error("NO_ROWS");
  const XLSX = await import("xlsx");
  const wb = XLSX.utils.book_new();
  for (const s of sheets) {
    XLSX.utils.book_append_sheet(wb, sheetFromRows(XLSX, s.rows), safeSheetName(s.name));
  }
  XLSX.writeFile(wb, `${opts.fileName}-${stamp()}.xlsx`);
}