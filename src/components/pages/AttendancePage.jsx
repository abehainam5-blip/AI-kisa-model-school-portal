import React, { useState, useMemo } from "react";
import { Check, X, Activity, Calendar as CalendarIcon, Users } from "lucide-react";
import { PageHead } from "../common/PageHead";
import { StatCard } from "../common/StatCard";
import { Avatar } from "../common/Avatar";
import { EmptyState } from "../common/EmptyState";
import { useData } from "../../context/DataContext";

export function AttendancePage() {
  const { roleStudents, attendance, setStudentAttendance, markAllAttendance } = useData();
  const [selectedClass, setSelectedClass] = useState("all");
  const [currentDate, setCurrentDate] = useState("2026-09-04");

  const classes = useMemo(() => {
    return Array.from(new Set(roleStudents.map((s) => s.class))).sort((a, b) => a - b);
  }, [roleStudents]);

  const filteredStudents = useMemo(() => {
    if (selectedClass === "all") return roleStudents;
    return roleStudents.filter((s) => s.class === Number(selectedClass));
  }, [roleStudents, selectedClass]);

  const presentCount = filteredStudents.filter((s) => attendance[s.id] !== false).length;
  const absentCount = filteredStudents.length - presentCount;
  const attendanceRate = filteredStudents.length
    ? Math.round((presentCount / filteredStudents.length) * 100)
    : 0;

  const handleMarkAll = (val) => {
    const ids = filteredStudents.map((s) => s.id);
    markAllAttendance(ids, val);
  };

  return (
    <div>
      <PageHead
        title="Attendance"
        sub="Mark today's attendance — toggle individual student presence or use batch controls."
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <input
            type="date"
            className="field-input"
            style={{ width: 150, padding: "6px 10px", fontSize: 12 }}
            value={currentDate}
            onChange={(e) => setCurrentDate(e.target.value)}
          />
        </div>
      </PageHead>

      {/* 3 Stat Cards */}
      <div className="grid grid-3" style={{ marginBottom: 18 }}>
        <StatCard icon={Check} label="Present Today" value={presentCount} />
        <StatCard icon={X} label="Absent Today" value={absentCount} />
        <StatCard icon={Activity} label="Attendance Rate" value={attendanceRate} suffix="%" />
      </div>

      <div className="card">
        {/* Actions Bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
            marginBottom: 16,
            flexWrap: "wrap"
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <label className="field-label" style={{ margin: 0 }}>Class:</label>
            <select
              className="field-input"
              style={{ width: 140 }}
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
            >
              <option value="all">All Classes</option>
              {classes.map((c) => (
                <option key={c} value={c}>Class {c}</option>
              ))}
            </select>
          </div>

          <div style={{ display: "flex", gap: 8 }}>
            <button
              className="btn btn-ghost btn-sm"
              onClick={() => handleMarkAll(true)}
              title="Mark all listed students as Present"
            >
              <Check size={13} color="var(--success)" /> Mark All Present
            </button>
            <button
              className="btn btn-ghost btn-sm"
              onClick={() => handleMarkAll(false)}
              title="Mark all listed students as Absent"
            >
              <X size={13} color="var(--danger)" /> Mark All Absent
            </button>
          </div>
        </div>

        {/* Table */}
        {filteredStudents.length === 0 ? (
          <EmptyState
            title="No students in this class"
            message="Please select a different class."
          />
        ) : (
          <div className="scroll-x">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Class</th>
                  <th>Roll #</th>
                  <th>Status</th>
                  <th style={{ textAlign: "right" }}>Mark Attendance</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map((s) => {
                  const isPresent = attendance[s.id] !== false;
                  return (
                    <tr key={s.id}>
                      <td>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <Avatar name={s.name} hue={s.avatarHue} />
                          <b style={{ fontSize: 12.5 }}>{s.name}</b>
                        </div>
                      </td>
                      <td>Class {s.class}</td>
                      <td>#{s.id}</td>
                      <td>
                        {isPresent ? (
                          <span className="badge badge-green">
                            <Check size={11} /> Present
                          </span>
                        ) : (
                          <span className="badge badge-red">
                            <X size={11} /> Absent
                          </span>
                        )}
                      </td>
                      <td style={{ textAlign: "right" }}>
                        <div className="toggle-pill">
                          <button
                            className={isPresent ? "active" : ""}
                            onClick={() => setStudentAttendance(s.id, true)}
                          >
                            Present
                          </button>
                          <button
                            className={!isPresent ? "active danger-active" : ""}
                            onClick={() => setStudentAttendance(s.id, false)}
                          >
                            Absent
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
