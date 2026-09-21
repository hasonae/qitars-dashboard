"use client";

import { HeartHandshake, ArrowDownLeft, Building2, User, Landmark, Users } from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
} from "recharts";
import WidgetShell from "./WidgetShell";
import StatCard from "./StatCard";
import { useQitars } from "@/lib/store";
import { computeDonationStats } from "@/lib/analytics";
import { formatNumber, formatCurrency, timeAgo } from "@/lib/format";

const typeIcon = { فرد: User, شركة: Building2, جمعية: Landmark } as const;

export default function DonationsWidget({ action }: { action?: React.ReactNode }) {
  const { donations } = useQitars();
  const stats = computeDonationStats(donations);

  return (
    <WidgetShell
      title="إحصاءات التبرعات"
      subtitle="الإجماليات والاتجاه الشهري — محسوبة من سجل التبرعات"
      icon={HeartHandshake}
      delay={0.2}
      action={action}
    >
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
        <StatCard title="إجمالي المجمّع" value={stats.totalRaised} icon={HeartHandshake} suffix="ل.س" compact />
        <StatCard title="تبرعات هذا الشهر" value={stats.thisMonth} icon={ArrowDownLeft} accent="gold" suffix="ل.س" compact />
        <StatCard title="عدد المتبرعين" value={stats.donors} icon={Users} compact />
        <StatCard
          title="معدل النمو الشهري"
          value={Number(stats.growthPct.toFixed(1))}
          icon={ArrowDownLeft}
          accent="gold"
          suffix="٪"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        {/* مخطط الاتجاه الشهري */}
        <div className="lg:col-span-3 h-60 rounded-xl bg-white/50 border border-teal-900/5 p-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={stats.monthly} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(20,87,87,0.1)" vertical={false} />
              <XAxis dataKey="month" tickLine={false} axisLine={false} />
              <YAxis tickLine={false} axisLine={false} width={44} tickFormatter={(v: any) => formatNumber(v)} />
              <Tooltip
                cursor={{ fill: "rgba(20,87,87,0.05)" }}
                contentStyle={{
                  borderRadius: 12,
                  border: "1px solid rgba(20,87,87,0.15)",
                  boxShadow: "0 8px 24px rgba(12,55,55,0.12)",
                }}
                formatter={(value: any) => [formatNumber(Number(value)) + " مليون ل.س", "التبرعات"]}
              />
              <Bar dataKey="amount" radius={[8, 8, 0, 0]} animationDuration={1100}>
                {stats.monthly.map((_, i) => (
                  <Cell
                    key={i}
                    fill={i === stats.monthly.length - 1 ? "#c9a227" : "#145757"}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* فيد أحدث التبرعات */}
        <div className="lg:col-span-2 space-y-1.5">
          {stats.feed.map((d) => {
            const Icon = typeIcon[d.type as keyof typeof typeIcon] ?? User;
            return (
              <div
                key={d.id}
                className="flex items-center gap-3 rounded-xl bg-white/60 border border-teal-900/5 px-3 py-2.5 hover:bg-teal-50/70 transition-colors"
              >
                <div className="w-9 h-9 shrink-0 rounded-lg bg-teal-700/10 text-teal-700 flex items-center justify-center">
                  <Icon className="w-4 h-4" strokeWidth={1.9} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-teal-900 truncate">{d.donor}</p>
                  <p className="text-[10px] text-teal-900/50" suppressHydrationWarning>
                    {timeAgo(d.minutesAgo)} · {d.type}
                  </p>
                </div>
                <p className="text-xs font-extrabold text-gold-700 whitespace-nowrap">
                  {formatCurrency(Number(d.amount))}
                </p>
              </div>
            );
          })}
          {stats.feed.length === 0 && (
            <p className="text-xs text-teal-900/50 text-center py-8">لا توجد تبرعات مسجّلة</p>
          )}
        </div>
      </div>
    </WidgetShell>
  );
}
