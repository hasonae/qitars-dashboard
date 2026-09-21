"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Lock, User, LogIn, AlertCircle } from "lucide-react";
import { useAuth } from "@/lib/auth";

/** شاشة الدخول — لوجو المنظمة كخلفية للشاشة، وعلم الطائفة العلوية خلفية لمربع الدخول */
export default function LoginScreen() {
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const ok = login(username, password);
    if (!ok) {
      setError(true);
      setTimeout(() => setError(false), 2200);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-teal-gradient overflow-y-auto">
      <div className="relative min-h-full flex flex-col items-center justify-center gap-6 p-4">
        {/* لوجو المنظمة كخلفية ضخمة شفافة */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <Image
            src="/qitars-logo.png"
            alt=""
            width={900}
            height={900}
            priority
            className="w-[70vmin] h-[70vmin] object-contain opacity-[0.07] select-none"
          />
        </div>
        <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-gold-600/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-teal-400/10 blur-3xl pointer-events-none" />

        {/* بطاقة الدخول */}
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.96 }}
          animate={
            error
              ? { opacity: 1, y: 0, scale: 1, x: [0, -10, 10, -6, 6, 0] }
              : { opacity: 1, y: 0, scale: 1, x: 0 }
          }
          transition={{ duration: error ? 0.45 : 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="relative shrink-0 w-full max-w-sm rounded-xl2 shadow-lifted overflow-hidden bg-white/10 border border-white/20 backdrop-blur-xl"
        >
          <div className="relative p-6 sm:p-7" dir="rtl">
          {/* الشعار */}
          <div className="flex flex-col items-center mb-6">
            <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center shadow-lifted overflow-hidden mb-3">
              <Image
                src="/qitars-logo.png"
                alt="شعار Qitars"
                width={56}
                height={56}
                className="w-12 h-12 object-contain"
                priority
              />
            </div>
            <h1 className="text-2xl font-extrabold text-white tracking-wide">Qitars</h1>
            <p className="text-[11px] text-gold-200/80 font-medium mt-0.5">
              منصة التمكين والنمو
            </p>
          </div>

          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-teal-100/80 mb-1.5">
                اسم المستخدم
              </label>
              <div className="flex items-center gap-2.5 rounded-xl bg-white/10 border border-white/20 backdrop-blur px-3.5 py-2.5 focus-within:ring-2 focus-within:ring-gold-400/50 transition-all">
                <User className="w-4 h-4 text-gold-300 shrink-0" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  autoComplete="username"
                  placeholder="admin"
                  className="w-full bg-transparent text-sm text-white outline-none placeholder:text-teal-100/40"
                  dir="ltr"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-teal-100/80 mb-1.5">
                كلمة السر
              </label>
              <div className="flex items-center gap-2.5 rounded-xl bg-white/10 border border-white/20 backdrop-blur px-3.5 py-2.5 focus-within:ring-2 focus-within:ring-gold-400/50 transition-all">
                <Lock className="w-4 h-4 text-gold-300 shrink-0" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  className="w-full bg-transparent text-sm text-white outline-none placeholder:text-teal-100/40"
                  dir="ltr"
                />
              </div>
            </div>

            <AnimateError show={error} />

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-gold-gradient text-teal-900 text-sm font-extrabold py-3 shadow-lifted hover:shadow-soft hover:-translate-y-0.5 transition-all"
            >
              <LogIn className="w-4 h-4" strokeWidth={2.4} />
              تسجيل الدخول
            </button>
          </form>

          <p className="mt-5 text-center text-[10px] text-teal-100/50 leading-relaxed">
            بيانات الدخول يديرها مدير المنصة من صفحة الإعدادات
          </p>
        </div>
      </motion.div>

      {/* علم الطائفة العلوية + الإهداء */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35, duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
        className="relative shrink-0 w-full max-w-sm flex items-center gap-4 rounded-xl2 bg-white/10 border border-gold-400/30 backdrop-blur-md p-4 shadow-lifted"
        dir="rtl"
      >
        <div className="shrink-0 rounded-2xl p-1.5 bg-gold-gradient shadow-lifted">
          <Image
            src="/alawite-flag.jpg"
            alt="علم الطائفة العلوية"
            width={160}
            height={107}
            priority
            className="w-24 sm:w-28 h-auto rounded-xl object-cover"
          />
        </div>
        <div className="min-w-0">
          <p className="text-[13px] sm:text-sm font-extrabold text-gold-300 leading-snug">
            مع تحيات{" "}
            <span dir="ltr" className="inline-block">
              Abu Sofian EL-BrotherHoody
            </span>
          </p>
          <p className="mt-1.5 text-[11px] text-teal-100/80 leading-relaxed">
            هدية لأبناء جلدتي من الطائفة العلوية
          </p>
        </div>
      </motion.div>
      </div>
    </div>
  );
}

/** رسالة خطأ الدخول */
function AnimateError({ show }: { show: boolean }) {
  if (!show) return null;
  return (
    <motion.p
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="flex items-center gap-1.5 text-[11px] font-bold text-rose-200 bg-rose-500/20 border border-rose-400/30 rounded-lg px-3 py-2"
    >
      <AlertCircle className="w-3.5 h-3.5" />
      اسم المستخدم أو كلمة السر غير صحيحة
    </motion.p>
  );
}
