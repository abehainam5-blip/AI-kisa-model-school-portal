import React, { useState, useMemo } from "react";
import { Check, X, Activity, Calendar as CalendarIcon, Users } from "lucide-react";
import { PageHead } from "../common/PageHead";
import { StatCard } from "../common/StatCard";
import { Avatar } from "../common/Avatar";
import { EmptyState } from "../common/EmptyState";
import { useData } from "../../context/DataContext";

export function AttendancePage() {
  const { roleStudents, attendance, attendanceHistory, setStudentAttendance, markAllAttendance } = useData();
  const [selectedClass, setSelectedClass] = useState("all");
  const [currentDate, setCurrentDate] = useState(new Date().toISOString().slice(0, 10));
  const [calendarMonth, setCalendarMonth] = useState(new Date().getMonth());
  const [calendarYear, setCalendarYear] = useState(new Date().getFullYear());

  const classes = useMemo(() => {
    return Array.from(new Set(roleStudents.map((s) => s.class))).sort((a, b) => {
      // Sort Nursery first, then KG, then numeric classes
      const order = { 'Nursery': 0, 'KG': 1 };
      const aOrder = order[a] ?? (typeof a === 'number' ? a + 2 : 100);
      const bOrder = order[b] ?? (typeof b === 'number' ? b + 2 : 100);
      return aOrder - bOrder;
    });
  }, [roleStudents]);

  const filteredStudents = useMemo(() => {
    if (selectedClass === "all") return roleStudents;
    return roleStudents.filter((s) => s.class === selectedClass || s.class === Number(selectedClass));
  }, [roleStudents, selectedClass]);

  const presentCount = filteredStudents.filter((s) => attendance[s.id] !== false).length;
  const absentCount = filteredStudents.length - presentCount;
  const attendanceRate = filteredStudents.length
    ? Math.round((presentCount / filteredStudents.length) * 100)
    : 0;

  const handleMarkAll = (val) => {
    const ids = filteredStudents.map((s) => s.id);
    markAllAttendance(ids, val, currentDate);
  };

  const daysInMonth = new Date(calendarYear, calendarMonth + 1, 0).getDate();
  const monthStart = new Date(calendarYear, calendarMonth, 1).getDay();
  const calendarCells = Array.from({ length: monthStart }, () => null).concat(Array.from({ length: daysInMonth }, (_, index) => index + 1));
  const monthName = new Date(calendarYear, calendarMonth, 1).toLocaleString("en-US", { month: "long" });

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
                <option key={c} value={c}>{typeof c === 'string' ? c : `Class ${c}`}</option>
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
                      <td>{typeof s.class === 'string' ? s.class : `Class ${s.class}`}</td>
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
                            onClick={() => setStudentAttendance(s.id, true, currentDate)}
                          >
                            Present
                          </button>
                          <button
                            className={!isPresent ? "active danger-active" : ""}
                            onClick={() => setStudentAttendance(s.id, false, currentDate)}
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

      <div className="card" style={{ marginTop: 18 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, marginBottom: 14 }}>
          <div><h3 className="section-title">Monthly Attendance View</h3><p className="section-sub" style={{ marginBottom: 0 }}>Daily register history for the selected class</p></div>
          <div style={{ display: "flex", gap: 6 }}>
            <button className="btn btn-ghost btn-sm" onClick={() => { const next = calendarMonth - 1; if (next < 0) { setCalendarMonth(11); setCalendarYear(calendarYear - 1); } else setCalendarMonth(next); }}>Prev</button>
            <button className="btn btn-ghost btn-sm" onClick={() => { const next = calendarMonth + 1; if (next > 11) { setCalendarMonth(0); setCalendarYear(calendarYear + 1); } else setCalendarMonth(next); }}>Next</button>
          </div>
        </div>
        <div style={{ fontWeight: 800, marginBottom: 10 }}>{monthName} {calendarYear}</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 7 }}>
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => <div key={day} style={{ textAlign: "center", fontSize: 10, color: "var(--text-mute)" }}>{day}</div>)}
          {calendarCells.map((day, index) => {
            const dateKey = day ? `${calendarYear}-${String(calendarMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}` : "";
            const record = dateKey ? attendanceHistory[dateKey] : null;
            const marked = record ? Object.values(record) : [];
            const rate = marked.length ? Math.round(marked.filter(Boolean).length / marked.length * 100) : null;
            return <div key={index} style={{ minHeight: 48, borderRadius: 9, padding: 6, background: day ? "var(--surface2)" : "transparent", border: day ? "1px solid var(--border)" : "none", fontSize: 11, color: day ? "var(--text)" : "transparent" }}><b>{day}</b>{rate !== null && <div style={{ marginTop: 5, fontSize: 9, color: rate >= 80 ? "var(--success)" : "var(--danger)" }}>{rate}% present</div>}</div>;
          })}
        </div>
      </div>
    </div>
  );
}
