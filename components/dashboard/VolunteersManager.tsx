"use client";

import { useState } from "react";
import VolunteersWidget from "./VolunteersWidget";
import DataTable, { type Column } from "./DataTable";
import CrudModal, { type Field } from "./CrudModal";
import AddButton from "./AddButton";
import ExportButton from "./ExportButton";
import { volunteerRows } from "@/lib/exporters";
import { useQitars, type Volunteer, VOLUNTEER_ROLES, GOVERNORATES } from "@/lib/store";
import { formatNumber } from "@/lib/format";

const fields: Field[] = [
  { key: "name", label: "الاسم الكامل", type: "text", required: true },
  { key: "role", label: "الدور", type: "select", options: VOLUNTEER_ROLES, required: true },
  { key: "governorate", label: "المحافظة", type: "select", options: GOVERNORATES, required: true },
  { key: "hours", label: "ساعات العمل هذا الشهر", type: "number", required: true, min: 0, max: 400 },
  { key: "joinedAt", label: "تاريخ الانضمام", type: "date", required: true },
];

export default function VolunteersManager() {
  const { volunteers, volunteersCrud } = useQitars();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Volunteer | null>(null);

  const columns: Column<Volunteer>[] = [
    { key: "name", label: "الاسم" },
    { key: "role", label: "الدور" },
    { key: "governorate", label: "المحافظة" },
    { key: "hours", label: "ساعات/شهر", format: (v) => formatNumber(Number(v)) },
    { key: "joinedAt", label: "تاريخ الانضمام" },
  ];

  return (
    <>
      <VolunteersWidget
        action={
          <AddButton
            label="إضافة متطوع"
            onClick={() => {
              setEditing(null);
              setOpen(true);
            }}
          />
        }
      />

      <DataTable
        title="سجل المتطوعين"
        subtitle="إضافة وتعديل وحذف — كل تغيير يظهر فوراً في الإحصاءات والمنحنى"
        columns={columns}
        rows={volunteers}
        addLabel="متطوع جديد"
        headerExtra={<ExportButton fileName="سجل-المتطوعين" sheetName="المتطوعون" rows={volunteerRows(volunteers)} />}
        onAdd={() => {
          setEditing(null);
          setOpen(true);
        }}
        onEdit={(row) => {
          setEditing(row);
          setOpen(true);
        }}
        onDelete={(row) => {
          if (window.confirm(`هل تريد حذف سجل المتطوع "${row.name}"؟`))
            volunteersCrud.remove(row.id);
        }}
      />

      <CrudModal
        open={open}
        title={editing ? `تعديل بيانات: ${editing.name}` : "إضافة متطوع جديد"}
        fields={fields}
        initial={editing}
        onClose={() => setOpen(false)}
        onSubmit={(values) => {
          const payload = { ...values, hours: Number(values.hours) };
          if (editing) volunteersCrud.update(editing.id, payload);
          else volunteersCrud.add(payload as Omit<Volunteer, "id">);
        }}
      />
    </>
  );
}
