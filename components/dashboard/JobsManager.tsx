"use client";

import { useState } from "react";
import { Handshake } from "lucide-react";
import JobsWidget from "./JobsWidget";
import DataTable, { type Column } from "./DataTable";
import CrudModal, { type Field } from "./CrudModal";
import AddButton from "./AddButton";
import ExportButton from "./ExportButton";
import { traineeRows, employeeRows } from "@/lib/exporters";
import {
  useQitars,
  type Trainee,
  type Employee,
  TRACKS,
  GOVERNORATES,
  TRAINEE_STATUSES,
} from "@/lib/store";

const traineeFields: Field[] = [
  { key: "name", label: "اسم المتدرب", type: "text", required: true },
  { key: "track", label: "المسار التدريبي", type: "select", options: TRACKS, required: true },
  { key: "governorate", label: "المحافظة", type: "select", options: GOVERNORATES, required: true },
  { key: "status", label: "حالة التدريب", type: "select", options: TRAINEE_STATUSES, required: true },
  { key: "date", label: "تاريخ الالتحاق", type: "date", required: true },
];

const employeeFields: Field[] = [
  { key: "name", label: "اسم الموظف", type: "text", required: true },
  { key: "track", label: "المسار التدريبي", type: "select", options: TRACKS, required: true },
  { key: "governorate", label: "المحافظة", type: "select", options: GOVERNORATES, required: true },
  { key: "employer", label: "جهة التشغيل", type: "text", required: true },
  { key: "date", label: "تاريخ التوظيف", type: "date", required: true },
];

export default function JobsManager() {
  const { trainees, employees, traineesCrud, employeesCrud } = useQitars();

  const [tOpen, setTOpen] = useState(false);
  const [tEditing, setTEditing] = useState<Trainee | null>(null);
  const [eOpen, setEOpen] = useState(false);
  const [eEditing, setEEditing] = useState<Employee | null>(null);
  const [eInitial, setEInitial] = useState<Partial<Employee> | null>(null);

  const today = new Date().toISOString().slice(0, 10);

  const traineeColumns: Column<Trainee>[] = [
    { key: "name", label: "الاسم" },
    { key: "track", label: "المسار" },
    { key: "governorate", label: "المحافظة" },
    { key: "status", label: "حالة التدريب" },
    { key: "date", label: "تاريخ الالتحاق" },
  ];

  const employeeColumns: Column<Employee>[] = [
    { key: "name", label: "الاسم" },
    { key: "track", label: "المسار" },
    { key: "governorate", label: "المحافظة" },
    { key: "employer", label: "جهة التشغيل" },
    { key: "date", label: "تاريخ التوظيف" },
  ];

  // توظيف متدرب: يُنشأ له سجل في سجل الموظفين المستقل — لا يُحذف من سجل المتدربين
  const openHire = (row: Trainee) => {
    setEEditing(null);
    setEInitial({ name: row.name, track: row.track, governorate: row.governorate, date: today });
    setEOpen(true);
  };

  return (
    <>
      <JobsWidget
        action={
          <AddButton
            label="تسجيل متدرب"
            onClick={() => {
              setTEditing(null);
              setTOpen(true);
            }}
          />
        }
      />

      <DataTable
        title="سجل المتدربين"
        subtitle="قائمة مستقلة — الحذف والتعديل يمسّان عدّاد المتدربين فقط"
        columns={traineeColumns}
        rows={trainees}
        addLabel="متدرب جديد"
        onAdd={() => {
          setTEditing(null);
          setTOpen(true);
        }}
        onEdit={(row) => {
          setTEditing(row);
          setTOpen(true);
        }}
        onDelete={(row) => {
          if (window.confirm(`هل تريد حذف المتدرب "${row.name}"؟ لن يتأثر سجل الموظفين.`))
            traineesCrud.remove(row.id);
        }}
        customAction={{
          icon: Handshake,
          title: "توظيف — إضافة إلى سجل الموظفين",
          className:
            "w-8 h-8 rounded-lg bg-gold-600/15 text-gold-700 flex items-center justify-center hover:bg-gold-600 hover:text-white transition-colors",
          onClick: openHire,
        }}
        headerExtra={
          <ExportButton
            fileName="سجل-المتدربين"
            sheetName="المتدربون"
            rows={traineeRows(trainees)}
          />
        }
      />

      <DataTable
        title="سجل الموظفين"
        subtitle="قائمة مستقلة — الحذف والتعديل يمسّان عدّاد الموظفين فقط"
        columns={employeeColumns}
        rows={employees}
        addLabel="موظف جديد"
        onAdd={() => {
          setEEditing(null);
          setEInitial(null);
          setEOpen(true);
        }}
        onEdit={(row) => {
          setEEditing(row);
          setEInitial(null);
          setEOpen(true);
        }}
        onDelete={(row) => {
          if (window.confirm(`هل تريد حذف الموظف "${row.name}"؟ لن يتأثر سجل المتدربين.`))
            employeesCrud.remove(row.id);
        }}
        headerExtra={
          <ExportButton
            fileName="سجل-الموظفين"
            sheetName="الموظفون"
            rows={employeeRows(employees)}
          />
        }
      />

      <CrudModal
        open={tOpen}
        title={tEditing ? `تعديل بيانات المتدرب: ${tEditing.name}` : "تسجيل متدرب جديد"}
        fields={traineeFields}
        initial={tEditing}
        onClose={() => setTOpen(false)}
        onSubmit={(values) => {
          if (tEditing) traineesCrud.update(tEditing.id, values);
          else traineesCrud.add(values as Omit<Trainee, "id">);
        }}
      />

      <CrudModal
        open={eOpen}
        title={eEditing ? `تعديل بيانات الموظف: ${eEditing.name}` : "إضافة موظف جديد"}
        fields={employeeFields}
        initial={eEditing ?? eInitial}
        onClose={() => setEOpen(false)}
        onSubmit={(values) => {
          if (eEditing) employeesCrud.update(eEditing.id, values);
          else employeesCrud.add(values as Omit<Employee, "id">);
        }}
      />
    </>
  );
}
