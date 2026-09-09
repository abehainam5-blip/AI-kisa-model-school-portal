import React, { useState } from "react";
import { OrbBackground } from "./OrbBackground";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { useTheme } from "../../context/ThemeContext";

export function Shell({ page, setPage, children }) {
  const { theme } = useTheme();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className={`app-root theme-${theme}`}>
      <OrbBackground />

      {/* Mobile backdrop overlay */}
      <div
        className={`mobile-overlay ${mobileOpen ? "show" : ""}`}
        onClick={() => setMobileOpen(false)}
        aria-hidden="true"
      />

      <div className="shell">
        <Sidebar
          page={page}
          setPage={setPage}
          collapsed={collapsed}
          mobileOpen={mobileOpen}
          setMobileOpen={setMobileOpen}
        />

        <div className="main">
          <Topbar
            page={page}
            setPage={setPage}
            collapsed={collapsed}
            setCollapsed={setCollapsed}
            setMobileOpen={setMobileOpen}
          />
          <main className="content">{children}</main>
          <footer className="portal-footer">
            <span>Designed &amp; Developed with <span className="portal-footer-heart" aria-label="love">&#10084;&#65039;</span> by Abeha Inam</span>
            <span className="portal-footer-divider" aria-hidden="true">|</span>
            <span>AI KISA Model School Portal</span>
          </footer>
        </div>
      </div>
    </div>
  );
}
