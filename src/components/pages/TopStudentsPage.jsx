import React, { useState, useMemo } from "react";
import { Award, Star } from "lucide-react";
import { PageHead } from "../common/PageHead";
import { Avatar } from "../common/Avatar";
import { StudentDetailsModal } from "../modals/StudentDetailsModal";
import { useData } from "../../context/DataContext";

export function TopStudentsPage() {
  const { roleStudents } = useData();
  const [classFilter, setClassFilter] = useState("all");
  const [selectedStudent, setSelectedStudent] = useState(null);

  const classes = useMemo(() => {
    return Array.from(new Set(roleStudents.map((s) => s.class))).sort((a, b) => a - b);
  }, [roleStudents]);

  const ranked = useMemo(() => {
    const list = classFilter === "all"
      ? roleStudents
      : roleStudents.filter((s) => s.class === Number(classFilter));
    return [...list].sort((a, b) => b.performance - a.performance);
  }, [roleStudents, classFilter]);

  return (
    <div>
      <PageHead
        title="Top Students"
        sub="Ranked leaderboard by overall academic performance, attendance, and task submission."
      >
        <select
          className="field-input"
          style={{ width: 140 }}
          value={classFilter}
          onChange={(e) => setClassFilter(e.target.value)}
        >
          <option value="all">All Classes</option>
          {classes.map((c) => (
            <option key={c} value={c}>Class {c}</option>
          ))}
        </select>
      </PageHead>

      {/* Top 3 Podium Cards */}
      <div className="grid grid-3" style={{ marginBottom: 18 }}>
        {ranked.slice(0, 3).map((s, i) => (
          <div
            key={s.id}
            className="card"
            style={{
              textAlign: "center",
              cursor: "pointer",
              transition: "transform .15s ease",
              borderColor: i === 0 ? "rgba(245, 185, 66, 0.4)" : "var(--border)"
            }}
            onClick={() => setSelectedStudent(s)}
            title="Click to view full student profile"
          >
            <div
              style={{
                fontSize: 11,
                color: i === 0 ? "var(--gold)" : "var(--text-mute)",
                fontWeight: 800,
                marginBottom: 10,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 4
              }}
            >
              <Award size={13} /> #{i + 1} RANK
            </div>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <Avatar name={s.name} hue={s.avatarHue} size={64} radius={18} />
            </div>
            <div style={{ fontWeight: 800, fontSize: 14.5, marginTop: 10 }}>{s.name}</div>
            <div style={{ fontSize: 11.5, color: "var(--text-mute)", marginBottom: 10 }}>
              Class {s.class} · Roll #{s.id}
            </div>
            <div style={{ fontSize: 24, fontWeight: 800, color: "var(--accent)" }}>
              {s.performance}%
            </div>
          </div>
        ))}
      </div>

      {/* Leaderboard Table */}
      <div className="card">
        <div className="scroll-x">
          <table className="data-table">
            <thead>
              <tr>
                <th>Rank</th>
                <th>Student</th>
                <th>Class</th>
                <th>Performance</th>
                <th>Attendance</th>
                <th>Tasks Completed</th>
              </tr>
            </thead>
            <tbody>
              {ranked.map((s, i) => (
                <tr
                  key={s.id}
                  style={{ cursor: "pointer" }}
                  onClick={() => setSelectedStudent(s)}
                  title="Click to view details"
                >
                  <td>
                    <span
                      style={{
                        fontWeight: 800,
                        color: i < 3 ? "var(--gold)" : "var(--text-dim)"
                      }}
                    >
                      #{i + 1}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <Avatar name={s.name} hue={s.avatarHue} />
                      <b style={{ fontSize: 12.5 }}>{s.name}</b>
                    </div>
                  </td>
                  <td>Class {s.class}</td>
                  <td>
                    <span style={{ fontWeight: 700, color: "var(--accent)" }}>
                      {s.performance}%
                    </span>
                  </td>
                  <td>{s.attendance}%</td>
                  <td>
                    <span className="badge badge-purple">{s.tasksCompleted || 0}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <StudentDetailsModal
        student={selectedStudent}
        isOpen={!!selectedStudent}
        onClose={() => setSelectedStudent(null)}
      />
    </div>
  );
}
