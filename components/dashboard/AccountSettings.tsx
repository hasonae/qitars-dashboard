"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { KeyRound, LogOut, Save, ShieldCheck, User } from "lucide-react";
import { useAuth } from "@/lib/auth";

/** إدارة بيانات الدخول — التعديل متاح من هنا فقط */
export default function AccountSettings() {
  const { auth, setCredentials, logout } = useAuth();
  const [username, setUsername] = useState(auth.username);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [message, setMessage] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  const save = () => {
    if (password.length > 0) {
      if (password.length < 6) {
        setMessage({ type: "err", text: "كلمة السر يجب أن تكون 6 أحرف على الأقل" });
        return;
      }
      if (password !== confirm) {
        setMessage({ type: "err", text: "كلمتا السر غير متطابقتين" });
        return;
      }
    }
    if (username.trim().length < 3) {
      setMessage({ type: "err", text: "اسم المستخدم يجب أن يكون 3 أحرف على الأقل" });
      return;
    }
    setCredentials(username, password || auth.password);
    setPassword("");
    setConfirm("");
    setMessage({ type: "ok", text: "تم حفظ بيانات الدخول بنجاح" });
    setTimeout(() => setMessage(null), 2600);
  };

  return (
    <section
      id="logout"
      className="glass-card card-hover p-5 sm:p-6 lg:col-span-2 scroll-mt-24"
    >
      <div className="flex items-center gap-3 mb-5">
        <div className="w-9 h-9 rounded-lg bg-teal-700/10 text-teal-700 flex items-center justify-center">
          <ShieldCheck className="w-[18px] h-[18px]" strokeWidth={1.9} />
        </div>
        <div>
          <h2 className="widget-title">الحساب وبيانات الدخول</h2>
          <p className="widget-sub mt-0.5">
            تُعدَّل بيانات الدخول من هنا فقط — وهي ثابتة في شاشة تسجيل الدخول
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-bold text-teal-900/70 mb-1.5">
            اسم المستخدم
          </label>
          <div className="flex items-center gap-2.5 rounded-lg border border-teal-900/15 bg-white px-3 py-2 focus-within:ring-2 focus-within:ring-teal-500/30">
            <User className="w-4 h-4 text-teal-700/60 shrink-0" />
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              dir="ltr"
              className="w-full bg-transparent text-sm outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-teal-900/70 mb-1.5">
            كلمة سر جديدة
          </label>
          <div className="flex items-center gap-2.5 rounded-lg border border-teal-900/15 bg-white px-3 py-2 focus-within:ring-2 focus-within:ring-teal-500/30">
            <KeyRound className="w-4 h-4 text-teal-700/60 shrink-0" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="اتركه فارغاً للإبقاء عليها"
              dir="ltr"
              className="w-full bg-transparent text-sm outline-none placeholder:text-teal-900/35"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-teal-900/70 mb-1.5">
            تأكيد كلمة السر
          </label>
          <div className="flex items-center gap-2.5 rounded-lg border border-teal-900/15 bg-white px-3 py-2 focus-within:ring-2 focus-within:ring-teal-500/30">
            <KeyRound className="w-4 h-4 text-teal-700/60 shrink-0" />
            <input
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              disabled={password.length === 0}
              dir="ltr"
              className="w-full bg-transparent text-sm outline-none placeholder:text-teal-900/35 disabled:opacity-40"
            />
          </div>
        </div>
      </div>

      {message && (
        <motion.p
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          className={`mt-4 text-xs font-bold rounded-lg px-3 py-2 ${
            message.type === "ok"
              ? "text-emerald-700 bg-emerald-50"
              : "text-rose-600 bg-rose-50"
          }`}
        >
          {message.text}
        </motion.p>
      )}

      <div className="flex flex-wrap items-center gap-3 mt-5">
        <button
          onClick={save}
          className="flex items-center gap-1.5 rounded-xl bg-teal-700 text-white text-xs font-extrabold px-4 py-2.5 hover:bg-teal-800 transition-colors shadow-soft"
        >
          <Save className="w-4 h-4" />
          حفظ التغييرات
        </button>
        <button
          onClick={logout}
          className="flex items-center gap-1.5 rounded-xl bg-rose-500/10 text-rose-600 text-xs font-extrabold px-4 py-2.5 hover:bg-rose-500 hover:text-white transition-colors"
        >
          <LogOut className="w-4 h-4" />
          تسجيل الخروج
        </button>
      </div>
    </section>
  );
}
