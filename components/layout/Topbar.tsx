"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, Bell, Search, ChevronDown, LayoutDashboard } from "lucide-react";
import { formatToday } from "@/lib/format";
import { useQitars } from "@/lib/store";
import { navItems } from "./navItems";
import { assetUrl } from "@/lib/assets";

type TopbarProps = {
  onOpenMobile: () => void;
};

const notifications = [
  { id: 1, text: "تبرع جديد بقيمة 8 ملايين ل.س من شركة أمل", time: "قبل 45 دقيقة" },
  { id: 2, text: "9 طلاب جدد سجّلوا في دورة البرمجة", time: "قبل ساعتين" },
  { id: 3, text: "مشروع مزرعة الأمل بلغ إنجازاً 80٪", time: "اليوم" },
];

type SearchResult = { label: string; hint: string; href: string };

export default function Topbar({ onOpenMobile }: TopbarProps) {
  const [notifOpen, setNotifOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [query, setQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const { students, volunteers, donations, investments, trainees, employees } = useQitars();

  useEffect(() => setMounted(true), []);

  // نتائج البحث: الأقسام + السجلات من المخزن
  const results = useMemo<SearchResult[]>(() => {
    const q = query.trim();
    if (!q) return [];
    const out: SearchResult[] = [];
    for (const n of navItems) {
      if (n.label.includes(q)) out.push({ label: n.label, hint: "قسم", href: n.href });
    }
    for (const s of students) {
      if (s.name.includes(q)) out.push({ label: s.name, hint: `طالب · ${s.track}`, href: "/students" });
    }
    for (const v of volunteers) {
      if (v.name.includes(q)) out.push({ label: v.name, hint: `متطوع · ${v.role}`, href: "/volunteers" });
    }
    for (const d of donations) {
      if (d.donor.includes(q)) out.push({ label: d.donor, hint: "متبرع", href: "/donations" });
    }
    for (const i of investments) {
      if (i.name.includes(q)) out.push({ label: i.name, hint: "مشروع استثماري", href: "/investments" });
    }
    for (const t of trainees) {
      if (t.name.includes(q))
        out.push({ label: t.name, hint: `متدرب · ${t.track}`, href: "/jobs" });
    }
    for (const e of employees) {
      if (e.name.includes(q) || e.employer.includes(q))
        out.push({ label: e.name, hint: `موظف · ${e.employer}`, href: "/jobs" });
    }
    return out.slice(0, 7);
  }, [query, students, volunteers, donations, investments, trainees, employees]);

  const searchActive = searchOpen && query.trim().length > 0;

  return (
    <header className="sticky top-0 z-30 h-[72px] px-4 sm:px-6 flex items-center gap-3 bg-sand-50/70 backdrop-blur-md border-b border-teal-900/10">
      {/* زر القائمة للجوال */}
      <button
        onClick={onOpenMobile}
        aria-label="فتح القائمة"
        className="lg:hidden w-10 h-10 rounded-xl bg-white shadow-soft flex items-center justify-center text-teal-800 hover:bg-teal-50 transition-colors"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* الشعار المصغّر + علم الطائفة */}
      <div className="lg:hidden flex items-center gap-2">
        <Image
          src={assetUrl("/qitars-logo.png")}
          alt="Qitars"
          width={36}
          height={36}
          className="w-9 h-9 object-contain"
        />
        <span className="font-extrabold text-teal-800">Qitars</span>
      </div>

      {/* البحث */}
      <div className="hidden sm:flex flex-1 max-w-md items-center gap-2 bg-white/80 border border-teal-900/10 rounded-xl px-3 py-2 shadow-soft focus-within:ring-2 focus-within:ring-teal-500/30 transition-all relative">
        <Search className="w-4 h-4 text-teal-700/60" />
        <input
          type="search"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setSearchOpen(true);
          }}
          onFocus={() => setSearchOpen(true)}
          placeholder="ابحث عن طالب، متطوع، مشروع…"
          className="w-full bg-transparent text-sm outline-none placeholder:text-teal-900/40"
        />

        {/* نتائج البحث */}
        <AnimatePresence>
          {searchActive && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setSearchOpen(false)} />
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.98 }}
                transition={{ duration: 0.16, ease: "easeOut" }}
                className="absolute top-12 right-0 left-0 glass-card bg-white/95 shadow-lifted p-2 z-50 max-h-80 overflow-y-auto"
              >
                {results.length === 0 && (
                  <p className="px-3 py-3 text-xs text-teal-900/50">لا توجد نتائج مطابقة</p>
                )}
                {results.map((r, idx) => (
                  <Link
                    key={`${r.href}-${r.label}-${idx}`}
                    href={r.href}
                    onClick={() => {
                      setSearchOpen(false);
                      setQuery("");
                    }}
                    className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg hover:bg-teal-50 transition-colors"
                  >
                    <LayoutDashboard className="w-4 h-4 text-teal-700/60 shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-teal-900 truncate">{r.label}</p>
                      <p className="text-[10px] text-teal-900/50">{r.hint}</p>
                    </div>
                  </Link>
                ))}
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>

      <div className="flex-1 sm:hidden" />

      {/* التاريخ */}
      <span className="hidden md:block text-xs font-medium text-teal-900/60">
        {mounted ? formatToday() : ""}
      </span>

      {/* الإشعارات */}
      <div className="relative">
        <button
          onClick={() => setNotifOpen((v) => !v)}
          aria-label="الإشعارات"
          className="relative w-10 h-10 rounded-xl bg-white shadow-soft flex items-center justify-center text-teal-800 hover:bg-teal-50 transition-colors"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 left-2.5 w-2 h-2 rounded-full bg-gold-600 animate-pulse-soft ring-2 ring-white" />
        </button>

        <AnimatePresence>
          {notifOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setNotifOpen(false)} />
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.97 }}
                transition={{ duration: 0.18, ease: "easeOut" }}
                className="absolute top-12 left-0 w-72 glass-card bg-white/95 p-2 shadow-lifted z-50"
              >
              <p className="px-3 py-2 text-xs font-bold text-teal-900">الإشعارات</p>
              {notifications.map((n) => (
                <div
                  key={n.id}
                  className="px-3 py-2.5 rounded-lg hover:bg-teal-50/80 transition-colors cursor-pointer"
                >
                  <p className="text-xs font-medium text-ink leading-relaxed">{n.text}</p>
                  <p className="text-[10px] text-teal-900/50 mt-0.5">{n.time}</p>
                </div>
              ))}
              </motion.div>
              </>
            )}
          </AnimatePresence>
      </div>

      {/* الملف الشخصي */}
      <Link
        href="/settings"
        className="flex items-center gap-2 bg-white shadow-soft rounded-xl px-2 py-1.5 hover:bg-teal-50 transition-colors"
        title="الإعدادات"
        aria-label="الإعدادات"
      >
        <div className="w-8 h-8 rounded-lg bg-teal-700 text-white flex items-center justify-center text-xs font-extrabold">
          ق
        </div>
        <ChevronDown className="w-4 h-4 text-teal-900/50" />
      </Link>
    </header>
  );
}
