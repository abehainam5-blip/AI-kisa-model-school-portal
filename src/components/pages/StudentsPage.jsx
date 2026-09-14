import React, { useState, useMemo } from "react";
import { Plus, Search, Check, X, Eye, Trash2, Filter } from "lucide-react";
import { PageHead } from "../common/PageHead";
import { Avatar } from "../common/Avatar";
import { ProgressBar } from "../common/ProgressBar";
import { EmptyState } from "../common/EmptyState";
import { ConfirmDialog } from "../common/Modal";
import { AddStudentModal } from "../modals/AddStudentModal";
import { StudentDetailsModal } from "../modals/StudentDetailsModal";
import { useAuth } from "../../context/AuthContext";
import { useData } from "../../context/DataContext";
import { motion } from "framer-motion";
import { useMotionConfig } from "../common/Motion";

export function StudentsPage() {
  const { role } = useAuth();
  const { shouldReduceMotion } = useMotionConfig();
  const { roleStudents, attendance, deleteStudent, globalSearch } = useData();

  const [localQuery, setLocalQuery] = useState("");
  const [classFilter, setClassFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("name");

  // Modals
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [studentToDelete, setStudentToDelete] = useState(null);

  const classes = useMemo(() => {
    return Array.from(new Set(roleStudents.map((s) => s.class))).sort((a, b) => a - b);
  }, [roleStudents]);

  const effectiveQuery = globalSearch || localQuery;

  const filtered = useMemo(() => {
    return roleStudents
      .filter((s) => {
        const matchesQuery = s.name.toLowerCase().includes(effectiveQuery.toLowerCase());
        const matchesClass = classFilter === "all" || s.class === Number(classFilter);
        const isPresent = attendance[s.id] !== false;
        const matchesStatus =
          statusFilter === "all" ||
          (statusFilter === "present" && isPresent) ||
          (statusFilter === "absent" && !isPresent);
        return matchesQuery && matchesClass && matchesStatus;
      })
      .sort((a, b) => {
        if (sortBy === "performance") return b.performance - a.performance;
        if (sortBy === "attendance") return b.attendance - a.attendance;
        if (sortBy === "tasks") return (b.tasksCompleted || 0) - (a.tasksCompleted || 0);
        return a.name.localeCompare(b.name);
      });
  }, [roleStudents, effectiveQuery, classFilter, statusFilter, sortBy, attendance]);

  const resetFilters = () => {
    setLocalQuery("");
    setClassFilter("all");
    setStatusFilter("all");
    setSortBy("name");
  };

  return (
    <div>
      <PageHead
        title="Students"
        sub={
          role === "teacher"
            ? "Students assigned to your classes — search, filter, inspect profiles, and manage records."
            : "Every student enrolled across the school directory."
        }
      >
        <button
          className="btn btn-primary btn-sm"
          onClick={() => setIsAddOpen(true)}
        >
          <Plus size={14} /> Add Student
        </button>
      </PageHead>

      <div className="card">
        {/* Controls / Filter Bar */}
        <div
          style={{
            display: "flex",
            gap: 10,
            marginBottom: 16,
            flexWrap: "wrap",
            alignItems: "center"
          }}
        >
          <div className="search-wrap" style={{ maxWidth: 260 }}>
            <Search size={15} />
            <input
              placeholder="Search by student name…"
              value={localQuery}
              onChange={(e) => setLocalQuery(e.target.value)}
            />
          </div>

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

          <select
            className="field-input"
            style={{ width: 140 }}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Statuses</option>
            <option value="present">Present Only</option>
            <option value="absent">Absent Only</option>
          </select>

          <select
            className="field-input"
            style={{ width: 160 }}
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="name">Sort by: Name</option>
            <option value="performance">Sort by: Performance</option>
            <option value="attendance">Sort by: Attendance</option>
            <option value="tasks">Sort by: Tasks Done</option>
          </select>

          {(classFilter !== "all" || statusFilter !== "all" || localQuery) && (
            <button
              className="btn btn-ghost btn-sm"
              onClick={resetFilters}
              style={{ marginLeft: "auto" }}
            >
              Reset Filters
            </button>
          )}
        </div>

        {/* Table or Empty State */}
        {filtered.length === 0 ? (
          <EmptyState
            title="No matching students"
            message="No students match the selected search terms and filters."
            action={
              <button className="btn btn-ghost btn-sm" onClick={resetFilters}>
                Clear All Filters
              </button>
            }
          />
        ) : (
          <div className="scroll-x">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Class</th>
                  <th>Attendance</th>
                  <th>Performance</th>
                  <th>Tasks Done</th>
                  <th>Today's Status</th>
                  <th style={{ textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((s) => {
                  const isPresent = attendance[s.id] !== false;
                  return (
                    <motion.tr
                      key={s.id}
                      initial={shouldReduceMotion ? false : { opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: shouldReduceMotion ? 0 : 0.24, delay: shouldReduceMotion ? 0 : role === "teacher" ? 0.06 : 0.03 }}
                      whileHover={shouldReduceMotion ? undefined : { backgroundColor: "rgba(168,85,247,0.06)" }}
                    >
                      <td>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 10,
                            cursor: "pointer"
                          }}
                          onClick={() => setSelectedStudent(s)}
                          title="Click to view full details"
                        >
                          <Avatar name={s.name} hue={s.avatarHue} />
                          <div>
                            <b style={{ fontSize: 12.5 }}>{s.name}</b>
                            <div style={{ fontSize: 11, color: "var(--text-mute)" }}>
                              Roll #{s.id}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td>Class {s.class}</td>
                      <td style={{ minWidth: 120 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <div style={{ width: 64 }}>
                            <ProgressBar value={s.attendance} />
                          </div>
                          <span style={{ fontSize: 11.5, color: "var(--text-mute)" }}>
                            {s.attendance}%
                          </span>
                        </div>
                      </td>
                      <td style={{ minWidth: 120 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <div style={{ width: 64 }}>
                            <ProgressBar value={s.performance} />
                          </div>
                          <span style={{ fontSize: 11.5, color: "var(--text-mute)" }}>
                            {s.performance}%
                          </span>
                        </div>
                      </td>
                      <td>
                        <span className="badge badge-purple">
                          {s.tasksCompleted || 0}
                        </span>
                      </td>
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
                        <div style={{ display: "inline-flex", gap: 6 }}>
                          <button
                            className="icon-btn"
                            style={{ width: 30, height: 30, borderRadius: 8 }}
                            onClick={() => setSelectedStudent(s)}
                            title="View Student Profile"
                          >
                            <Eye size={13} />
                          </button>
                          <button
                            className="icon-btn"
                            style={{ width: 30, height: 30, borderRadius: 8, color: "var(--danger)" }}
                            onClick={() => setStudentToDelete(s)}
                            title="Delete Student"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modals */}
      <AddStudentModal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
      />

      <StudentDetailsModal
        student={selectedStudent}
        isOpen={!!selectedStudent}
        onClose={() => setSelectedStudent(null)}
      />

      <ConfirmDialog
        isOpen={!!studentToDelete}
        onClose={() => setStudentToDelete(null)}
        onConfirm={() => {
          if (studentToDelete) {
            deleteStudent(studentToDelete.id);
            setStudentToDelete(null);
          }
        }}
        title="Delete Student Record"
        message={`Are you sure you want to remove ${studentToDelete?.name} (Class ${studentToDelete?.class}) from the system? This action cannot be undone.`}
        confirmText="Yes, Delete"
      />
    </div>
  );
}
