import type { Metadata } from "next";
import { Tajawal } from "next/font/google";
import "./globals.css";

const tajawal = Tajawal({
  subsets: ["arabic", "latin"],
  weight: ["300", "400", "500", "700", "800"],
  variable: "--font-tajawal",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Qitars | لوحة التحكم",
  description:
    "لوحة تحكم منظمة Qitars — دعم وتمكين أبناء الطائفة العلوية والشباب في سوريا",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ar" dir="rtl">
      <body className={`${tajawal.variable} font-sans antialiased bg-sand-100 text-ink`}>
        {children}
      </body>
    </html>
  );
}
