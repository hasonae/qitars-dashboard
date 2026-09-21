/**
 * تحويل GeoJSON محافظات سوريا (GADM 4.1) إلى مسارات SVG دقيقة
 * - تبسيط Douglas-Peucker للحفاظ على الشكل بأقل عدد نقاط
 * - إسقاط Equirectangular مع تصحيح cos(latitude)
 * الناتج: components/dashboard/syria-paths.ts
 */
import fs from "fs";

const SRC = "scripts/gadm_syria.json";
const OUT = "components/dashboard/syria-paths.ts";
const TOLERANCE = 0.008; // درجة — دقة عالية

const NAME_MAP = {
  "AlḤasakah": ["hasakah", "الحسكة"],
  "Aleppo": ["aleppo", "حلب"],
  "ArRaqqah": ["raqqa", "الرققة"],
  "AsSuwayda'": ["sweida", "السويداء"],
  "Damascus": ["damascus", "دمشق"],
  "Dar`a": ["daraa", "درعا"],
  "DayrAzZawr": ["deirezzor", "دير الزور"],
  "Hamah": ["hama", "حماة"],
  "Hims": ["homs", "حمص"],
  "Idlib": ["idlib", "إدلب"],
  "Lattakia": ["latakia", "اللاذقية"],
  "Quneitra": ["qunaytra", "القنيطرة"],
  "RifDimashq": ["rifdimashq", "ريف دمشق"],
  "Tartus": ["tartus", "طرطوس"],
};

// ── Douglas-Peucker ──────────────────────────────────────────
function perpDist(p, a, b) {
  const dx = b[0] - a[0], dy = b[1] - a[1];
  if (dx === 0 && dy === 0) return Math.hypot(p[0] - a[0], p[1] - a[1]);
  const t = ((p[0] - a[0]) * dx + (p[1] - a[1]) * dy) / (dx * dx + dy * dy);
  const cl = Math.max(0, Math.min(1, t));
  return Math.hypot(p[0] - (a[0] + cl * dx), p[1] - (a[1] + cl * dy));
}

function simplify(points, tol) {
  if (points.length <= 3) return points;
  let maxD = 0, idx = 0;
  const a = points[0], b = points[points.length - 1];
  for (let i = 1; i < points.length - 1; i++) {
    const d = perpDist(points[i], a, b);
    if (d > maxD) { maxD = d; idx = i; }
  }
  if (maxD > tol) {
    const left = simplify(points.slice(0, idx + 1), tol);
    const right = simplify(points.slice(idx), tol);
    return left.slice(0, -1).concat(right);
  }
  return [a, b];
}

// ── مساحة/مركز مضلع (shoelace) ───────────────────────────────
function centroidArea(ring) {
  let a = 0, cx = 0, cy = 0;
  for (let i = 0; i < ring.length - 1; i++) {
    const [x1, y1] = ring[i], [x2, y2] = ring[i + 1];
    const cross = x1 * y2 - x2 * y1;
    a += cross;
    cx += (x1 + x2) * cross;
    cy += (y1 + y2) * cross;
  }
  if (Math.abs(a) < 1e-9) {
    const sx = ring.reduce((s, p) => s + p[0], 0), sy = ring.reduce((s, p) => s + p[1], 0);
    return { area: 0, cx: sx / ring.length, cy: sy / ring.length };
  }
  a /= 2;
  return { area: Math.abs(a), cx: cx / (6 * a), cy: cy / (6 * a) };
}

// ── المعالجة ─────────────────────────────────────────────────
const gj = JSON.parse(fs.readFileSync(SRC, "utf8"));

// أكبر حلقة لكل محافظة
const regions = [];
for (const f of gj.features) {
  const g = f.geometry;
  const name = f.properties.NAME_1;
  let rings = [];
  if (g.type === "Polygon") rings = [g.coordinates[0]];
  else if (g.type === "MultiPolygon") rings = g.coordinates.map((p) => p[0]);
  // أكبر حلقة (المساحة الأصلية بالدرجات)
  let best = null;
  for (const r of rings) {
    const c = centroidArea(r);
    if (!best || c.area > best.area) best = { ring: r, ...c };
  }
  regions.push({ name, ring: best.ring, rawArea: best.area, cx0: best.cx, cy0: best.cy });
}

// الإسقاط والحدود
const cosLat = Math.cos(((36.0) * Math.PI) / 180); // متوسط عرض سوريا
let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
const projected = regions.map((r) => ({
  ...r,
  cx0: r.cx0 * cosLat,
  pts: r.ring.map(([lon, lat]) => [lon * cosLat, lat]),
}));
for (const r of projected)
  for (const [x, y] of r.pts) {
    if (x < minX) minX = x;
    if (x > maxX) maxX = x;
    if (y < minY) minY = y;
    if (y > maxY) maxY = y;
  }

const W = 1000;
const scale = W / (maxX - minX);
const H = Math.round((maxY - minY) * scale);

const toXY = ([x, y]) => [
  Math.round((x - minX) * scale * 10) / 10,
  Math.round((maxY - y) * scale * 10) / 10,
];

// توليد المسارات
const out = [];
let totalPoints = 0;
for (const r of projected) {
  const simp = simplify(r.pts, TOLERANCE);
  totalPoints += simp.length;
  const path =
    simp.map((p, i) => {
      const [x, y] = toXY(p);
      return `${i === 0 ? "M" : "L"}${x},${y}`;
    }).join(" ") + " Z";
  const [cx, cy] = toXY([r.cx0, r.cy0]);
  const [id, ar] = NAME_MAP[r.name];
  out.push({ id, name: ar, path, cx: Math.round(cx), cy: Math.round(cy) });
}

const file = `/**
 * مسارات محافظات سوريا الـ14 — مولّدة آلياً من بيانات GADM 4.1 الحقيقية
 * (scripts/generate-map.mjs) — لا تعدّل يدوياً
 */
export const SYRIA_VIEWBOX = "0 0 ${W} ${H}";

export type SyriaRegionPath = {
  id: string;
  name: string;
  path: string;
  cx: number;
  cy: number;
};

export const SYRIA_REGION_PATHS: SyriaRegionPath[] = [
${out
  .map(
    (r) =>
      `  { id: "${r.id}", name: "${r.name}", cx: ${r.cx}, cy: ${r.cy},\n    path: "${r.path}" },`
  )
  .join("\n")}
];
`;

fs.writeFileSync(OUT, file, "utf8");
console.log(`DONE: ${out.length} regions, ${totalPoints} points, viewBox ${W}x${H}`);
for (const r of out) console.log(`${r.id}: ${r.name} @(${r.cx},${r.cy}) pathLen=${r.path.length}`);
