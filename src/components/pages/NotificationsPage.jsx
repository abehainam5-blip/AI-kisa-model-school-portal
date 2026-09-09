import React, { useState } from "react";
import { AlertTriangle, Check, FileText, Bell, Trash2, CheckCheck } from "lucide-react";
import { PageHead } from "../common/PageHead";
import { EmptyState } from "../common/EmptyState";
import { useData } from "../../context/DataContext";

export function NotificationsPage() {
  const { notifications, markNotificationRead, markAllNotificationsRead, clearNotification } = useData();
  const [filterType, setFilterType] = useState("all");

  const iconFor = (type) => {
    if (type === "alert") return AlertTriangle;
    if (type === "success") return Check;
    if (type === "report") return FileText;
    return Bell;
  };

  const colorFor = (type) => {
    if (type === "alert") return "var(--danger)";
    if (type === "success") return "var(--success)";
    return "var(--accent)";
  };

  const filtered = notifications.filter((n) => {
    if (filterType === "all") return true;
    return n.type === filterType;
  });

  return (
    <div>
      <PageHead
        title="Notifications & System Alerts"
        sub="Everything that needs your attention across faculty reports, attendance drops, and announcements."
      >
        <button
          className="btn btn-ghost btn-sm"
          onClick={markAllNotificationsRead}
        >
          <CheckCheck size={14} /> Mark all as read
        </button>
      </PageHead>

      <div className="card">
        <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
          {["all", "report", "alert", "success", "info"].map((t) => (
            <button
              key={t}
              className={`btn btn-sm ${filterType === t ? "btn-primary" : "btn-ghost"}`}
              onClick={() => setFilterType(t)}
              style={{ textTransform: "capitalize" }}
            >
              {t === "all" ? "All" : `${t}s`}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <EmptyState
            title="No notifications"
            message="You have cleared or read all alerts in this category."
          />
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {filtered.map((n, i) => {
              const Icon = iconFor(n.type);
              const color = colorFor(n.type);
              return (
                <div
                  key={n.id}
                  onClick={() => markNotificationRead(n.id)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 14,
                    padding: "14px 10px",
                    borderRadius: 12,
                    cursor: "pointer",
                    background: n.read ? "transparent" : "rgba(168,85,247,0.06)",
                    borderBottom: i < filtered.length - 1 ? "1px solid var(--border)" : "none",
                    transition: "background .15s ease"
                  }}
                >
                  <div
                    style={{
                      width: 38,
                      height: 38,
                      borderRadius: 11,
                      background: `${color}1f`,
                      color: color,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0
                    }}
                  >
                    <Icon size={18} />
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div style={{ fontSize: 13.5, fontWeight: 700 }}>{n.title}</div>
                      {!n.read && (
                        <span
                          style={{
                            width: 6,
                            height: 6,
                            borderRadius: "50%",
                            background: "var(--accent)",
                            boxShadow: "0 0 6px var(--accent)"
                          }}
                        />
                      )}
                    </div>
                    <div style={{ fontSize: 12, color: "var(--text-mute)", marginTop: 2 }}>
                      {n.desc}
                    </div>
                  </div>

                  <div style={{ fontSize: 11, color: "var(--text-mute)", whiteSpace: "nowrap", flexShrink: 0 }}>
                    {n.time}
                  </div>

                  <button
                    className="icon-btn"
                    style={{ width: 28, height: 28, borderRadius: 8, flexShrink: 0 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      clearNotification(n.id);
                    }}
                    title="Dismiss alert"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
