/** @type {import('next').NextConfig} */

// مسار القاعدة للنشر الثابت على GitHub Pages:
// - عند النشر على مستودع باسم https://github.com/USER/qitars-dashboard
//   يصبح الموقع على https://USER.github.io/qitars-dashboard ← يجب تعيين GITHUB_PAGES=true
// - للنشر على مستودع باسم USER.github.io (الموقع على الجذر) أو دومين مخصص:
//   لا حاجة لأي متغير إضافي
const isGH =
  process.env.GITHUB_PAGES === "true" ||
  process.env.GITHUB_REPOSITORY !== undefined; // يُعرَّف تلقائياً داخل GitHub Actions
const repoName = process.env.GITHUB_REPOSITORY
  ? process.env.GITHUB_REPOSITORY.split("/")[1]
  : "";

const nextConfig = {
  reactStrictMode: true,
  // تصدير ثابت كامل (ملفات HTML/CSS/JS فقط) — متوافق مع GitHub Pages
  ...(process.env.STATIC_EXPORT === "true" ? { output: "export" } : {}),
  // basePath فقط عندما يكون النشر تحت مسار فرعي /اسم-المستودع
  ...(isGH && repoName && !repoName.endsWith(".github.io")
    ? { basePath: `/${repoName}`, assetPrefix: `/${repoName}` }
    : {}),
  images: {
    // GitHub Pages لا يدعم محسّن الصور من Next — نستخدم unoptimized دائماً
    unoptimized: true,
  },
  trailingSlash: true, // مسارات مجلدية تعمل مباشرة دون سيرفر
};

export default nextConfig;
