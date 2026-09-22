"use client";

import type { ReactNode } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { AuthProvider, useAuth } from "@/lib/auth";
import { assetUrl } from "@/lib/assets";
import LoginScreen from "./LoginScreen";

/** يحمي كل صفحات الداشبورد: يعرض شاشة الدخول قبل تسجيل الدخول */
export default function AuthGate({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <Gate>{children}</Gate>
    </AuthProvider>
  );
}

function Gate({ children }: { children: ReactNode }) {
  const { auth, ready } = useAuth();

  // شاشة انتقالية أثناء قراءة الجلسة (منع الوميض)
  if (!ready) {
    return (
      <div className="fixed inset-0 z-[100] bg-teal-gradient flex items-center justify-center">
        <motion.div
          animate={{ scale: [0.9, 1.05, 0.9], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          className="w-20 h-20 rounded-2xl bg-white flex items-center justify-center shadow-lifted overflow-hidden"
        >
          <Image
            src={assetUrl("/qitars-logo.png")}
            alt="Qitars"
            width={64}
            height={64}
            className="w-14 h-14 object-contain"
            priority
          />
        </motion.div>
      </div>
    );
  }

  if (!auth.loggedIn) return <LoginScreen />;

  return <>{children}</>;
}
