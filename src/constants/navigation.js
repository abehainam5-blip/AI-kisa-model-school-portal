import {
  LayoutDashboard, Users, ClipboardList, CalendarCheck, TrendingUp, FileText,
  AlertTriangle, Award, FileSpreadsheet, Calendar as CalendarIcon, Settings,
  HelpCircle, User, GraduationCap, Layers, Bell, ShieldCheck, BarChart3,
  ClipboardCheck
} from "lucide-react";

export const TEACHER_NAV = [
  { key: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { key: "students", label: "Students", icon: Users },
  { key: "tasks", label: "Daily Tasks", icon: ClipboardList },
  { key: "attendance", label: "Attendance", icon: CalendarCheck },
  { key: "performance", label: "Performance", icon: TrendingUp },
  { key: "reports", label: "Reports", icon: FileText },
  { key: "weak", label: "Weak Points", icon: AlertTriangle },
  { key: "top", label: "Top Students", icon: Award },
  { key: "marksheet", label: "Mark Sheet", icon: FileSpreadsheet },
  { key: "calendar", label: "Calendar", icon: CalendarIcon },
  { key: "settings", label: "Teacher Settings", icon: Settings },
  { key: "how", label: "How to Use", icon: HelpCircle },
  { key: "profile", label: "Profile", icon: User },
];

export const ADMIN_NAV = [
  { key: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { key: "teachers", label: "Teachers", icon: GraduationCap },
  { key: "students", label: "Students", icon: Users },
  { key: "classes", label: "Classes", icon: Layers },
  { key: "reports", label: "Reports", icon: FileText },
  { key: "approval", label: "Report Approval", icon: ClipboardCheck },
  { key: "analytics", label: "Performance Analytics", icon: BarChart3 },
  { key: "weakAnalytics", label: "Weak Point Analytics", icon: AlertTriangle },
  { key: "top", label: "Top Students", icon: Award },
  { key: "marksheets", label: "Mark Sheets", icon: FileSpreadsheet },
  { key: "calendar", label: "Calendar", icon: CalendarIcon },
  { key: "notifications", label: "Notifications", icon: Bell },
  { key: "audit", label: "Audit Logs", icon: ShieldCheck },
  { key: "settings", label: "Settings", icon: Settings },
  { key: "how", label: "How to Use", icon: HelpCircle },
  { key: "profile", label: "Profile", icon: User },
];

export const CLASS_NUMS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
export const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
export const TEACHER_NAME = "Ms. Areeba Nadeem";
export const TEACHER_CLASSES = [8, 9];
