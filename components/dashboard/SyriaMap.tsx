"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SYRIA_REGION_PATHS, SYRIA_VIEWBOX } from "./syria-paths";
import type { RegionData } from "@/lib/data";
import { formatNumber } from "@/lib/format";

/**
 * خريطة سوريا التفاعلية — المحافظات الـ14
 * الحدود الحقيقية (بيانات GADM 4.1) والأرقام تصل من السجلات مباشرة.
 */

type Props = {
  regions: RegionData[];
  onRegionChange?: (region: RegionData | null) => void;
};

const FILL_COLORS: Record<string, string> = {
  aleppo: "#2d8f8e",
  idlib: "#4aacaa",
  latakia: "#1e7474",
  tartus: "#145757",
  hama: "#7ccbc2",
  homs: "#2d8f8e",
  damascus: "#145757",
  rifdimashq: "#1e7474",
  daraa: "#4aacaa",
  qunaytra: "#7ccbc2",
  sweida: "#1e7474",
  deirezzor: "#4aacaa",
  raqqa: "#2d8f8e",
  hasakah: "#1e7474",
};

export default function SyriaMap({ regions, onRegionChange }: Props) {
  const [hovered, setHovered] = useState<string | null>(null);
  const [selected, setSelected] = useState<string>("damascus");

  const activeId = hovered ?? selected;
  const activeRegion = regions.find((r) => r.id === activeId) ?? null;

  const notify = (id: string) =>
    onRegionChange?.(regions.find((r) => r.id === id) ?? null);

  return (
    <div className="relative flex flex-col md:flex-row items-center gap-4 w-full">
      {/* الخريطة */}
      <div className="w-full md:w-3/5 max-w-md">
        <svg
          viewBox={SYRIA_VIEWBOX}
          className="w-full select-none"
          role="img"
          aria-label="خريطة سوريا — التقسيم الإداري للمحافظات الـ14"
        >
          <defs>
            <filter id="mapShadow" x="-10%" y="-10%" width="120%" height="120%">
              <feDropShadow dx="0" dy="6" stdDeviation="8" floodColor="#0c3737" floodOpacity="0.25" />
            </filter>
          </defs>

          {/* المحافظات الـ14 */}
          {SYRIA_REGION_PATHS.map((region, i) => {
            const isActive = region.id === activeId;
            const isSelected = region.id === selected;
            const hasData =
              (regions.find((r) => r.id === region.id)?.beneficiaries ?? 0) > 0;
            return (
              <motion.path
                key={region.id}
                d={region.path}
                fill={isActive ? "#145757" : FILL_COLORS[region.id] ?? "#2d8f8e"}
                fillOpacity={isActive ? 0.95 : hasData ? 0.75 : 0.3}
                stroke={isSelected ? "#c9a227" : "#ffffff"}
                strokeWidth={isSelected ? 4 : 1.5}
                strokeLinejoin="round"
                className="cursor-pointer"
                style={{ filter: "url(#mapShadow)", transition: "fill 0.15s ease" }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: i * 0.03 }}
                onMouseEnter={() => {
                  setHovered(region.id);
                  notify(region.id);
                }}
                onMouseLeave={() => {
                  setHovered(null);
                  notify(selected);
                }}
                onClick={() => {
                  setSelected(region.id);
                  notify(region.id);
                }}
              />
            );
          })}


          {/* تسميات المحافظات */}
          {SYRIA_REGION_PATHS.map((region) => (
            <text
              key={`label-${region.id}`}
              x={region.cx}
              y={region.cy}
              textAnchor="middle"
              className="pointer-events-none"
              style={{
                fontSize: region.id === activeId ? 17 : 14,
                fontWeight: 700,
                fill: region.id === activeId ? "#eec873" : "#ffffff",
                stroke: "#0c3737",
                strokeWidth: 2.4,
                paintOrder: "stroke",
                fontFamily: "var(--font-tajawal), sans-serif",
                transition: "font-size 0.15s ease",
              }}
            >
              {region.name}
            </text>
          ))}
        </svg>

        {/* بوصلة وتذييل الخريطة */}
        <div className="flex items-center justify-between mt-1 px-1">
          <span className="text-[10px] font-medium text-teal-900/50">
            الحدود الإدارية: GADM · المحافظات الـ14
          </span>
          <span className="flex items-center gap-1 text-[10px] text-teal-900/50">
            <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2 L15 12 L12 10 L9 12 Z" fill="#c9a227" stroke="none" />
            </svg>
            شمال
          </span>
        </div>
      </div>

      {/* لوحة تفاصيل المحافظة النشطة */}
      <div className="w-full md:w-2/5 min-h-[150px]">
        <AnimatePresence mode="wait">
          {activeRegion && (
            <motion.div
              key={activeRegion.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.22 }}
              className="rounded-xl bg-teal-gradient text-white p-4 shadow-lifted"
            >
              <div className="flex items-center justify-between mb-3">
                <p className="font-extrabold text-sm">{activeRegion.name}</p>
                <span className="text-[10px] bg-white/15 rounded-full px-2 py-0.5">
                  {formatNumber(activeRegion.projects)} مشاريع
                </span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-[10px] text-teal-100/70">المستفيدون</p>
                  <p className="text-xl font-extrabold text-gold-300">
                    {formatNumber(activeRegion.beneficiaries)}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] text-teal-100/70">المتطوعون</p>
                  <p className="text-xl font-extrabold text-gold-300">
                    {formatNumber(activeRegion.volunteers)}
                  </p>
                </div>
              </div>
              <p className="mt-3 text-[10px] text-teal-100/60 leading-relaxed">
                اضغط على أي محافظة من المحافظات الـ14 لعرض توزيعها
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
