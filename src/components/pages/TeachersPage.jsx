import React, { useState } from "react";
import { Plus, Star, Circle, Trophy, AlertTriangle, Check } from "lucide-react";
import { PageHead } from "../common/PageHead";
import { Avatar } from "../common/Avatar";
import { AddTeacherModal } from "../modals/AddTeacherModal";
import { useData } from "../../context/DataContext";

export function TeachersPage() {
  const { teachers, students, teacherAnalytics, activeSessions } = useData();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  return (
    <div>
      <PageHead
        title="Faculty Directory"
        sub="Every faculty teacher on staff, their assigned classes, student roster count, and status."
      >
        <button
          className="btn btn-primary btn-sm"
          onClick={() => setIsAddModalOpen(true)}
        >
          <Plus size={14} /> Add Teacher
        </button>
      </PageHead>

      <div className="grid grid-3">
        {teachers.map((t) => {
          const studentCount = students.filter((s) => t.classes.includes(s.class)).length;
          return (
            <div key={t.id} className="card">
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
                <Avatar name={t.name} hue={t.id * 63} size={46} radius={13} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      fontWeight: 800,
                      fontSize: 14,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap"
                    }}
                  >
                    {t.name}
                  </div>
                  <div style={{ fontSize: 11.5, color: "var(--text-mute)" }}>{t.subject}</div>
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 10 }}>
                <span style={{ color: "var(--text-mute)" }}>Assigned Classes</span>
                <span style={{ fontWeight: 700 }}>{t.classes.length ? t.classes.map((c) => `Class ${c}`).join(", ") : "Unassigned"}</span>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 14 }}>
                <span style={{ color: "var(--text-mute)" }}>Active Students</span>
                <span style={{ fontWeight: 700 }}>{studentCount} students</span>
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  paddingTop: 10,
                  borderTop: "1px solid var(--border)"
                }}
              >
                <span className={`badge ${t.status === "Active" ? "badge-green" : "badge-gray"}`}>
                  {t.status}
                </span>
                <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, fontWeight: 700, color: "var(--gold)" }}>
                  <Star size={12} fill="var(--gold)" /> {t.rating || 4.8}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="card" style={{ marginTop: 18 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
          <div><h3 className="section-title">Live Teacher Monitoring</h3><p className="section-sub" style={{ marginBottom: 0 }}>Active portal sessions and weekly class analytics</p></div>
          <span className="badge badge-green"><Circle size={8} fill="currentColor" /> {Object.keys(activeSessions).length} active session(s)</span>
        </div>
        <div className="scroll-x">
          <table className="data-table">
            <thead><tr><th>Teacher</th><th>Session</th><th>Top Student</th><th>Weakest Student</th><th>Weekly Tasks</th></tr></thead>
            <tbody>{teacherAnalytics.map(({ teacher, top, weakest, totalTasks, completedTasks, missedTasks }) => {
              const online = activeSessions[teacher.email];
              return <tr key={teacher.id}><td><b>{teacher.name}</b><div style={{ fontSize: 11, color: "var(--text-mute)" }}>{teacher.email}</div></td><td>{online ? <span className="badge badge-green"><Check size={11} /> Online</span> : <span className="badge badge-gray">Offline</span>}</td><td>{top ? <span><Trophy size={12} color="var(--gold)" /> {top.name} ({top.performance}%)</span> : "—"}</td><td>{weakest ? <span><AlertTriangle size={12} color="var(--danger)" /> {weakest.name} ({weakest.performance}%)</span> : "—"}</td><td>{totalTasks} assigned · <span style={{ color: "var(--success)" }}>{completedTasks} done</span> · <span style={{ color: "var(--danger)" }}>{missedTasks} missed</span></td></tr>;
            })}</tbody>
          </table>
        </div>
      </div>

      <AddTeacherModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />
    </div>
  );
}
