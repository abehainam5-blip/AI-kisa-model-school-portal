import React, { useState } from "react";
import { Plus, FileText, Eye, Check, X, Clock } from "lucide-react";
import { PageHead } from "../common/PageHead";
import { Modal } from "../common/Modal";
import { EmptyState } from "../common/EmptyState";
import { NewReportModal } from "../modals/NewReportModal";
import { useAuth } from "../../context/AuthContext";
import { useData } from "../../context/DataContext";

export function ReportsPage() {
  const { role, currentUser } = useAuth();
  const { reports } = useData();
  const [statusFilter, setStatusFilter] = useState("all");
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [viewingReport, setViewingReport] = useState(null);

  const displayedReports = reports.filter((r) => {
    const matchesRole = role === "admin" || r.teacher === currentUser?.name || r.teacher === "Ms. Areeba Nadeem";
    const matchesStatus = statusFilter === "all" || r.status.toLowerCase() === statusFilter;
    return matchesRole && matchesStatus;
  });

  return (
    <div>
      <PageHead
        title="Academic Reports"
        sub={
          role === "teacher"
            ? "Reports you have submitted for administrative review and publication."
            : "All academic reports and assessments submitted across the school faculty."
        }
      >
        <button
          className="btn btn-primary btn-sm"
          onClick={() => setIsNewModalOpen(true)}
        >
          <Plus size={14} /> New Report
        </button>
      </PageHead>

      <div className="card">
        {/* Filter bar */}
        <div style={{ display: "flex", gap: 10, marginBottom: 16, alignItems: "center", flexWrap: "wrap" }}>
          <label className="field-label" style={{ margin: 0 }}>Filter Status:</label>
          <select
            className="field-input"
            style={{ width: 140 }}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Reports</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        {displayedReports.length === 0 ? (
          <EmptyState
            title="No reports found"
            message="No academic reports match the selected status filter."
          />
        ) : (
          <div className="scroll-x">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Report Title</th>
                  <th>Faculty Author</th>
                  <th>Class</th>
                  <th>Category</th>
                  <th>Submitted</th>
                  <th>Status</th>
                  <th style={{ textAlign: "right" }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {displayedReports.map((r) => (
                  <tr key={r.id}>
                    <td>
                      <div
                        style={{ fontWeight: 700, cursor: "pointer", color: "var(--text)" }}
                        onClick={() => setViewingReport(r)}
                      >
                        {r.title}
                      </div>
                    </td>
                    <td>{r.teacher}</td>
                    <td>Class {r.class || 9}</td>
                    <td>
                      <span className="chip" style={{ fontSize: 11, padding: "2px 8px" }}>
                        {r.category || "Progress Report"}
                      </span>
                    </td>
                    <td style={{ color: "var(--text-mute)", fontSize: 12 }}>{r.submitted}</td>
                    <td>
                      <span
                        className={`badge ${
                          r.status === "Approved"
                            ? "badge-green"
                            : r.status === "Rejected"
                            ? "badge-red"
                            : "badge-gold"
                        }`}
                      >
                        {r.status === "Approved" ? (
                          <Check size={11} />
                        ) : r.status === "Rejected" ? (
                          <X size={11} />
                        ) : (
                          <Clock size={11} />
                        )}
                        {r.status}
                      </span>
                    </td>
                    <td style={{ textAlign: "right" }}>
                      <button
                        className="icon-btn"
                        style={{ width: 30, height: 30, borderRadius: 8 }}
                        onClick={() => setViewingReport(r)}
                        title="View Report Details"
                      >
                        <Eye size={13} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <NewReportModal
        isOpen={isNewModalOpen}
        onClose={() => setIsNewModalOpen(false)}
      />

      {/* View Details Modal */}
      <Modal
        isOpen={!!viewingReport}
        onClose={() => setViewingReport(null)}
        title="Report Details & Faculty Observations"
        footer={
          <button className="btn btn-primary btn-sm" onClick={() => setViewingReport(null)}>
            Close
          </button>
        }
      >
        {viewingReport && (
          <div>
            <div style={{ fontSize: 17, fontWeight: 800, marginBottom: 4 }}>
              {viewingReport.title}
            </div>
            <div style={{ fontSize: 12, color: "var(--text-mute)", marginBottom: 16 }}>
              Submitted by <b>{viewingReport.teacher}</b> for Class {viewingReport.class || 9} · {viewingReport.submitted}
            </div>

            <div className="grid grid-2" style={{ marginBottom: 16 }}>
              <div className="card card-tight" style={{ background: "var(--surface2)" }}>
                <div style={{ fontSize: 11, color: "var(--text-mute)", fontWeight: 700 }}>Status</div>
                <div style={{ marginTop: 4 }}>
                  <span
                    className={`badge ${
                      viewingReport.status === "Approved"
                        ? "badge-green"
                        : viewingReport.status === "Rejected"
                        ? "badge-red"
                        : "badge-gold"
                    }`}
                  >
                    {viewingReport.status}
                  </span>
                </div>
              </div>
              <div className="card card-tight" style={{ background: "var(--surface2)" }}>
                <div style={{ fontSize: 11, color: "var(--text-mute)", fontWeight: 700 }}>Category</div>
                <div style={{ fontWeight: 700, fontSize: 13, marginTop: 4 }}>
                  {viewingReport.category || "Progress Report"}
                </div>
              </div>
            </div>

            <div style={{ fontSize: 12, fontWeight: 700, color: "var(--text-mute)", marginBottom: 6 }}>
              Report Content & Observations
            </div>
            <div
              style={{
                padding: 14,
                borderRadius: 12,
                background: "var(--surface2)",
                border: "1px solid var(--border)",
                fontSize: 13,
                lineHeight: 1.6,
                color: "var(--text)"
              }}
            >
              {viewingReport.content || "Detailed breakdown of class engagement, assessment marks, and practical submissions."}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
