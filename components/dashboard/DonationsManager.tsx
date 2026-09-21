"use client";

import { useState } from "react";
import DonationsWidget from "./DonationsWidget";
import DataTable, { type Column } from "./DataTable";
import CrudModal, { type Field } from "./CrudModal";
import AddButton from "./AddButton";
import ExportButton from "./ExportButton";
import { donationRows } from "@/lib/exporters";
import { useQitars, type Donation, DONATION_TYPES } from "@/lib/store";
import { formatCurrency } from "@/lib/format";

const fields: Field[] = [
  { key: "donor", label: "اسم المتبرع", type: "text", required: true },
  { key: "amount", label: "المبلغ (ل.س)", type: "number", required: true, min: 0 },
  { key: "type", label: "نوع المتبرع", type: "select", options: DONATION_TYPES, required: true },
  { key: "date", label: "تاريخ التبرع", type: "date", required: true },
];

export default function DonationsManager() {
  const { donations, donationsCrud } = useQitars();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Donation | null>(null);

  const columns: Column<Donation>[] = [
    { key: "donor", label: "المتبرع" },
    { key: "type", label: "النوع" },
    { key: "amount", label: "المبلغ", format: (v) => formatCurrency(Number(v)) },
    { key: "date", label: "التاريخ", format: (v) => String(v).slice(0, 10) },
  ];

  return (
    <>
      <DonationsWidget
        action={
          <AddButton
            label="تبرع جديد"
            onClick={() => {
              setEditing(null);
              setOpen(true);
            }}
          />
        }
      />

      <DataTable
        title="سجل التبرعات"
        subtitle="تسجيل وتعديل وحذف — الإجماليات والمخطط والفيد تُحدَّث تلقائياً"
        columns={columns}
        rows={donations}
        addLabel="تبرع جديد"
        headerExtra={<ExportButton fileName="سجل-التبرعات" sheetName="التبرعات" rows={donationRows(donations)} />}
        onAdd={() => {
          setEditing(null);
          setOpen(true);
        }}
        onEdit={(row) => {
          setEditing(row);
          setOpen(true);
        }}
        onDelete={(row) => {
          if (window.confirm(`هل تريد حذف تبرع "${row.donor}"؟`)) donationsCrud.remove(row.id);
        }}
      />

      <CrudModal
        open={open}
        title={editing ? `تعديل تبرع: ${editing.donor}` : "تسجيل تبرع جديد"}
        fields={fields}
        initial={editing ? { ...editing, date: editing.date.slice(0, 10) } : null}
        onClose={() => setOpen(false)}
        onSubmit={(values) => {
          const payload = {
            ...values,
            amount: Number(values.amount),
            date: new Date(String(values.date)).toISOString(),
          };
          if (editing) donationsCrud.update(editing.id, payload);
          else donationsCrud.add(payload as Omit<Donation, "id">);
        }}
      />
    </>
  );
}
