"use client";

import { Users, Clock, TrendingUp } from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import WidgetShell from "./WidgetShell";
import StatCard from "./StatCard";
import { useQitars } from "@/lib/store";
import { computeVolunteerStats } from "@/lib/analytics";
import { formatNumber, formatHours } from "@/lib/format";

export default function VolunteersWidget({ action }: { action?: React.ReactNode }) {
  const { volunteers } = useQitars();
  const stats = computeVolunteerStats(volunteers);

  return (
    <WidgetShell
      title="إحصاءات المتطوعين"
      subtitle="نمو الفريق المتطوع وساعات العطاء — محسوبة من السجلات"
      icon={Users}
      delay={0.05}
      action={action}
    >
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
        <StatCard
          title="متطوع نشط"
          value={stats.total}
          icon={Users}
          delta={Number(stats.growthPct.toFixed(1))}
        />
        <StatCard
          title="ساعات العمل هذا الشهر"
          value={stats.hoursThisMonth}
          icon={Clock}
          accent="gold"
          suffix="ساعة"
          compact
        />
        <StatCard
          title="انضموا هذا الشهر"
          value={stats.joinedThisMonth}
          icon={TrendingUp}
          accent="gold"
        />
      </div>

      <div className="h-56 rounded-xl bg-white/50 border border-teal-900/5 p-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={stats.monthly} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="volGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#145757" stopOpacity={0.35} />
                <stop offset="100%" stopColor="#145757" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(20,87,87,0.1)" vertical={false} />
            <XAxis dataKey="month" tickLine={false} axisLine={false} />
            <YAxis
              tickLine={false}
              axisLine={false}
              width={44}
              tickFormatter={(v: any) => formatNumber(v)}
            />
            <Tooltip
              contentStyle={{
                borderRadius: 12,
                border: "1px solid rgba(20,87,87,0.15)",
                boxShadow: "0 8px 24px rgba(12,55,55,0.12)",
                backgroundColor: "#fff",
              }}
              formatter={(value: any, name: any) =>
                name === "volunteers"
                  ? [formatNumber(Number(value)) + " متطوع", "إجمالي المتطوعين"]
                  : [formatNumber(Number(value)) + " متطوع", "المنضمون"]
              }
            />
            <Area
              type="monotone"
              dataKey="volunteers"
              stroke="#145757"
              strokeWidth={2.5}
              fill="url(#volGradient)"
              dot={{ r: 3, fill: "#c9a227", strokeWidth: 0 }}
              activeDot={{ r: 5, fill: "#145757" }}
              animationDuration={1200}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <p className="mt-2 text-[10px] text-teal-900/50">
        المنحنى تراكمي: عدد المتطوعين المسجّلين حتى نهاية كل شهر — يُحدَّث تلقائياً عند إضافة أو حذف متطوع
      </p>
    </WidgetShell>
  );
}
