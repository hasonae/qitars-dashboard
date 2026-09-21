import PageHeader from "@/components/dashboard/PageHeader";
import AccountSettings from "@/components/dashboard/AccountSettings";
import DataSettings from "@/components/dashboard/DataSettings";
import Image from "next/image";

export const metadata = { title: "الإعدادات | Qitars" };

const sections = [
  {
    title: "ملف المنظمة",
    rows: ["اسم المنظمة: Qitars", "المقر: سوريا", "اللغة: العربية (RTL)"],
  },
  {
    title: "الإدارة المالية",
    rows: ["العملة الافتراضية: الليرة السورية (ل.س)", "تنسيق الأرقام: لاتيني مضغوط (99.4M)"],
  },
];

export default function SettingsPage() {
  return (
    <>
      <PageHeader title="الإعدادات" subtitle="إعدادات المنصة العامة والمالية" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <AccountSettings />
        <DataSettings />

        {sections.map((s) => (
          <section key={s.title} className="glass-card card-hover p-5 sm:p-6">
            <h2 className="widget-title mb-4">{s.title}</h2>
            <ul className="space-y-2.5">
              {s.rows.map((r) => (
                <li
                  key={r}
                  className="flex items-center justify-between rounded-lg bg-white/60 border border-teal-900/5 px-3 py-2.5 text-xs font-medium text-teal-900"
                >
                  {r}
                  <span className="text-[10px] font-bold text-teal-700/60">مفعّل</span>
                </li>
              ))}
            </ul>
          </section>
        ))}

        {/* الهوية البصرية */}
        <section className="glass-card card-hover p-5 sm:p-6">
          <h2 className="widget-title mb-4">الهوية البصرية</h2>
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-xl bg-white border border-teal-900/10 shadow-soft flex items-center justify-center overflow-hidden">
              <Image
                src="/qitars-logo.png"
                alt="شعار Qitars"
                width={56}
                height={56}
                className="w-14 h-14 object-contain"
              />
            </div>
            <div className="w-20 h-14 rounded-lg overflow-hidden ring-2 ring-gold-600/40 shadow-soft">
              <Image
                src="/alawite-flag.jpg"
                alt="العلم العلوي"
                width={80}
                height={56}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
