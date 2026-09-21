"use client";

import { useState } from "react";
import InvestmentsWidget from "./InvestmentsWidget";
import DataTable, { type Column } from "./DataTable";
import CrudModal, { type Field } from "./CrudModal";
import AddButton from "./AddButton";
import ExportButton from "./ExportButton";
import { investmentRows } from "@/lib/exporters";
import {
  useQitars,
  type Investment,
  INVESTMENT_STATUSES,
  GOVERNORATES,
} from "@/lib/store";
import { formatCurrency, formatPercent } from "@/lib/format";

const fields: Field[] = [
  { key: "name", label: "اسم المشروع", type: "text", required: true },
  { key: "governorate", label: "المحافظة", type: "select", options: GOVERNORATES, required: true },
  { key: "invested", label: "المبلغ المستثمر (ل.س)", type: "number", required: true, min: 0 },
  { key: "returned", label: "المبلغ المسترد (ل.س)", type: "number", required: true, min: 0 },
  { key: "roi", label: "العائد على الاستثمار (٪)", type: "number", required: true, min: 0, max: 200 },
  { key: "jobsCreated", label: "الوظائف المُنشأة", type: "number", required: true, min: 0, max: 1000 },
  { key: "status", label: "الحالة", type: "select", options: INVESTMENT_STATUSES, required: true },
];

export default function InvestmentsManager() {
  const { investments, investmentsCrud } = useQitars();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Investment | null>(null);

  const columns: Column<Investment>[] = [
    { key: "name", label: "المشروع" },
    { key: "governorate", label: "المحافظة" },
    { key: "status", label: "الحالة" },
    { key: "invested", label: "المستثمر", format: (v) => formatCurrency(Number(v)) },
    { key: "returned", label: "المسترد", format: (v) => formatCurrency(Number(v)) },
    { key: "roi", label: "العائد", format: (v) => formatPercent(Number(v)) },
    { key: "jobsCreated", label: "وظائف" },
  ];

  const openAdd = () => {
    setEditing(null);
    setOpen(true);
  };

  return (
    <>
      <InvestmentsWidget action={<AddButton label="مشروع جديد" onClick={openAdd} />} />

      <DataTable
        title="سجل المشاريع الاستثمارية"
        subtitle="إضافة وتعديل وحذف — مؤشرات ROI وعدد الوظائف تُحسب من السجلات"
        columns={columns}
        rows={investments}
        addLabel="مشروع جديد"
        headerExtra={<ExportButton fileName="سجل-المشاريع-الاستثمارية" sheetName="المشاريع" rows={investmentRows(investments)} />}
        onAdd={openAdd}
        onEdit={(row) => {
          setEditing(row);
          setOpen(true);
        }}
        onDelete={(row) => {
          if (window.confirm(`هل تريد حذف مشروع "${row.name}"؟`)) investmentsCrud.remove(row.id);
        }}
      />

      <CrudModal
        open={open}
        title={editing ? `تعديل مشروع: ${editing.name}` : "إضافة مشروع استثماري"}
        fields={fields}
        initial={editing}
        onClose={() => setOpen(false)}
        onSubmit={(values) => {
          const payload = {
            ...values,
            invested: Number(values.invested),
            returned: Number(values.returned),
            roi: Number(values.roi),
            jobsCreated: Number(values.jobsCreated),
          };
          if (editing) investmentsCrud.update(editing.id, payload);
          else investmentsCrud.add(payload as Omit<Investment, "id">);
        }}
      />
    </>
  );
}
