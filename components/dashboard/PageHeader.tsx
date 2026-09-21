"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronLeft, Home } from "lucide-react";

type PageHeaderProps = {
  title: string;
  subtitle?: string;
};

/** ترويسة موحدة لصفحات الأقسام مع مسار تنقّل */
export default function PageHeader({ title, subtitle }: PageHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="glass-card p-5 sm:p-6"
    >
      <nav className="flex items-center gap-1.5 text-[11px] font-medium text-teal-900/50 mb-2">
        <Link href="/" className="flex items-center gap-1 hover:text-teal-700 transition-colors">
          <Home className="w-3.5 h-3.5" />
          الرئيسية
        </Link>
        <ChevronLeft className="w-3.5 h-3.5" />
        <span className="text-teal-800 font-bold">{title}</span>
      </nav>
      <h1 className="text-xl sm:text-2xl font-extrabold text-teal-900">{title}</h1>
      {subtitle && <p className="mt-1 text-sm text-teal-900/60">{subtitle}</p>}
    </motion.div>
  );
}
