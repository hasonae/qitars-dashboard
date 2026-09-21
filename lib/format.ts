/** تنسيق موحّد بأرقام لاتينية (1,234) في كل المنصة */
export const formatNumber = (n: number): string =>
  new Intl.NumberFormat("en-US").format(n);

/** تنسيق مضغوط للأرقام الكبيرة داخل البطاقات (99.4M / 1.2K) */
export const formatCompact = (n: number): string => {
  const abs = Math.abs(n);
  if (abs >= 1_000_000) {
    const m = n / 1_000_000;
    return `${m % 1 === 0 ? m.toFixed(0) : m.toFixed(1)}M`;
  }
  if (abs >= 10_000) {
    const k = n / 1_000;
    return `${k % 1 === 0 ? k.toFixed(0) : k.toFixed(1)}K`;
  }
  return new Intl.NumberFormat("en-US").format(n);
};

export const formatCurrency = (n: number): string =>
  `${new Intl.NumberFormat("en-US").format(n)} ل.س`;

export const formatPercent = (n: number, fractionDigits = 1): string =>
  `${n.toFixed(fractionDigits)}٪`;

export const formatHours = (n: number): string =>
  `${new Intl.NumberFormat("en-US").format(n)} ساعة`;

/** تاريخ اليوم بأسماء عربية وأرقام لاتينية (مثال: الأحد 20 أيلول 2026) */
export const formatToday = (): string =>
  new Intl.DateTimeFormat("ar-SY-u-nu-latn", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date());

/** "قبل 5 دقائق" تقريبي — للفيد */
export const timeAgo = (minutes: number): string => {
  if (minutes < 60) return `قبل ${formatNumber(minutes)} دقيقة`;
  const h = Math.floor(minutes / 60);
  if (h < 24) return `قبل ${formatNumber(h)} ساعة`;
  return `قبل ${formatNumber(Math.floor(h / 24))} يوم`;
};
