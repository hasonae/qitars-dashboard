# 🚀 نشر المنصة على GitHub Pages

المنصة تعمل بالكامل من جهة العميل (تسجيل الدخول، البيانات، تصدير Excel) — لذلك تُنشر كـ**تصدير ثابت** (`output: "export"`) وتعمل على GitHub Pages دون أي سيرفر.

## الطريقة الموصى بها: GitHub Actions (تلقائي بالكامل)

### الخطوة 1 — ارفع المشروع إلى GitHub
```bash
git init
git add .
git commit -m "Qitars Dashboard"
git branch -M main
git remote add origin https://github.com/اسم-حسابك/qitars-dashboard.git
git push -u origin main
```

### الخطوة 2 — فعّل GitHub Pages من إعدادات المستودع
1. افتح المستودع على GitHub → **Settings** → **Pages**
2. تحت **Build and deployment** → **Source** اختر: **GitHub Actions**
3. انتهى! الـ workflow المرفق (`.github/workflows/deploy.yml`) سيعمل تلقائياً عند كل `push` إلى `main`
4. بعد دقيقة أو دقيقتين سيظهر رابط موقعك في نفس الصفحة:
   `https://اسم-حسابك.github.io/qitars-dashboard/`

> المسار الفرعي `/qitars-dashboard` يُضبط **تلقائياً** — الـ workflow يمرر اسم المستودع و`next.config.mjs` يبني `basePath` منه.

## الطريقة البديلة: التصدير يدوياً ونشره من فرع gh-pages

```bash
npm run build:pages      # يبني التصدير الثابت مع basePath الصحيح إلى مجلد out/
npm run deploy           # يرفع مجلد out/ إلى فرع gh-pages
```
ثم في **Settings → Pages**: اختر Source = **Deploy from a branch** → Branch = `gh-pages` → `/ (root)` → Save.

> تحتاج أولاً `npm install -D gh-pages` (واحذف مجلد `out/` من `.gitignore` عند استخدام هذه الطريقة).

## حدود وملاحظات مهمة (طبيعة GitHub Pages الثابتة)

| البند | الوضع |
|---|---|
| البيانات | تُحفظ في **متصفح كل مستخدم** (`localStorage`) — لا قاعدة بيانات مشتركة |
| تسجيل الدخول | حماية واجهة فقط (`admin` / `12345678` قابلة للتغيير من الإعدادات) — ليست حماية سيرفر حقيقية |
| بيانات الدخول المحفوظة | أيضاً في متصفح كل مستخدم، أي أن كل جهاز لديه مستقله |
| المشاركة بين المشرفين | تتطلب خادم/قاعدة بيانات (مثل Supabase) — البنية جاهزة للترقية |
| تغيير اسم المستودع | إذا نُشر على `USER.github.io` (مستودع اسمه مطابق لاسم الحساب) يعمل على الجذر دون basePath |

## تحديث الموقع بعد أي تعديل
```bash
git add . && git commit -m "تحديث" && git push
```
— والنشر يتم تلقائياً.
