"use client";

import { useState } from "react";
import ExpensesWidget from "./ExpensesWidget";
import DataTable, { type Column } from "./DataTable";
import CrudModal, { type Field } from "./CrudModal";
import AddButton from "./AddButton";
import ExportButton from "./ExportButton";
import { expenseRows } from "@/lib/exporters";
import { useQitars, type Expense } from "@/lib/store";
import { EXPENSE_CATEGORIES } from "@/lib/data";
import { formatCurrency } from "@/lib/format";

const fields: Field[] = [
  { key: "description", label: "وصف المصروف", type: "text", required: true },
  { key: "category", label: "البند / التصنيف", type: "select", options: [...EXPENSE_CATEGORIES], required: true },
  { key: "amount", label: "المبلغ (ل.س)", type: "number", required: true, min: 0 },
  { key: "date", label: "تاريخ الصرف", type: "date", required: true },
];

export default function ExpensesManager() {
  const { expenses, expensesCrud } = useQitars();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Expense | null>(null);

  const columns: Column<Expense>[] = [
    { key: "description", label: "الوصف" },
    { key: "category", label: "البند" },
    { key: "amount", label: "المبلغ", format: (v) => formatCurrency(Number(v)) },
    { key: "date", label: "التاريخ" },
  ];

  const openAdd = () => {
    setEditing(null);
    setOpen(true);
  };

  return (
    <>
      <ExpensesWidget action={<AddButton label="مصروف جديد" onClick={openAdd} />} />

      <DataTable
        title="سجل المصاريف"
        subtitle="تسجيل الإنفاق — أشرطة الموازنة مقابل الفعلي تُحدَّث تلقائياً"
        columns={columns}
        rows={expenses}
        addLabel="مصروف جديد"
        headerExtra={<ExportButton fileName="سجل-المصاريف" sheetName="المصاريف" rows={expenseRows(expenses)} />}
        onAdd={openAdd}
        onEdit={(row) => {
          setEditing(row);
          setOpen(true);
        }}
        onDelete={(row) => {
          if (window.confirm(`هل تريد حذف مصروف "${row.description}"؟`))
            expensesCrud.remove(row.id);
        }}
      />

      <CrudModal
        open={open}
        title={editing ? `تعديل مصروف: ${editing.description}` : "تسجيل مصروف جديد"}
        fields={fields}
        initial={editing}
        onClose={() => setOpen(false)}
        onSubmit={(values) => {
          const payload = { ...values, amount: Number(values.amount) };
          if (editing) expensesCrud.update(editing.id, payload);
          else expensesCrud.add(payload as Omit<Expense, "id">);
        }}
      />
    </>
  );
}
