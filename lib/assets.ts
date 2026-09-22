/**
 * مساعد مسارات الأصول (الصور والملفات في مجلد public)
 * ─────────────────────────────────────────────────────
 * السبب: Next.js يُطبِّق `basePath` تلقائياً على:
 *   • ملفات _next  (عبر assetPrefix)
 *   • روابط next/link
 * لكنه **لا** يُطبِّقه على صور `next/image` عند تفعيل `unoptimized: true`
 * (وهو إلزامي في التصدير الثابت)، ولا على وسوم <img> اليدوية.
 *
 * النتيجة بدون هذا المساعد: في GitHub Pages تُطلب الصورة من
 *   https://user.github.io/qitars-logo.png   ← 404
 * بدلاً من
 *   https://user.github.io/qitars-dashboard/qitars-logo.png  ✓
 *
 * القيمة تُحقَن وقت البناء من next.config.mjs عبر env.NEXT_PUBLIC_BASE_PATH
 * وتكون فارغة "" في التطوير المحلي وعلى النطاقات الجذرية.
 */

export const BASE_PATH: string = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

/**
 * يُعيد المسار الصحيح لأي ملف في مجلد public مع مراعاة basePath.
 * @example assetUrl("/qitars-logo.png") → "/qitars-dashboard/qitars-logo.png"
 */
export function assetUrl(path: string): string {
  // الروابط الخارجية أو البيانات المضمّنة تُترك كما هي
  if (!path.startsWith("/")) return path;
  return `${BASE_PATH}${path}`;
}
