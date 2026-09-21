import HeroBanner from "@/components/dashboard/HeroBanner";
import VolunteersWidget from "@/components/dashboard/VolunteersWidget";
import StudentsWidget from "@/components/dashboard/StudentsWidget";
import LocationsWidget from "@/components/dashboard/LocationsWidget";
import DonationsWidget from "@/components/dashboard/DonationsWidget";
import ExpensesWidget from "@/components/dashboard/ExpensesWidget";
import JobsWidget from "@/components/dashboard/JobsWidget";
import InvestmentsWidget from "@/components/dashboard/InvestmentsWidget";

export default function HomePage() {
  return (
    <>
      <HeroBanner />

      {/* كل ويدجت بعرض كامل لضمان اتساع بطاقات الإحصاءات */}
      <VolunteersWidget />
      <StudentsWidget />
      <LocationsWidget />
      <DonationsWidget />
      <ExpensesWidget />
      <JobsWidget />
      <InvestmentsWidget />
    </>
  );
}
