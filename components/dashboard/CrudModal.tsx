"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";

export type Field = {
  key: string;
  label: string;
  type: "text" | "number" | "date" | "select";
  options?: string[];
  required?: boolean;
  min?: number;
  max?: number;
};

type Values = Record<string, string | number>;

type Props = {
  open: boolean;
  title: string;
  fields: Field[];
  initial?: Record<string, unknown> | null;
  onClose: () => void;
  onSubmit: (values: Values) => void;
};

/** نافذة منبثقة موحدة للإضافة/التعديل مع تحقق من الحقول المطلوبة */
export default function CrudModal({ open, title, fields, initial, onClose, onSubmit }: Props) {
  const [values, setValues] = useState<Values>({});
  const [error, setError] = useState("");

  useEffect(() => {
    if (open) {
      const v: Values = {};
      for (const f of fields) {
        const raw = initial?.[f.key];
        v[f.key] =
          raw !== undefined && raw !== null
            ? (raw as string | number)
            : f.type === "number"
              ? ""
              : f.type === "select"
                ? (f.options?.[0] ?? "")
                : "";
      }
      setValues(v);
      setError("");
    }
  }, [open, initial, fields]);

  const submit = () => {
    for (const f of fields) {
      if (f.required && (values[f.key] === "" || values[f.key] === undefined || values[f.key] === null)) {
        setError(`الحقل "${f.label}" مطلوب`);
        return;
      }
      if (f.type === "number") {
        const n = Number(values[f.key]);
        if (Number.isNaN(n)) {
          setError(`الحقل "${f.label}" يجب أن يكون رقماً`);
          return;
        }
        if (f.min !== undefined && n < f.min) {
          setError(`الحقل "${f.label}" يجب أن يكون ${f.min} أو أكثر`);
          return;
        }
        if (f.max !== undefined && n > f.max) {
          setError(`الحقل "${f.label}" يجب أن يكون ${f.max} أو أقل`);
          return;
        }
      }
    }
    setError("");
    onSubmit(values);
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[60] bg-teal-950/50 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 320, damping: 30 }}
            className="fixed z-[70] top-1/2 right-1/2 translate-x-1/2 -translate-y-1/2 w-[calc(100vw-2rem)] max-w-md"
          >
            <div className="glass-card shadow-lifted p-5 sm:p-6 bg-white/90" dir="rtl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-extrabold text-teal-900">{title}</h3>
                <button
                  onClick={onClose}
                  aria-label="إغلاق"
                  className="w-8 h-8 rounded-lg bg-teal-700/10 text-teal-700 flex items-center justify-center hover:bg-teal-700/20 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3.5 max-h-[60vh] overflow-y-auto pl-1">
                {fields.map((f) => (
                  <div key={f.key}>
                    <label className="block text-xs font-bold text-teal-900/70 mb-1.5">
                      {f.label}
                      {f.required && <span className="text-rose-500"> *</span>}
                    </label>
                    {f.type === "select" ? (
                      <select
                        value={String(values[f.key] ?? "")}
                        onChange={(e) => setValues((v) => ({ ...v, [f.key]: e.target.value }))}
                        className="w-full rounded-lg border border-teal-900/15 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-teal-500/30"
                      >
                        {f.options?.map((o) => (
                          <option key={o} value={o}>
                            {o}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type={f.type}
                        value={String(values[f.key] ?? "")}
                        min={f.min}
                        max={f.max}
                        onChange={(e) => setValues((v) => ({ ...v, [f.key]: e.target.value }))}
                        className="w-full rounded-lg border border-teal-900/15 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-teal-500/30"
                      />
                    )}
                  </div>
                ))}
              </div>

              {error && (
                <p className="mt-3 text-xs font-bold text-rose-600 bg-rose-50 rounded-lg px-3 py-2">{error}</p>
              )}

              <div className="flex gap-3 mt-5">
                <button
                  onClick={submit}
                  className="flex-1 rounded-xl bg-teal-700 text-white text-sm font-bold py-2.5 hover:bg-teal-800 transition-colors shadow-soft"
                >
                  حفظ
                </button>
                <button
                  onClick={onClose}
                  className="flex-1 rounded-xl bg-teal-700/10 text-teal-800 text-sm font-bold py-2.5 hover:bg-teal-700/20 transition-colors"
                >
                  إلغاء
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
