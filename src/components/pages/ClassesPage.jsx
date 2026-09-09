import React, { useState } from "react";
import { PageHead, SectionHead } from "../common/PageHead";
import { Avatar } from "../common/Avatar";
import { ProgressBar } from "../common/ProgressBar";
import { StudentDetailsModal } from "../modals/StudentDetailsModal";
import { useData } from "../../context/DataContext";
import { CLASS_NUMS } from "../../constants/navigation";

export function ClassesPage() {
  const { students, teachers } = useData();
  const [selectedClass, setSelectedClass] = useState(1);
  const [selectedStudent, setSelectedStudent] = useState(null);

  const roster = students.filter((s) => s.class === selectedClass);
  const classTeacher = teachers.find((t) => t.classes.includes(selectedClass));

  return (
    <div>
      <PageHead
        title="Classes Directory"
        sub="Class 1 through Class 10 — pick a class to view its active student roster, assigned teacher, and stats."
      />

      <div className="class-grid" style={{ marginBottom: 22 }}>
        {CLASS_NUMS.map((c) => {
          const count = students.filter((s) => s.class === c).length;
          return (
            <div
              key={c}
              className={`class-card ${selectedClass === c ? "selected" : ""}`}
              onClick={() => setSelectedClass(c)}
            >
              <div className="num">{c}</div>
              <div className="lb">Class {c} · {count} students</div>
            </div>
          );
        })}
      </div>

      <div className="card">
        <SectionHead
          title={`Class ${selectedClass} Roster`}
          sub={
            classTeacher
              ? `Assigned Class Teacher: ${classTeacher.name} (${classTeacher.subject})`
              : "Faculty assignment pending for this section"
          }
        />

        <div className="scroll-x">
          <table className="data-table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Attendance</th>
                <th>Performance</th>
                <th>Tasks Completed</th>
                <th>Weekly Status</th>
              </tr>
            </thead>
            <tbody>
              {roster.map((s) => (
                <tr
                  key={s.id}
                  style={{ cursor: "pointer" }}
                  onClick={() => setSelectedStudent(s)}
                  title="Click to view full student profile"
                >
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <Avatar name={s.name} hue={s.avatarHue} />
                      <div>
                        <b style={{ fontSize: 12.5 }}>{s.name}</b>
                        <div style={{ fontSize: 11, color: "var(--text-mute)" }}>
                          Roll #{s.id}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td style={{ minWidth: 120 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div style={{ width: 64 }}><ProgressBar value={s.attendance} /></div>
                      <span style={{ fontSize: 11.5 }}>{s.attendance}%</span>
                    </div>
                  </td>
                  <td style={{ minWidth: 120 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div style={{ width: 64 }}><ProgressBar value={s.performance} /></div>
                      <span style={{ fontSize: 11.5 }}>{s.performance}%</span>
                    </div>
                  </td>
                  <td>
                    <span className="badge badge-purple">{s.tasksCompleted || 0} tasks</span>
                  </td>
                  <td>
                    <span className={`badge ${s.present ? "badge-green" : "badge-red"}`}>
                      {s.present ? "Present" : "Absent"}
                    </span>
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
