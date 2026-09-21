"use client";

import { Briefcase, BriefcaseBusiness, Handshake, Award, TrendingUp } from "lucide-react";
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  Tooltip,
} from "recharts";
import WidgetShell from "./WidgetShell";
import StatCard from "./StatCard";
import { useQitars } from "@/lib/store";
import { computeJobStats } from "@/lib/analytics";
import { formatNumber, formatPercent } from "@/lib/format";

export default function JobsWidget({ action }: { action?: React.ReactNode }) {
  const { trainees, employees, students } = useQitars();
  const stats = computeJobStats(trainees, employees, students);

  return (
    <WidgetShell
      title="أنواع الأعمال والتشغيل"
      subtitle="التدريب المهني والتوظيف — من سجلين مستقلين: المتدربون والموظفون"
      icon={Briefcase}
      delay={0.3}
      action={action}
    >
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
        <StatCard
          title="معدل التوظيف"
          value={Number(stats.rate.toFixed(1))}
          icon={BriefcaseBusiness}
          suffix="٪"
        />
        <StatCard title="متدربون" value={stats.trained} icon={Award} accent="gold" compact />
        <StatCard title="تم توظيفهم" value={stats.employed} icon={Handshake} compact />
        <StatCard title="جهات تشغيل شريكة" value={stats.partners} icon={TrendingUp} accent="gold" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-5 items-center">
        <div className="md:col-span-3 h-64">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={stats.radar} outerRadius="72%">
              <PolarGrid stroke="rgba(20,87,87,0.18)" />
              <PolarAngleAxis dataKey="skill" tick={{ fontSize: 10, fill: "#1c2b2b" }} />
              <Radar
                dataKey="value"
                stroke="#145757"
                fill="#145757"
                fillOpacity={0.25}
                strokeWidth={2}
                animationDuration={1200}
                dot={{ r: 3, fill: "#c9a227", strokeWidth: 0 }}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: 12,
                  border: "1px solid rgba(20,87,87,0.15)",
                  boxShadow: "0 8px 24px rgba(12,55,55,0.12)",
                }}
                formatter={(value: any) => [formatPercent(Number(value), 0), "متوسط جاهزية الطلاب"]}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* أعلى المسارات */}
        <div className="md:col-span-2 space-y-3">
          {[...stats.radar]
            .sort((a, b) => b.value - a.value)
            .slice(0, 3)
            .map((s, i) => (
              <div
                key={s.skill}
                className="flex items-center gap-3 rounded-xl bg-white/60 border border-teal-900/5 px-3 py-2.5"
              >
                <span
                  className={`w-7 h-7 rounded-lg flex items-center justify-center text-[11px] font-extrabold ${
                    i === 0
                      ? "bg-gold-gradient text-teal-900"
                      : "bg-teal-700/10 text-teal-700"
                  }`}
                >
                  {formatNumber(i + 1)}
                </span>
                <p className="flex-1 text-xs font-bold text-teal-900">{s.skill}</p>
                <p className="text-xs font-extrabold text-teal-700">
                  {formatPercent(s.value, 0)}
                </p>
              </div>
            ))}
          <p className="text-[10px] text-teal-900/50 leading-relaxed px-1">
            مؤشر الجاهزية = متوسط نسبة تقدم الطلاب في المسارات المرتبطة بكل مهارة
          </p>
        </div>
      </div>
    </WidgetShell>
  );
}
