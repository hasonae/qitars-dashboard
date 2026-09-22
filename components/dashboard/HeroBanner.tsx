"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import CountUp from "./CountUp";
import { useQitars } from "@/lib/store";
import { assetUrl } from "@/lib/assets";
import {
  computeInvestmentStats,
  computeStudentStats,
  computeVolunteerStats,
} from "@/lib/analytics";
import { formatNumber } from "@/lib/format";

/** ترويسة الترحيب + إجماليات المنظمة (محسوبة من السجلات) */
export default function HeroBanner() {
  const { students, volunteers, investments } = useQitars();
  const studentStats = computeStudentStats(students);
  const volunteerStats = computeVolunteerStats(volunteers);
  const investmentStats = computeInvestmentStats(investments);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="rounded-xl2 bg-teal-gradient text-white p-6 sm:p-8 relative overflow-hidden shadow-lifted"
    >
      <div className="absolute -top-16 -left-16 w-56 h-56 rounded-full bg-gold-600/15 blur-3xl" />
      <div className="absolute -bottom-20 right-24 w-64 h-64 rounded-full bg-teal-400/10 blur-3xl" />

      <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex-1 min-w-0">
          <p className="flex items-center gap-2 text-gold-300 text-xs font-bold mb-1.5">
            <Sparkles className="w-4 h-4" />
            لوحة التحكم الرئيسية
          </p>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            أهلاً بك في منصة <span className="text-gold-300">Qitars</span>
          </h1>
          <p className="mt-1.5 text-sm text-teal-100/80 max-w-lg leading-relaxed">
            نظرة شاملة على أثر المنظمة: الدورات التعليمية، المشاريع التنموية،
            والمبادرات المجتمعية لتمكين أبناء الطائفة العلوية وشباب سوريا.
          </p>
          <div className="flex gap-3 mt-5 flex-wrap">
            <Link
              href="/locations"
              className="rounded-xl bg-white/10 border border-white/15 backdrop-blur px-4 py-3 hover:bg-white/20 hover:-translate-y-0.5 transition-all"
            >
              <p className="text-[10px] text-teal-100/70">إجمالي المستفيدين</p>
              <p className="text-xl font-extrabold text-gold-300">
                <CountUp value={studentStats.enrolled} format={formatNumber} />
              </p>
            </Link>
            <Link
              href="/investments"
              className="rounded-xl bg-white/10 border border-white/15 backdrop-blur px-4 py-3 hover:bg-white/20 hover:-translate-y-0.5 transition-all"
            >
              <p className="text-[10px] text-teal-100/70">مشاريع نشطة</p>
              <p className="text-xl font-extrabold text-gold-300">
                <CountUp value={investmentStats.active} format={formatNumber} />
              </p>
            </Link>
            <Link
              href="/volunteers"
              className="rounded-xl bg-white/10 border border-white/15 backdrop-blur px-4 py-3 hover:bg-white/20 hover:-translate-y-0.5 transition-all"
            >
              <p className="text-[10px] text-teal-100/70">متطوعون</p>
              <p className="text-xl font-extrabold text-gold-300">
                <CountUp value={volunteerStats.total} format={formatNumber} />
              </p>
            </Link>
          </div>
        </div>

        {/* علم الطائفة العلوية */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.65, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className="shrink-0 self-center md:self-auto"
        >
          <div className="rounded-2xl p-1.5 bg-gold-gradient shadow-lifted">
            <Image
              src={assetUrl("/alawite-flag.jpg")}
              alt="علم الطائفة العلوية"
              width={240}
              height={160}
              priority
              className="w-36 sm:w-44 md:w-52 h-auto rounded-xl object-cover"
            />
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
