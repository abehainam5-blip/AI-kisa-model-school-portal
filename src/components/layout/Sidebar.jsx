import React from "react";
import { LOGO_SRC } from "../../constants/logo";
import { TEACHER_NAV, ADMIN_NAV } from "../../constants/navigation";
import { useAuth } from "../../context/AuthContext";

export function Sidebar({ page, setPage, collapsed, mobileOpen, setMobileOpen }) {
  const { role, currentUser } = useAuth();
  const nav = role === "teacher" ? TEACHER_NAV : ADMIN_NAV;

  const handleNavClick = (key) => {
    setPage(key);
    setMobileOpen(false);
  };

  return (
    <aside
      className={`sidebar ${collapsed ? "collapsed" : ""} ${mobileOpen ? "mobile-open" : ""}`}
      aria-label="Main navigation"
    >
      <div className="sb-brand">
        <div className="sb-logo-wrap">
          <img src={LOGO_SRC || '/favicon.svg'} alt="AI KISA Logo" />
        </div>
        <div className="sb-brand-text">
          <div className="t1">AI KISA Model School</div>
          <div className="t2">
            {role === "teacher" ? "Teacher Portal" : "Super Admin Portal"}
          </div>
        </div>
      </div>

      <nav className="sb-nav">
        {nav.map((item) => {
          const Icon = item.icon;
          const isActive = page === item.key;
          return (
            <div
              key={item.key}
              className={`sb-item ${isActive ? "active" : ""}`}
              onClick={() => handleNavClick(item.key)}
              title={collapsed ? item.label : undefined}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  handleNavClick(item.key);
                }
              }}
            >
              <Icon />
              <span>{item.label}</span>
            </div>
          );
        })}
      </nav>

      <div className="sb-foot">
        <div className="sb-role-pill">
          <span className="dot" />
          <div className="info">
            <b>{currentUser?.name || "User"}</b>
            <span>{currentUser?.roleLabel || "User"}</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
