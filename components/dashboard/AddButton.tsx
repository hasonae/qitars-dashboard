"use client";

import { Plus } from "lucide-react";

/** زر إضافة موحد لكل الأقسام */
export default function AddButton({
  label,
  onClick,
}: {
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-1.5 rounded-xl bg-gold-gradient text-teal-900 text-xs font-extrabold px-3.5 py-2 shadow-soft hover:shadow-lifted hover:-translate-y-0.5 transition-all whitespace-nowrap"
    >
      <Plus className="w-4 h-4" strokeWidth={2.4} />
      {label}
    </button>
  );
}
