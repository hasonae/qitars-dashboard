import PageHeader from "@/components/dashboard/PageHeader";
import ExpensesManager from "@/components/dashboard/ExpensesManager";

export const metadata = { title: "المصاريف | Qitars" };

export default function ExpensesPage() {
  return (
    <>
      <PageHeader
        title="المصاريف"
        subtitle="تسجيل الإنفاق ومقارنته بالموازنة المعتمدة — كل الأرقام محسوبة من السجلات"
      />
      <ExpensesManager />
    </>
  );
}
