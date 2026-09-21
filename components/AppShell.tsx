"use client";

import { useState } from "react";
import Sidebar from "./layout/Sidebar";
import Topbar from "./layout/Topbar";
import { QitarsProvider } from "@/lib/store";

/**
 * الهيكل العام للتطبيق: مخزن البيانات + شريط جانبي + شريط علوي + منطقة محتوى.
 * يُستخدم كـ layout لكل صفحات الداشبورد.
 */
export default function AppShell({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <QitarsProvider>
      <div className="flex min-h-screen">
        <Sidebar
          collapsed={collapsed}
          onToggle={() => setCollapsed((v) => !v)}
          mobileOpen={mobileOpen}
          onCloseMobile={() => setMobileOpen(false)}
        />

        <div className="flex-1 min-w-0 flex flex-col">
          <Topbar onOpenMobile={() => setMobileOpen(true)} />

          <main className="flex-1 p-4 sm:p-6 space-y-5 max-w-[1600px] w-full mx-auto">
            {children}
          </main>

          <footer className="py-6 text-center text-[11px] text-teal-900/40">
            Qitars — منظمة دعم وتمكين أبناء الطائفة العلوية والشباب في سوريا ·
            معاً نحو النمو والاعتماد على الذات
          </footer>
        </div>
      </div>
    </QitarsProvider>
  );
}
