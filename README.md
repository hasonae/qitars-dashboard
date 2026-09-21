# Qitars | لوحة التحكم

لوحة تحكم عربية حديثة (RTL بالكامل) لمنظمة **Qitars** — دعم وتمكين أبناء الطائفة العلوية والشباب في سوريا.
كل الإحصاءات **تُحسب من السجلات مباشرة** — لا توجد أرقام ثابتة، وأي إضافة أو تعديل أو حذف ينعكس فوراً على كل الشاشات والمخططات.

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) + React 18 + TypeScript |
| Styling | Tailwind CSS 3 (RTL-first, palette خاصة بـ Qitars) |
| Animations | Framer Motion (sidebar `layoutId`, بطاقات متتالية, عدّادات CountUp) |
| Charts | Recharts (area, bar, donut, radar) + خريطة سوريا SVG من حدود GADM الحقيقية |
| Icons | Lucide React |
| Font | Tajawal (Google, عبر `next/font`) |
| Data | مخزن مركزي + حفظ تلقائي في المتصفح (localStorage) |

## تشغيل المشروع

```bash
npm install
npm run dev -- -p 3100
```

ثم افتح <http://localhost:3100>

> ملاحظة: البورت 3000 مشغول على هذا الجهاز بخدمة VPN (`EonVPNRoutingService`) — استخدم 3100.

## بيانات الدخول

| | |
|---|---|
| اسم المستخدم | `admin` |
| كلمة السر | `12345678` |

- تُعدَّل من **الإعدادات ← الحساب وبيانات الدخول** (لا يمكن تغييرها من أي مكان آخر).
- الجلسة محفوظة في `sessionStorage` فقط: إغلاق الموقع يطلب كلمة السر من جديد.
