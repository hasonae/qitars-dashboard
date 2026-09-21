import PageHeader from "@/components/dashboard/PageHeader";
import JobsManager from "@/components/dashboard/JobsManager";

export const metadata = { title: "أنواع الأعمال | Qitars" };

export default function JobsPage() {
  return (
    <>
      <PageHeader
        title="أنواع الأعمال والتشغيل"
        subtitle="التدريب المهني والتوظيف — معدلات التوظيف وجهات التشغيل الشريكة"
      />
      <JobsManager />
    </>
  );
}
