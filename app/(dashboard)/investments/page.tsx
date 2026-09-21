import PageHeader from "@/components/dashboard/PageHeader";
import InvestmentsManager from "@/components/dashboard/InvestmentsManager";

export const metadata = { title: "الاستثمارات | Qitars" };

export default function InvestmentsPage() {
  return (
    <>
      <PageHeader
        title="الاستثمارات"
        subtitle="إدارة المشاريع الاستثمارية — إضافة وتعديل وحذف"
      />
      <InvestmentsManager />
    </>
  );
}
