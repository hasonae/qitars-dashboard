"use client";

import ExportButton from "./ExportButton";
import { useQitars } from "@/lib/store";
import { regionRows } from "@/lib/exporters";

/** زر تصدير التوزيع الجغرافي (صفحة المواقع) */
export default function LocationsExport() {
  const { students, volunteers, investments } = useQitars();
  return (
    <div className="flex justify-start mb-4">
      <ExportButton
        fileName="التوزيع-الجغرافي"
        sheetName="التوزيع الجغرافي"
        rows={regionRows(students, volunteers, investments)}
        label="تصدير التوزيع الجغرافي"
      />
    </div>
  );
}