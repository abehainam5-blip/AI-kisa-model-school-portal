import React from "react";
import { Modal } from "../common/Modal";
import { Avatar } from "../common/Avatar";
import { ProgressBar } from "../common/ProgressBar";
import { Check, X, Star, Mail, Calendar, Award } from "lucide-react";
import { useData } from "../../context/DataContext";

export function StudentDetailsModal({ student, isOpen, onClose }) {
  const { attendance, setStudentAttendance } = useData();
  if (!student) return null;

  const isPresent = attendance[student.id] !== false;
  const grade =
    student.performance >= 90
      ? "A+"
      : student.performance >= 80
      ? "A"
      : student.performance >= 70
      ? "B"
      : student.performance >= 60
      ? "C"
      : "D";

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Student Profile & Academic Details"
      size="lg"
      footer={
        <button type="button" className="btn btn-primary btn-sm" onClick={onClose}>
          Close Details
        </button>
      }
    >
      <div style={{ display: "flex", gap: 16, alignItems: "center", marginBottom: 20, flexWrap: "wrap" }}>
        <Avatar name={student.name} hue={student.avatarHue} size={64} radius={18} />
        <div style={{ flex: 1, minWidth: 200 }}>
          <div style={{ fontSize: 18, fontWeight: 800 }}>{student.name}</div>
          <div style={{ fontSize: 12.5, color: "var(--text-mute)", marginTop: 2 }}>
            Class {student.class} · Roll #{student.id} · {student.gender || "Student"}
          </div>
          <div style={{ display: "flex", gap: 8, marginTop: 8, flexWrap: "wrap" }}>
            <span className={`badge ${isPresent ? "badge-green" : "badge-red"}`}>
              {isPresent ? <Check size={11} /> : <X size={11} />}
              {isPresent ? "Present Today" : "Absent Today"}
            </span>
            <span className="badge badge-purple">
              <Award size={11} /> Grade: {grade}
            </span>
          </div>
        </div>
        <div className="toggle-pill">
          <button
            className={isPresent ? "active" : ""}
            onClick={() => setStudentAttendance(student.id, true)}
          >
            Present
          </button>
          <button
            className={!isPresent ? "active danger-active" : ""}
            onClick={() => setStudentAttendance(student.id, false)}
          >
            Absent
          </button>
        </div>
      </div>

      <div className="grid grid-3" style={{ marginBottom: 18 }}>
        <div className="card card-tight" style={{ background: "var(--surface2)" }}>
          <div style={{ fontSize: 11.5, color: "var(--text-mute)", fontWeight: 700, marginBottom: 4 }}>
            Attendance Rate
          </div>
          <div style={{ fontSize: 20, fontWeight: 800 }}>{student.attendance}%</div>
          <div style={{ marginTop: 6 }}><ProgressBar value={student.attendance} /></div>
        </div>

        <div className="card card-tight" style={{ background: "var(--surface2)" }}>
          <div style={{ fontSize: 11.5, color: "var(--text-mute)", fontWeight: 700, marginBottom: 4 }}>
            Performance Score
          </div>
          <div style={{ fontSize: 20, fontWeight: 800, color: "var(--accent)" }}>{student.performance}%</div>
          <div style={{ marginTop: 6 }}><ProgressBar value={student.performance} /></div>
        </div>

        <div className="card card-tight" style={{ background: "var(--surface2)" }}>
          <div style={{ fontSize: 11.5, color: "var(--text-mute)", fontWeight: 700, marginBottom: 4 }}>
            Tasks Completed
          </div>
          <div style={{ fontSize: 20, fontWeight: 800 }}>{student.tasksCompleted || 0}</div>
          <div style={{ fontSize: 11, color: "var(--text-mute)", marginTop: 6 }}>This Month</div>
        </div>
      </div>

      <div className="grid grid-2" style={{ marginBottom: 18 }}>
        <div className="card card-tight">
          <div style={{ fontSize: 12, fontWeight: 700, color: "var(--text-mute)", marginBottom: 8 }}>
            Core Strengths
          </div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {student.strengths?.map((s, i) => (
              <span key={i} className="badge badge-green">{s}</span>
            ))}
          </div>
        </div>

        <div className="card card-tight">
          <div style={{ fontSize: 12, fontWeight: 700, color: "var(--text-mute)", marginBottom: 8 }}>
            Focus & Weak Points
          </div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {student.weakPoints?.map((w, i) => (
              <span key={i} className="badge badge-red">{w}</span>
            ))}
          </div>
        </div>
      </div>

      <div className="card card-tight" style={{ background: "var(--surface2)" }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: "var(--text-mute)", marginBottom: 8 }}>
          Student Contact Information
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 6, fontSize: 12.5 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Mail size={14} color="var(--accent)" />
            <span>{student.email || `${student.name.toLowerCase().replace(/\s+/g, ".")}@aikisa.edu.pk`}</span>
          </div>
        </div>
      </div>
    </Modal>
  );
}
