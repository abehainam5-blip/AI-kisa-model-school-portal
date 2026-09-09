import React, { useState } from "react";
import { FileText, ThumbsUp, ThumbsDown, Check, X } from "lucide-react";
import { PageHead } from "../common/PageHead";
import { EmptyState } from "../common/EmptyState";
import { useData } from "../../context/DataContext";

export function ReportApprovalPage() {
  const { reports, updateReportStatus } = useData();
  const [filter, setFilter] = useState("all");

  const displayedReports = reports.filter((r) => {
    if (filter === "all") return true;
    return r.status.toLowerCase() === filter;
  });

  return (
    <div>
      <PageHead
        title="Report Approval Queue"
        sub="Review and approve or reject academic reports submitted by teachers before publishing them to the school portal."
      />

      <div style={{ display: "flex", gap: 8, marginBottom: 18, flexWrap: "wrap" }}>
        {["all", "pending", "approved", "rejected"].map((st) => (
          <button
            key={st}
            className={`btn btn-sm ${filter === st ? "btn-primary" : "btn-ghost"}`}
            onClick={() => setFilter(st)}
            style={{ textTransform: "capitalize" }}
          >
            {st} ({st === "all" ? reports.length : reports.filter((r) => r.status.toLowerCase() === st).length})
          </button>
        ))}
      </div>

      {displayedReports.length === 0 ? (
        <div className="card">
          <EmptyState
            title="No reports in this queue"
            message="There are currently no reports matching this approval filter."
          />
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {displayedReports.map((r) => (
            <div
              key={r.id}
              className="card"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 16,
                flexWrap: "wrap",
                padding: "16px 20px"
              }}
            >
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 12,
                  background: "rgba(168,85,247,0.14)",
                  color: "var(--accent)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0
                }}
              >
                <FileText size={20} />
              </div>

              <div style={{ flex: 1, minWidth: 220 }}>
                <div style={{ fontWeight: 700, fontSize: 14 }}>{r.title}</div>
                <div style={{ fontSize: 12, color: "var(--text-mute)", marginTop: 2 }}>
                  {r.teacher} · Class {r.class || 9} · {r.submitted}
                </div>
                {r.content && (
                  <div style={{ fontSize: 12, color: "var(--text-dim)", marginTop: 4, lineHeight: 1.4 }}>
                    {r.content}
                  </div>
                )}
              </div>

              {r.status === "Pending" ? (
                <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
                  <button
                    className="btn btn-ghost btn-sm"
                    onClick={() => updateReportStatus(r.id, "Rejected")}
                    style={{ color: "var(--danger)" }}
                  >
                    <ThumbsDown size={13} /> Reject
                  </button>
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => updateReportStatus(r.id, "Approved")}
                  >
                    <ThumbsUp size={13} /> Approve
                  </button>
                </div>
              ) : (
                <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
                  <span
                    className={`badge ${
                      r.status === "Approved" ? "badge-green" : "badge-red"
                    }`}
                  >
                    {r.status === "Approved" ? <Check size={11} /> : <X size={11} />}
                    {r.status}
                  </span>
                  <button
                    className="btn btn-ghost btn-sm"
                    style={{ fontSize: 11, padding: "4px 8px" }}
                    onClick={() => updateReportStatus(r.id, "Pending")}
                    title="Move back to Pending"
                  >
                    Re-evaluate
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
