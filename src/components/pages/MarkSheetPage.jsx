import React, { useState } from "react";
import { FileText, Printer, Award } from "lucide-react";
import { PageHead, SectionHead } from "../common/PageHead";
import { Avatar, initials } from "../common/Avatar";
import { ProgressBar } from "../common/ProgressBar";
import { useData } from "../../context/DataContext";
import { useToast } from "../../context/ToastContext";
import { seededRand } from "../../data/mockData";

export function MarkSheetPage() {
  const { roleStudents } = useData();
  const { showToast } = useToast();
  const [selectedId, setSelectedId] = useState(roleStudents[0]?.id || "");

  const s = roleStudents.find((x) => x.id === selectedId) || roleStudents[0];

  const grade = s
    ? s.performance >= 90
      ? "A+"
      : s.performance >= 80
      ? "A"
      : s.performance >= 70
      ? "B"
      : s.performance >= 60
      ? "C"
      : "D"
    : "-";

  const subjects = s
    ? [
        { name: "English Language & Composition", marks: Math.min(100, s.performance + Math.round(seededRand(s.id * 2) * 10 - 5)) },
        { name: "Digital Media & Visual Design", marks: Math.min(100, s.performance + Math.round(seededRand(s.id * 3) * 10 - 5)) },
        { name: "Presentation & Communication", marks: Math.min(100, s.performance + Math.round(seededRand(s.id * 4) * 10 - 5)) },
        { name: "Discipline & Class Attendance", marks: Math.min(100, s.attendance) },
      ]
    : [];

  const handlePrint = () => {
    showToast("Opening print dialog for official mark sheet...", "info");
    setTimeout(() => {
      window.print();
    }, 400);
  };

  return (
    <div>
      <PageHead
        title="Monthly Mark Sheet"
        sub="Auto-generated student report card summarizing monthly marks, subject proficiency, and teacher evaluation."
      >
        <button className="btn btn-primary btn-sm" onClick={handlePrint}>
          <Printer size={14} /> Print / Export PDF
        </button>
      </PageHead>

      <div className="grid" style={{ gridTemplateColumns: "260px 1fr" }}>
        {/* Left: Students List */}
        <div className="card" style={{ maxHeight: 520, overflowY: "auto" }}>
          <SectionHead title="Students" sub="Select a student to view report" />
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {roleStudents.map((st) => (
              <div
                key={st.id}
                onClick={() => setSelectedId(st.id)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 9,
                  padding: "8px 10px",
                  borderRadius: 10,
                  cursor: "pointer",
                  background: selectedId === st.id ? "rgba(168,85,247,0.14)" : "transparent",
                  border: selectedId === st.id ? "1px solid var(--border-strong)" : "1px solid transparent",
                  transition: "background .15s ease"
                }}
              >
                <Avatar name={st.name} hue={st.avatarHue} size={28} radius={8} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {st.name}
                  </div>
                  <div style={{ fontSize: 10.5, color: "var(--text-mute)" }}>
                    Class {st.class}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Printable Report Card */}
        {s && (
          <div className="card printable-card">
            <div className="profile-hero" style={{ marginBottom: 22 }}>
              <div
                className="profile-avatar"
                style={{ width: 64, height: 64, fontSize: 20, borderRadius: 18 }}
              >
                {initials(s.name)}
              </div>
              <div style={{ flex: 1, minWidth: 200 }}>
                <div style={{ fontWeight: 800, fontSize: 18 }}>{s.name}</div>
                <div style={{ fontSize: 12, color: "var(--text-mute)", marginTop: 2 }}>
                  Class {s.class} · Roll #{s.id} · September 2026 Academic Progress Card
                </div>
              </div>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 11, color: "var(--text-mute)", fontWeight: 700 }}>
                  OVERALL GRADE
                </div>
                <div style={{ fontSize: 32, fontWeight: 800, color: "var(--accent)" }}>
                  {grade}
                </div>
              </div>
            </div>

            <div className="scroll-x" style={{ marginBottom: 20 }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Subject</th>
                    <th>Marks (/100)</th>
                    <th>Grade</th>
                    <th>Evaluation Status</th>
                  </tr>
                </thead>
                <tbody>
                  {subjects.map((sub, i) => (
                    <tr key={i}>
                      <td style={{ fontWeight: 600 }}>{sub.name}</td>
                      <td style={{ minWidth: 150 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <div style={{ width: 100 }}>
                            <ProgressBar value={sub.marks} />
                          </div>
                          <span>{sub.marks}</span>
                        </div>
                      </td>
                      <td>
                        <span className="badge badge-purple">
                          {sub.marks >= 85 ? "A+" : sub.marks >= 75 ? "A" : sub.marks >= 65 ? "B" : "C"}
                        </span>
                      </td>
                      <td>
                        <span className={`badge ${sub.marks >= 70 ? "badge-green" : "badge-gold"}`}>
                          {sub.marks >= 70 ? "Satisfactory" : "Needs Review"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="grid grid-2" style={{ marginBottom: 20 }}>
              <div>
                <div style={{ fontSize: 11.5, color: "var(--text-mute)", fontWeight: 700, marginBottom: 8 }}>
                  Observed Strengths
                </div>
                <div style={{ display: "flex", gap: 7, flexWrap: "wrap" }}>
                  {s.strengths?.map((x, i) => (
                    <span key={i} className="badge badge-green">{x}</span>
                  ))}
                </div>
              </div>
              <div>
                <div style={{ fontSize: 11.5, color: "var(--text-mute)", fontWeight: 700, marginBottom: 8 }}>
                  Focus & Weak Points
                </div>
                <div style={{ display: "flex", gap: 7, flexWrap: "wrap" }}>
                  {s.weakPoints?.map((x, i) => (
                    <span key={i} className="badge badge-red">{x}</span>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <div style={{ fontSize: 11.5, color: "var(--text-mute)", fontWeight: 700, marginBottom: 8 }}>
                Teacher Review Statement
              </div>
              <div
                style={{
                  padding: 14,
                  borderRadius: 12,
                  background: "var(--surface2)",
                  border: "1px solid var(--border)",
                  fontSize: 12.5,
                  lineHeight: 1.6,
                  color: "var(--text-dim)"
                }}
              >
                {s.name.split(" ")[0]} has shown {s.performance >= 80 ? "excellent academic" : "steady and encouraging"} progress throughout this evaluation period with a {s.attendance}% attendance record.
                Continuous attention to {s.weakPoints?.[0]?.toLowerCase() || "consistency"} and practical daily task execution will ensure further growth in the upcoming quarterly assessments.
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
