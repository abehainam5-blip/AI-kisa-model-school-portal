import React, { useState } from "react";
import { Moon, Sun, Palette, Check, Bell, Globe, Clock, Shield } from "lucide-react";
import { PageHead, SectionHead } from "../common/PageHead";
import { EmptyNote } from "../common/EmptyState";
import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";

export function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const { role, currentUser } = useAuth();
  const { showToast } = useToast();

  const [toggles, setToggles] = useState({
    email: true,
    push: false,
    weekly: true
  });
  const [language, setLanguage] = useState("English");
  const [timeZone, setTimeZone] = useState("Asia/Karachi (PKT)");

  const toggle = (k) => {
    setToggles((p) => {
      const next = { ...p, [k]: !p[k] };
      showToast(`${k.charAt(0).toUpperCase() + k.slice(1)} notification setting updated.`, "info");
      return next;
    });
  };

  const handleSave = (e) => {
    e.preventDefault();
    showToast("Settings & preferences saved successfully!", "success");
  };

  return (
    <div>
      <PageHead
        title={role === "teacher" ? "Teacher Settings" : "System Settings"}
        sub="Manage display theme, notifications preferences, language, and regional portal configurations."
      />

      <div className="grid" style={{ gridTemplateColumns: "1fr 1fr" }}>
        {/* Appearance & Notifications */}
        <div className="card">
          <SectionHead
            title="Appearance & Interface"
            sub="Choose how the portal displays across your devices"
          />

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "12px 0",
              borderBottom: "1px solid var(--border)"
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div className="stat-icon"><Palette size={16} /></div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700 }}>Theme Mode</div>
                <div style={{ fontSize: 11, color: "var(--text-mute)" }}>Dark or Light interface theme</div>
              </div>
            </div>
            <div className="toggle-pill">
              <button
                className={theme === "dark" ? "active" : ""}
                onClick={() => setTheme("dark")}
              >
                <Moon size={12} style={{ marginRight: 5 }} /> Dark
              </button>
              <button
                className={theme === "light" ? "active" : ""}
                onClick={() => setTheme("light")}
              >
                <Sun size={12} style={{ marginRight: 5 }} /> Light
              </button>
            </div>
          </div>

          {[
            { k: "email", label: "Email Notifications", desc: "Receive report approvals, deadlines and reminders" },
            { k: "push", label: "Browser Push Alerts", desc: "Real-time alerts for incoming activity and urgent alerts" },
            { k: "weekly", label: "Weekly Summary Digest", desc: "Summary digest sent to your inbox every Monday" },
          ].map((row) => (
            <div
              key={row.k}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "14px 0",
                borderBottom: "1px solid var(--border)"
              }}
            >
              <div>
                <div style={{ fontSize: 13, fontWeight: 700 }}>{row.label}</div>
                <div style={{ fontSize: 11, color: "var(--text-mute)" }}>{row.desc}</div>
              </div>
              <div
                onClick={() => toggle(row.k)}
                style={{
                  width: 44,
                  height: 24,
                  borderRadius: 20,
                  cursor: "pointer",
                  background: toggles[row.k]
                    ? "linear-gradient(135deg, var(--accent), var(--accent2))"
                    : "var(--surface2)",
                  border: "1px solid var(--border)",
                  position: "relative",
                  transition: "all .2s ease"
                }}
                role="switch"
                aria-checked={toggles[row.k]}
                tabIndex={0}
              >
                <div
                  style={{
                    position: "absolute",
                    top: 2,
                    left: toggles[row.k] ? 22 : 2,
                    width: 18,
                    height: 18,
                    borderRadius: "50%",
                    background: "#fff",
                    boxShadow: "0 1px 4px rgba(0,0,0,0.3)",
                    transition: "all .2s ease"
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Account & Regional Settings */}
        <div className="card">
          <SectionHead title="Account & Regional Localization" sub="Configure system language and timezone" />
          <form onSubmit={handleSave}>
            <div className="field-group">
              <label className="field-label">Active User Account</label>
              <input
                className="field-input"
                value={`${currentUser?.name || "User"} (${currentUser?.email || ""})`}
                disabled
              />
            </div>

            <div className="field-group">
              <label className="field-label">Interface Language</label>
              <select
                className="field-input"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
              >
                <option value="English">English (United States)</option>
                <option value="Urdu">Urdu (اردو)</option>
              </select>
            </div>

            <div className="field-group">
              <label className="field-label">Time Zone</label>
              <select
                className="field-input"
                value={timeZone}
                onChange={(e) => setTimeZone(e.target.value)}
              >
                <option value="Asia/Karachi (PKT)">Asia/Karachi (PKT) — GMT+5:00</option>
                <option value="UTC">UTC (Coordinated Universal Time)</option>
              </select>
            </div>

            <div className="empty-note">
              <Shield size={16} />
              <div>
                Preferences are maintained in frontend storage and update instantly across all views.
              </div>
            </div>

            <button type="submit" className="btn btn-primary btn-sm">
              <Check size={14} /> Save Changes
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
