/** @type {import('next').NextConfig} */

// مسار القاعدة للنشر الثابت على GitHub Pages:
// - ينطبق تلقائياً إذا كان STATIC_EXPORT=true (حتى محلياً في npm run export)
// - يستخدم اسم المستودع من GITHUB_REPOSITORY، أو "qitars-dashboard" افتراضياً
const repoName = process.env.GITHUB_REPOSITORY
  ? process.env.GITHUB_REPOSITORY.split("/")[1]  // ex: "hasanae/qitars-dashboard" → "qitars-dashboard"
  : "qitars-dashboard";  // القيمة الافتراضية للمحلي وغير المُعرَّف

const isStaticExport = process.env.STATIC_EXPORT === "true";
const isPagesSubpath = Boolean(repoName) && !repoName.endsWith(".github.io");

// مسار القاعدة الفعلي (فارغ إذا كان النشر على جذر النطاق)
const basePath = isStaticExport && isPagesSubpath ? `/${repoName}` : "";

const nextConfig = {
  reactStrictMode: true,

  // تصدير ثابت كامل (ملفات HTML/CSS/JS فقط) — متوافق مع GitHub Pages
  ...(isStaticExport ? { output: "export" } : {}),

  // basePath و assetPrefix يُطبَّقان دائماً عند STATIC_EXPORT=true
  // بحيث URLs داخل HTML (link/href, script/src, CSS) تأخذ المسار /اسم-المستودع
  ...(basePath
    ? {
        basePath,
        assetPrefix: basePath,
      }
    : {}),

  // ⚠️ مهم: next/image مع unoptimized=true لا يضيف basePath تلقائياً،
  // لذلك نُمرّر القيمة إلى الواجهة لنُدرجها يدوياً عبر lib/assets.ts
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },

  // GitHub Pages لا يدعم محسّن الصور من Next — نستخدم unoptimized دائماً
  images: {
    unoptimized: true,
  },

  // مسارات مجلدية تعمل مباشرة دون سيرفر
  trailingSlash: true,
};

export default nextConfig;
