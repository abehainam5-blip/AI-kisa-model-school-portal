import React from "react";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

export function StatCard({ icon: Icon, label, value, trend, trendDir = "up", suffix = "" }) {
  return (
    <div className="card stat-card">
      <div className="stat-top">
        <div className="stat-icon">{Icon && <Icon size={18} />}</div>
        {trend != null && (
          <div className={`stat-trend ${trendDir === "up" ? "trend-up" : "trend-down"}`}>
            {trendDir === "up" ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}
            {trend}
          </div>
        )}
      </div>
      <div className="stat-value">{value}{suffix}</div>
      <div className="stat-label">{label}</div>
    </div>
  );
}
