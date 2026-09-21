import PageHeader from "@/components/dashboard/PageHeader";
import VolunteersManager from "@/components/dashboard/VolunteersManager";

export const metadata = { title: "المتطوعون | Qitars" };

export default function VolunteersPage() {
  return (
    <>
      <PageHeader
        title="المتطوعون"
        subtitle="إدارة الفريق المتطوع — إضافة وتعديل وحذف السجلات"
      />
      <VolunteersManager />
    </>
  );
}
