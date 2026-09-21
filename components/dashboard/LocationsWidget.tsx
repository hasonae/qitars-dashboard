"use client";

import { useMemo } from "react";
import { MapPin } from "lucide-react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from "recharts";
import WidgetShell from "./WidgetShell";
import SyriaMap from "./SyriaMap";
import { useQitars } from "@/lib/store";
import { computeRegionStats } from "@/lib/analytics";
import { formatNumber } from "@/lib/format";

const COLORS = ["#145757", "#c9a227", "#2d8f8e", "#eec873", "#1e7474", "#d99a2b", "#7ccbc2", "#a87c20", "#4aacaa", "#e5ae46", "#b0e2da", "#f5dfa8", "#7ccbc2", "#c9a227"];

export default function LocationsWidget() {
  const { students, volunteers, investments } = useQitars();

  const regions = useMemo(
    () => computeRegionStats(students, volunteers, investments),
    [students, volunteers, investments]
  );

  const donut = regions
    .filter((r) => r.beneficiaries > 0)
    .sort((a, b) => b.beneficiaries - a.beneficiaries)
    .map((r) => ({ name: r.name, value: r.beneficiaries }));

  const covered = regions.filter((r) => r.beneficiaries > 0).length;
  const coveragePct = Math.round((covered / regions.length) * 100);

  return (
    <WidgetShell
      title="المواقع والتوزيع الجغرافي"
      subtitle="من الطلاب والمتطوعين والمشاريع — محسوب من السجلات لكل محافظة"
      icon={MapPin}
      delay={0.15}
      action={
        <span className="text-[11px] font-bold bg-gold-600/10 text-gold-700 rounded-full px-3 py-1">
          {coveragePct}٪ من المحافظات
        </span>
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
        <SyriaMap regions={regions} />

        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={donut}
                dataKey="value"
                nameKey="name"
                innerRadius="52%"
                outerRadius="80%"
                paddingAngle={3}
                cornerRadius={6}
                animationDuration={1100}
              >
                {donut.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} stroke="none" />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  borderRadius: 12,
                  border: "1px solid rgba(20,87,87,0.15)",
                  boxShadow: "0 8px 24px rgba(12,55,55,0.12)",
                }}
                formatter={(value: any) => [formatNumber(Number(value)) + " مستفيد", ""]}
              />
              <Legend
                iconType="circle"
                iconSize={8}
                wrapperStyle={{ fontFamily: "inherit", fontSize: 11, direction: "rtl" }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </WidgetShell>
  );
}
