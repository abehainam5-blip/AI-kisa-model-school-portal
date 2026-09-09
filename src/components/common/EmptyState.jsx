import React from "react";
import { Sparkles } from "lucide-react";

export function EmptyState({ icon: Icon = Sparkles, title = "No records found", message = "Try adjusting your search query or filters.", action }) {
  return (
    <div className="empty-state-box">
      <div className="empty-state-icon">
        <Icon size={26} />
      </div>
      <div style={{ fontWeight: 800, fontSize: 16, marginBottom: 4 }}>{title}</div>
      <div style={{ fontSize: 12.5, color: "var(--text-mute)", maxWidth: 360, marginBottom: action ? 16 : 0, lineHeight: 1.5 }}>
        {message}
      </div>
      {action}
    </div>
  );
}export function EmptyNote({ children }) {
  return (
    <div className="empty-note">
      <Sparkles size={15} />
      <div>{children}</div>
    </div>
  );
}
