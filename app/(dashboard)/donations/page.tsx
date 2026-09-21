import PageHeader from "@/components/dashboard/PageHeader";
import DonationsManager from "@/components/dashboard/DonationsManager";

export const metadata = { title: "التبرعات | Qitars" };

export default function DonationsPage() {
  return (
    <>
      <PageHeader
        title="التبرعات"
        subtitle="إدارة التبرعات — تسجيل مساهمات جديدة وتعديلها"
      />
      <DonationsManager />
    </>
  );
}
