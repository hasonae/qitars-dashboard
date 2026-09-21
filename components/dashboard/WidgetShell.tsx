"use client";

import type { LucideIcon } from "lucide-react";
import { motion } from "framer-motion";

type WidgetShellProps = {
  title: string;
  subtitle?: string;
  icon: LucideIcon;
  children: React.ReactNode;
  className?: string;
  delay?: number;
  action?: React.ReactNode;
};

/** إطار موحد لكل ويدجت: بطاقة زجاجية بعنوان وأيقونة، مع حركة دخول */
export default function WidgetShell({
  title,
  subtitle,
  icon: Icon,
  children,
  className = "",
  delay = 0,
  action,
}: WidgetShellProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
      className={`glass-card card-hover p-5 sm:p-6 ${className}`}
    >
      <div className="flex items-start justify-between gap-3 mb-5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-teal-700/10 text-teal-700 flex items-center justify-center">
            <Icon className="w-[18px] h-[18px]" strokeWidth={1.9} />
          </div>
          <div>
            <h2 className="widget-title">{title}</h2>
            {subtitle && <p className="widget-sub mt-0.5">{subtitle}</p>}
          </div>
        </div>
        {action}
      </div>
      {children}
    </motion.section>
  );
}
