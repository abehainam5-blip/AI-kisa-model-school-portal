import React from "react";
import { Menu, Search, Sun, Moon, Bell, LogOut } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";
import { useData } from "../../context/DataContext";

export function Topbar({ page, setPage, collapsed, setCollapsed, setMobileOpen }) {
  const { theme, toggleTheme } = useTheme();
  const { currentUser, logout } = useAuth();
  const { notifications, globalSearch, setGlobalSearch } = useData();

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <header className="topbar">
      {/* Mobile drawer toggle */}
      <button
        className="icon-btn mobile-menu-btn"
        onClick={() => setMobileOpen(true)}
        aria-label="Open mobile navigation"
      >
        <Menu size={18} />
      </button>

      {/* Desktop sidebar collapse */}
      <button
        className="icon-btn desktop-collapse-btn"
        onClick={() => setCollapsed((c) => !c)}
        title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        aria-label="Toggle sidebar width"
      >
        <Menu size={18} />
      </button>

      {/* Real-time search */}
      <div className="search-wrap">
        <Search size={15} />
        <input
          placeholder="Search students, tasks, reports…"
          value={globalSearch}
          onChange={(e) => setGlobalSearch(e.target.value)}
          aria-label="Search"
        />
        {globalSearch && (
          <button
            onClick={() => setGlobalSearch("")}
            style={{ background: "none", border: "none", color: "var(--text-mute)", cursor: "pointer", fontSize: 11 }}
          >
            Clear
          </button>
        )}
      </div>

      <div className="topbar-right">
        {/* Theme Toggle */}
        <button
          className="icon-btn"
          onClick={toggleTheme}
          title={`Switch to ${theme === "dark" ? "Light" : "Dark"} Mode`}
          aria-label="Toggle color theme"
        >
          {theme === "dark" ? <Sun size={17} /> : <Moon size={17} />}
        </button>

        {/* Notifications Icon with Unread Counter */}
        <button
          className="icon-btn"
          style={{ position: "relative" }}
          onClick={() => setPage("notifications")}
          title="View Notifications"
          aria-label="Notifications"
        >
          <Bell size={17} />
          {unreadCount > 0 && (
            <span
              style={{
                position: "absolute",
                top: 6,
                right: 6,
                width: 7,
                height: 7,
                borderRadius: "50%",
                background: "var(--danger)",
                boxShadow: "0 0 6px var(--danger)"
              }}
            />
          )}
        </button>

        {/* User Chip */}
        <div
          className="avatar-chip"
          onClick={() => setPage("profile")}
          title="View Profile"
          role="button"
          tabIndex={0}
        >
          <div className="avatar-circle">{currentUser?.initials || "U"}</div>
          <div>
            <b>{currentUser?.name || "User"}</b>
            <span>{currentUser?.roleLabel || "User"}</span>
          </div>
        </div>

        {/* Logout */}
        <button
          className="icon-btn"
          onClick={logout}
          title="Sign out of portal"
          aria-label="Sign out"
        >
          <LogOut size={16} />
        </button>
      </div>
    </header>
  );
}
