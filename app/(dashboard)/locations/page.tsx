import PageHeader from "@/components/dashboard/PageHeader";
import LocationsWidget from "@/components/dashboard/LocationsWidget";
import LocationsExport from "@/components/dashboard/LocationsExport";

export const metadata = { title: "المواقع والتوزيع | Qitars" };

export default function LocationsPage() {
  return (
    <>
      <PageHeader
        title="المواقع والتوزيع"
        subtitle="الانتشار الجغرافي للمستفيدين والمشاريع على خريطة سوريا"
      />
      <LocationsExport />
      <LocationsWidget />
    </>
  );
}
