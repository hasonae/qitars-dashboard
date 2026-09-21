"use client";

import { motion } from "framer-motion";
import { Wallet, PieChart as PieIcon, Scale } from "lucide-react";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";
import WidgetShell from "./WidgetShell";
import StatCard from "./StatCard";
import { useQitars } from "@/lib/store";
import { computeExpenseStats } from "@/lib/analytics";
import { formatCurrency, formatPercent } from "@/lib/format";

const COLORS = ["#145757", "#c9a227", "#2d8f8e", "#eec873"];

export default function ExpensesWidget({ action }: { action?: React.ReactNode }) {
  const { expenses } = useQitars();
  const stats = computeExpenseStats(expenses);
  const donutData = stats.byCategory
    .filter((c) => c.spent > 0)
    .map((c) => ({ name: c.name, value: c.spent }));

  return (
    <WidgetShell
      title="إحصاءات المصاريف"
      subtitle="الإنفاق الفعلي مقابل الموازنة المعتمدة — محسوبة من سجل المصاريف"
      icon={Wallet}
      delay={0.25}
      action={action}
    >
      <div className="grid grid-cols-2 gap-3 mb-5">
        <StatCard title="الموازنة السنوية" value={stats.totalBudget} icon={Scale} suffix="ل.س" compact />
        <StatCard title="إجمالي المصروف" value={stats.totalSpent} icon={PieIcon} accent="gold" suffix="ل.س" compact />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-center">
        {/* دونات التصنيفات */}
        <div className="lg:col-span-2 h-64 relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={donutData}
                dataKey="value"
                nameKey="name"
                innerRadius="55%"
                outerRadius="85%"
                paddingAngle={3}
                cornerRadius={6}
                animationDuration={1100}
              >
                {donutData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} stroke="none" />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  borderRadius: 12,
                  border: "1px solid rgba(20,87,87,0.15)",
                  boxShadow: "0 8px 24px rgba(12,55,55,0.12)",
                }}
                formatter={(value: any) => [formatCurrency(Number(value)), "المصروف"]}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <p className="text-[10px] text-teal-900/50">نسبة الصرف</p>
            <p className="text-2xl font-extrabold text-teal-900">
              {formatPercent(stats.usagePct, 0)}
            </p>
          </div>
        </div>

        {/* الموازنة مقابل الفعلي */}
        <div className="lg:col-span-3 space-y-4">
          {stats.byCategory.map((c, i) => (
            <div key={c.name}>
              <div className="flex items-center justify-between mb-1.5 gap-2">
                <p className="text-xs font-bold text-teal-900">{c.name}</p>
                <p className="text-[11px] text-teal-900/60 whitespace-nowrap">
                  {formatCurrency(c.spent)}{" "}
                  <span className="text-teal-900/40">من {formatCurrency(c.budget)}</span>
                </p>
              </div>
              <div className="h-2.5 rounded-full bg-teal-900/10 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: `${Math.min(c.pct, 100)}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, delay: 0.2 + i * 0.12, ease: "easeOut" }}
                  className="h-full rounded-full relative overflow-hidden"
                  style={{ background: COLORS[i % COLORS.length] }}
                >
                  <span className="shimmer-bar absolute inset-0" />
                </motion.div>
              </div>
              <p className="mt-1 text-[10px] text-teal-900/50">
                {formatPercent(c.pct, 0)} من الموازنة المخصصة
              </p>
            </div>
          ))}
        </div>
      </div>
    </WidgetShell>
  );
}
