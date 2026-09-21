import {
  LayoutDashboard,
  Users,
  GraduationCap,
  MapPin,
  HeartHandshake,
  Wallet,
  Briefcase,
  Sprout,
} from "lucide-react";

export const navItems = [
  { label: "الرئيسية", icon: LayoutDashboard, href: "/" },
  { label: "المتطوعون", icon: Users, href: "/volunteers" },
  { label: "الطلاب", icon: GraduationCap, href: "/students" },
  { label: "المواقع والتوزيع", icon: MapPin, href: "/locations" },
  { label: "التبرعات", icon: HeartHandshake, href: "/donations" },
  { label: "المصاريف", icon: Wallet, href: "/expenses" },
  { label: "أنواع الأعمال", icon: Briefcase, href: "/jobs" },
  { label: "الاستثمارات", icon: Sprout, href: "/investments" },
];
