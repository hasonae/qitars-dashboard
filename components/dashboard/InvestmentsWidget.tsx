"use client";

import { Sprout, Sprout as SproutIcon, TrendingUp, Users, DollarSign } from "lucide-react";
import WidgetShell from "./WidgetShell";
import StatCard from "./StatCard";
import { useQitars } from "@/lib/store";
import { computeInvestmentStats } from "@/lib/analytics";
import { formatCurrency, formatPercent } from "@/lib/format";

const statusStyle: Record<string, string> = {
  "نشط": "bg-emerald-50 text-emerald-600",
  "قيد التأسيس": "bg-amber-50 text-amber-600",
  "مكتمل": "bg-teal-50 text-teal-700",
};

export default function InvestmentsWidget({ action }: { action?: React.ReactNode }) {
  const { investments } = useQitars();
  const stats = computeInvestmentStats(investments);

  return (
    <WidgetShell
      title="إحصاءات الاستثمارات"
      subtitle="المشاريع الاستثمارية وأثرها الاقتصادي — محسوبة من سجل المشاريع"
      icon={Sprout}
      delay={0.35}
      action={action}
    >
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
        <StatCard title="استثمارات صغيرة نشطة" value={stats.active} icon={SproutIcon} />
        <StatCard title="إجمالي المستثمر" value={stats.totalInvested} icon={DollarSign} accent="gold" suffix="ل.س" compact />
        <StatCard title="متوسط العائد" value={Number(stats.avgRoi.toFixed(1))} icon={TrendingUp} suffix="٪" />
        <StatCard title="وظائف أنشأتها المشاريع" value={stats.jobs} icon={Users} accent="gold" compact />
      </div>

      <div className="space-y-2">
        {investments.map((p) => (
          <div
            key={p.id}
            className="rounded-xl bg-white/60 border border-teal-900/5 p-3.5 hover:bg-white hover:shadow-soft transition-all duration-300"
          >
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-sm font-extrabold text-teal-900">{p.name}</p>
                  <span
                    className={`text-[10px] font-bold rounded-full px-2 py-0.5 ${
                      statusStyle[p.status] ?? "bg-teal-50 text-teal-700"
                    }`}
                  >
                    {p.status}
                  </span>
                  <span className="text-[10px] text-teal-900/50">{p.governorate}</span>
                </div>
                <p className="text-[11px] text-teal-900/50 mt-1">
                  مستثمر: {formatCurrency(Number(p.invested))} · مسترد:{" "}
                  {formatCurrency(Number(p.returned))} · وظائف: {p.jobsCreated ?? 0}
                </p>
              </div>
              <div className="text-left">
                <p className="text-[10px] text-teal-900/50">العائد على الاستثمار</p>
                <p
                  className={`text-lg font-extrabold ${
                    Number(p.roi) >= 20 ? "text-emerald-600" : "text-gold-700"
                  }`}
                >
                  {formatPercent(Number(p.roi))}
                </p>
              </div>
            </div>
            <div className="mt-2.5 h-1.5 rounded-full bg-teal-900/10 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-l from-teal-600 to-gold-600 transition-all duration-700"
                style={{ width: `${Math.min(Number(p.roi) * 2.5, 100)}%` }}
              />
            </div>
          </div>
        ))}
        {investments.length === 0 && (
          <p className="text-xs text-teal-900/50 text-center py-8">لا توجد مشاريع مسجّلة</p>
        )}
      </div>
    </WidgetShell>
  );
}
