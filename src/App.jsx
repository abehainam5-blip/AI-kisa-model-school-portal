import React, { useState, useEffect } from "react";
import { Shell } from "./components/layout/Shell";
import { OrbBackground } from "./components/layout/OrbBackground";
import { LoginPage } from "./components/pages/LoginPage";
import { DashboardPage } from "./components/pages/DashboardPage";
import { StudentsPage } from "./components/pages/StudentsPage";
import { DailyTasksPage } from "./components/pages/DailyTasksPage";
import { AttendancePage } from "./components/pages/AttendancePage";
import { PerformancePage } from "./components/pages/PerformancePage";
import { ReportsPage } from "./components/pages/ReportsPage";
import { ReportApprovalPage } from "./components/pages/ReportApprovalPage";
import { WeakPointsPage } from "./components/pages/WeakPointsPage";
import { TopStudentsPage } from "./components/pages/TopStudentsPage";
import { MarkSheetPage } from "./components/pages/MarkSheetPage";
import { CalendarPage } from "./components/pages/CalendarPage";
import { SettingsPage } from "./components/pages/SettingsPage";
import { HowToUsePage } from "./components/pages/HowToUsePage";
import { ProfilePage } from "./components/pages/ProfilePage";
import { TeachersPage } from "./components/pages/TeachersPage";
import { ClassesPage } from "./components/pages/ClassesPage";
import { AnalyticsPage } from "./components/pages/AnalyticsPage";
import { NotificationsPage } from "./components/pages/NotificationsPage";
import { AuditLogsPage } from "./components/pages/AuditLogsPage";
import { ThemeProvider, useTheme } from "./context/ThemeContext";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { ToastProvider } from "./context/ToastContext";
import { DataProvider } from "./context/DataContext";
import { Sun, Moon } from "lucide-react";

function MainRouter() {
  const { role } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [page, setPage] = useState("dashboard");

  // Reset to dashboard when role switches
  useEffect(() => {
    setPage("dashboard");
  }, [role]);

  // If not authenticated, render Login view with orbs and theme toggle
  if (!role) {
    return (
      <div className={`app-root theme-${theme}`}>
        <OrbBackground />
        <div style={{ position: "fixed", top: 18, right: 18, zIndex: 10 }}>
          <button
            className="icon-btn"
            onClick={toggleTheme}
            title={`Switch to ${theme === "dark" ? "Light" : "Dark"} Mode`}
            aria-label="Toggle Theme"
          >
            {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
          </button>
        </div>
        <LoginPage />
      </div>
    );
  }

  const renderPage = () => {
    if (role === "teacher") {
      switch (page) {
        case "dashboard":
          return <DashboardPage setPage={setPage} />;
        case "students":
          return <StudentsPage />;
        case "tasks":
          return <DailyTasksPage />;
        case "attendance":
          return <AttendancePage />;
        case "performance":
          return <PerformancePage />;
        case "reports":
          return <ReportsPage />;
        case "weak":
          return <WeakPointsPage />;
        case "top":
          return <TopStudentsPage />;
        case "marksheet":
          return <MarkSheetPage />;
        case "calendar":
          return <CalendarPage />;
        case "settings":
          return <SettingsPage />;
        case "how":
          return <HowToUsePage />;
        case "profile":
          return <ProfilePage />;
        default:
          return <DashboardPage setPage={setPage} />;
      }
    } else if (role === 'super_admin') {
      // Super Admin Portal
      switch (page) {
        case "dashboard":
          return <DashboardPage setPage={setPage} />;
        case "teachers":
          return <TeachersPage />;
        case "students":
          return <StudentsPage />;
        case "classes":
          return <ClassesPage />;
        case "reports":
          return <ReportsPage />;
        case "approval":
          return <ReportApprovalPage />;
        case "analytics":
          return <AnalyticsPage />;
        case "weakAnalytics":
          return <WeakPointsPage />;
        case "top":
          return <TopStudentsPage />;
        case "marksheets":
          return <MarkSheetPage />;
        case "calendar":
          return <CalendarPage />;
        case "notifications":
          return <NotificationsPage />;
        case "audit":
          return <AuditLogsPage />;
        case "settings":
          return <SettingsPage />;
        case "how":
          return <HowToUsePage />;
        case "profile":
          return <ProfilePage />;
        default:
          return <DashboardPage setPage={setPage} />;
      }
    } else {
      // Unknown role or fallback — deny access to protected pages
      return (
        <div className="card">
          <h3>Access Denied</h3>
          <p>You do not have permission to access this portal.</p>
        </div>
      );
    }
  };

  return (
    <Shell page={page} setPage={setPage}>
      {renderPage()}
    </Shell>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ToastProvider>
          <DataProvider>
            <MainRouter />
          </DataProvider>
        </ToastProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
