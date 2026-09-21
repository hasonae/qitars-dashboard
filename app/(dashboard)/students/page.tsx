import PageHeader from "@/components/dashboard/PageHeader";
import StudentsManager from "@/components/dashboard/StudentsManager";

export const metadata = { title: "الطلاب | Qitars" };

export default function StudentsPage() {
  return (
    <>
      <PageHeader
        title="الطلاب"
        subtitle="إدارة الطلاب المسجّلين — إضافة وتعديل وحذف السجلات"
      />
      <StudentsManager />
    </>
  );
}
