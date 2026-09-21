"use client";

import { useState } from "react";
import StudentsWidget from "./StudentsWidget";
import DataTable, { type Column } from "./DataTable";
import CrudModal, { type Field } from "./CrudModal";
import AddButton from "./AddButton";
import ExportButton from "./ExportButton";
import { studentRows } from "@/lib/exporters";
import {
  useQitars,
  type Student,
  TRACKS,
  GOVERNORATES,
  STUDENT_STATUSES,
} from "@/lib/store";
import { formatPercent } from "@/lib/format";

const fields: Field[] = [
  { key: "name", label: "اسم الطالب", type: "text", required: true },
  { key: "track", label: "المسار التعليمي", type: "select", options: TRACKS, required: true },
  { key: "governorate", label: "المحافظة", type: "select", options: GOVERNORATES, required: true },
  { key: "status", label: "الحالة", type: "select", options: STUDENT_STATUSES, required: true },
  { key: "progress", label: "نسبة الإنجاز (0-100)", type: "number", required: true, min: 0, max: 100 },
  { key: "enrolledAt", label: "تاريخ التسجيل", type: "date", required: true },
];

export default function StudentsManager() {
  const { students, studentsCrud } = useQitars();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Student | null>(null);

  const columns: Column<Student>[] = [
    { key: "name", label: "الاسم" },
    { key: "track", label: "المسار" },
    { key: "governorate", label: "المحافظة" },
    { key: "status", label: "الحالة" },
    { key: "progress", label: "الإنجاز", format: (v) => formatPercent(Number(v), 0) },
    { key: "enrolledAt", label: "تاريخ التسجيل" },
  ];

  return (
    <>
      <StudentsWidget
        action={
          <AddButton
            label="تسجيل طالب"
            onClick={() => {
              setEditing(null);
              setOpen(true);
            }}
          />
        }
      />

      <DataTable
        title="سجل الطلاب"
        subtitle="إضافة وتعديل وحذف — كل تغيير يظهر فوراً في المؤشرات ومخطط المسارات"
        columns={columns}
        rows={students}
        addLabel="طالب جديد"
        headerExtra={<ExportButton fileName="سجل-الطلاب" sheetName="الطلاب" rows={studentRows(students)} />}
        onAdd={() => {
          setEditing(null);
          setOpen(true);
        }}
        onEdit={(row) => {
          setEditing(row);
          setOpen(true);
        }}
        onDelete={(row) => {
          if (window.confirm(`هل تريد حذف سجل الطالب "${row.name}"؟`))
            studentsCrud.remove(row.id);
        }}
      />

      <CrudModal
        open={open}
        title={editing ? `تعديل بيانات: ${editing.name}` : "تسجيل طالب جديد"}
        fields={fields}
        initial={editing}
        onClose={() => setOpen(false)}
        onSubmit={(values) => {
          const payload = { ...values, progress: Number(values.progress) };
          if (editing) studentsCrud.update(editing.id, payload);
          else studentsCrud.add(payload as Omit<Student, "id">);
        }}
      />
    </>
  );
}
