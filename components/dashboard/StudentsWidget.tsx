"use client";

import { GraduationCap, Flame, CheckCircle2, UserCheck } from "lucide-react";
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
import { computeStudentStats } from "@/lib/analytics";
import { formatNumber } from "@/lib/format";

export default function StudentsWidget({ action }: { action?: React.ReactNode }) {
  const { students } = useQitars();
  const stats = computeStudentStats(students);

  return (
    <WidgetShell
      title="إحصاءات الطلاب"
      subtitle="المسجّلون في الدورات ومعدلات الإتمام — محسوبة من السجلات"
      icon={GraduationCap}
      delay={0.1}
      action={action}
    >
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
        <StatCard title="طلاب مسجّلون" value={stats.enrolled} icon={GraduationCap} compact />
        <StatCard title="متعلمون نشطون" value={stats.active} icon={Flame} accent="gold" compact />
        <StatCard
          title="معدل إتمام الدورات"
          value={Number(stats.completionRate.toFixed(1))}
          icon={CheckCircle2}
          suffix="٪"
        />
        <StatCard
          title="طلاب جدد هذا الشهر"
          value={stats.newThisMonth}
          icon={UserCheck}
          accent="gold"
        />
      </div>

      <div className="h-52 rounded-xl bg-white/50 border border-teal-900/5 p-2">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={stats.byTrack} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(20,87,87,0.1)" vertical={false} />
            <XAxis dataKey="track" tickLine={false} axisLine={false} />
            <YAxis tickLine={false} axisLine={false} width={44} tickFormatter={(v: any) => formatNumber(v)} />
            <Tooltip
              cursor={{ fill: "rgba(20,87,87,0.05)" }}
              contentStyle={{
                borderRadius: 12,
                border: "1px solid rgba(20,87,87,0.15)",
                boxShadow: "0 8px 24px rgba(12,55,55,0.12)",
              }}
              formatter={(value: any) => [formatNumber(Number(value)) + " طالب", "عدد الطلاب"]}
            />
            <Bar dataKey="students" radius={[8, 8, 0, 0]} animationDuration={1100}>
              {stats.byTrack.map((_, i) => (
                <Cell key={i} fill={i % 2 === 0 ? "#145757" : "#c9a227"} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <p className="mt-2 text-[10px] text-teal-900/50">
        التوزيع حسب المسار التعليمي · معدل الإتمام = المكملون ÷ (المكملون + المنسحبون)
      </p>
    </WidgetShell>
  );
}
