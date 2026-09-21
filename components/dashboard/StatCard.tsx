"use client";

import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { TrendingUp, TrendingDown } from "lucide-react";
import CountUp from "./CountUp";
import { formatNumber, formatCompact } from "@/lib/format";

type StatCardProps = {
  title: string;
  value: number;
  icon: LucideIcon;
  suffix?: string;
  delta?: number;
  accent?: "teal" | "gold";
  delay?: number;
  compact?: boolean;
};

export default function StatCard({
  title,
  value,
  icon: Icon,
  suffix,
  delta,
  accent = "teal",
  delay = 0,
  compact = false,
}: StatCardProps) {
  const isTeal = accent === "teal";
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
      className="glass-card card-hover p-4 sm:p-5 flex items-start gap-3"
    >
      <div
        className={`shrink-0 w-10 h-10 rounded-xl flex items-center justify-center ${
          isTeal ? "bg-teal-700/10 text-teal-700" : "bg-gold-600/10 text-gold-700"
        }`}
      >
        <Icon className="w-5 h-5" strokeWidth={1.9} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[11px] sm:text-xs font-medium text-teal-900/60 leading-snug">
          {title}
        </p>
        <p className="mt-1 flex items-baseline flex-wrap gap-x-1 text-xl sm:text-2xl font-extrabold text-teal-900 tracking-tight tabular-nums leading-tight">
          <CountUp value={value} format={compact ? formatCompact : formatNumber} />
          {suffix && (
            <span className="text-xs sm:text-sm font-semibold text-teal-700/60">
              {suffix}
            </span>
          )}
        </p>
        {typeof delta === "number" && (
          <p className="mt-1.5 flex items-center flex-wrap gap-1 text-[10px] sm:text-[11px] font-bold">
            <span
              className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full ${
                delta >= 0
                  ? "bg-emerald-50 text-emerald-600"
                  : "bg-rose-50 text-rose-600"
              }`}
            >
              {delta >= 0 ? (
                <TrendingUp className="w-3 h-3" />
              ) : (
                <TrendingDown className="w-3 h-3" />
              )}
              {formatNumber(Math.abs(delta))}٪
            </span>
            <span className="text-teal-900/50">مقارنة بالشهر الماضي</span>
          </p>
        )}
      </div>
    </motion.div>
  );
}
