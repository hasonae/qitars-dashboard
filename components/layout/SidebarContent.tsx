"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Settings,
  LogOut,
} from "lucide-react";
import { navItems } from "./navItems";

type SidebarContentProps = {
  collapsed: boolean;
  onToggle: () => void;
  pathname: string;
  onCloseMobile: () => void;
};

export default function SidebarContent({
  collapsed,
  onToggle,
  pathname,
  onCloseMobile,
}: SidebarContentProps) {
  return (
    <div className="flex flex-col h-full bg-teal-gradient text-white relative overflow-hidden">
      {/* زخرفة خلفية */}
      <div className="absolute -top-24 -left-24 w-64 h-64 rounded-full bg-gold-600/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-40 h-40 rounded-full bg-teal-400/10 blur-2xl pointer-events-none" />

      {/* الشعار */}
      <div className="flex items-center gap-3 px-4 h-[72px] shrink-0 border-b border-white/10">
        <div className="w-11 h-11 rounded-xl bg-white flex items-center justify-center shadow-lifted shrink-0 overflow-hidden">
          <Image
            src="/qitars-logo.png"
            alt="شعار Qitars"
            width={40}
            height={40}
            className="w-9 h-9 object-contain"
            priority
          />
        </div>
        <AnimatePresence>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 8 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden whitespace-nowrap"
            >
              <p className="font-extrabold text-lg leading-tight tracking-wide text-white">
                Qitars
              </p>
              <p className="text-[10px] text-gold-200/80 font-medium">
                منصة التمكين والنمو
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* الروابط */}
      <nav className="flex-1 overflow-y-auto overflow-x-hidden py-4 px-3 space-y-1">
        {navItems.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onCloseMobile}
              title={collapsed ? item.label : undefined}
              className={`group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors duration-200 ${
                active
                  ? "text-white"
                  : "text-teal-100/70 hover:text-white hover:bg-white/5"
              }`}
            >
              {active && (
                <motion.span
                  layoutId="nav-active"
                  className="absolute inset-0 rounded-xl bg-white/10 border border-white/15"
                  transition={{ type: "spring", stiffness: 380, damping: 32 }}
                />
              )}
              {active && (
                <motion.span
                  layoutId="nav-dot"
                  className="absolute -right-3 top-1/2 -translate-y-1/2 w-1.5 h-7 rounded-full bg-gold-gradient shadow-lifted"
                  transition={{ type: "spring", stiffness: 380, damping: 32 }}
                />
              )}
              <item.icon
                className={`w-5 h-5 shrink-0 transition-transform duration-300 group-hover:scale-110 ${
                  active ? "text-gold-300" : ""
                }`}
                strokeWidth={1.9}
              />
              <AnimatePresence>
                {!collapsed && (
                  <motion.span
                    initial={{ opacity: 0, x: 8 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 8 }}
                    transition={{ duration: 0.15 }}
                    className="whitespace-nowrap relative z-10"
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>
          );
        })}
      </nav>

      {/* التذييل */}
      <div className="p-3 border-t border-white/10 space-y-1 shrink-0">
        <Link
          href="/settings"
          title={collapsed ? "الإعدادات" : undefined}
          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-teal-100/70 hover:text-white hover:bg-white/5 transition-colors"
        >
          <Settings className="w-5 h-5 shrink-0" strokeWidth={1.9} />
          {!collapsed && <span>الإعدادات</span>}
        </Link>
        <Link
          href="/settings#logout"
          title={collapsed ? "تسجيل الخروج" : undefined}
          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-teal-100/70 hover:text-rose-200 hover:bg-rose-500/10 transition-colors"
        >
          <LogOut className="w-5 h-5 shrink-0" strokeWidth={1.9} />
          {!collapsed && <span>تسجيل الخروج</span>}
        </Link>
      </div>
    </div>
  );
}
