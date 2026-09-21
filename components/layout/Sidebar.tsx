"use client";

import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import SidebarContent from "./SidebarContent";

type SidebarProps = {
  collapsed: boolean;
  onToggle: () => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
};

export default function Sidebar({
  collapsed,
  onToggle,
  mobileOpen,
  onCloseMobile,
}: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* سطح المكتب */}
      <motion.aside
        animate={{ width: collapsed ? 84 : 272 }}
        transition={{ type: "spring", stiffness: 260, damping: 30 }}
        className="hidden lg:block shrink-0 sticky top-0 h-screen"
      >
        <div className="relative w-full h-full p-3 pl-0">
          <div className="w-full h-full rounded-xl2 shadow-lifted overflow-hidden">
            <SidebarContent
              collapsed={collapsed}
              onToggle={onToggle}
              pathname={pathname}
              onCloseMobile={onCloseMobile}
            />
          </div>

          {/* زر الطي — خارج الحاوية المقصوصة */}
          <button
            onClick={onToggle}
            aria-label={collapsed ? "توسيع القائمة" : "طي القائمة"}
            className="absolute top-[86px] -left-0.5 z-20 w-7 h-7 rounded-full bg-white text-teal-800 shadow-lifted flex items-center justify-center hover:bg-gold-100 transition-colors"
          >
            <motion.span
              animate={{ rotate: collapsed ? 180 : 0 }}
              transition={{ duration: 0.3 }}
              className="block"
            >
              <ChevronLeft className="w-4 h-4" />
            </motion.span>
          </button>
        </div>
      </motion.aside>

      {/* الجوّال — درج منزلق */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onCloseMobile}
              className="lg:hidden fixed inset-0 z-40 bg-teal-950/50 backdrop-blur-sm"
            />
            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 320, damping: 34 }}
              className="lg:hidden fixed top-0 right-0 bottom-0 z-50 w-[280px] shadow-lifted"
            >
              <SidebarContent
                collapsed={false}
                onToggle={onToggle}
                pathname={pathname}
                onCloseMobile={onCloseMobile}
              />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
