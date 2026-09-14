import React, { useState } from "react";
import { Check, Search } from "lucide-react";
import { PageHead, SectionHead } from "../common/PageHead";
import { Avatar } from "../common/Avatar";
import { EmptyState } from "../common/EmptyState";
import { TASK_TYPES } from "../../constants/taskTypes";
import { useData } from "../../context/DataContext";
import { motion } from "framer-motion";
import { useMotionConfig } from "../common/Motion";

export function DailyTasksPage() {
  const { roleStudents, tasksLog, assignTask, saving } = useData();
  const [selectedStudent, setSelectedStudent] = useState(roleStudents[0]?.id || "");
  const [selectedTask, setSelectedTask] = useState(null);
  const [taskNote, setTaskNote] = useState("");
  const [logSearch, setLogSearch] = useState("");
  const [error, setError] = useState("");
  const isSubmitting = saving.tasks;
  const { shouldReduceMotion } = useMotionConfig();

  const handleAssign = async () => {
    if (!selectedStudent || !selectedTask) return;
    try {
      await assignTask(Number(selectedStudent), selectedTask, taskNote.trim());
    } catch (submitError) {
      setError(submitError.message || "Unable to save this activity.");
      return;
    }
    setSelectedTask(null);
    setTaskNote("");
    setError("");
  };

  const filteredLog = tasksLog.filter((l) =>
    l.student.toLowerCase().includes(logSearch.toLowerCase()) ||
    l.task.toLowerCase().includes(logSearch.toLowerCase())
  );

  return (
    <div>
      <PageHead
        title="Daily Tasks"
        sub="Assign today's task type to a student, record custom project notes, and keep a running activity log."
      />

      <div className="grid" style={{ gridTemplateColumns: "1.4fr 1fr" }}>
        {/* Assignment Card */}
        <div className="card">
          <SectionHead
            title="Assign a Task"
            sub="Pick a student, then choose today's task type."
          />

          <label className="field-label">Select Student</label>
          <select
            className="field-input"
            style={{ marginBottom: 18 }}
            value={selectedStudent}
            onChange={(e) => setSelectedStudent(Number(e.target.value))}
          >
            {roleStudents.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} · Class {s.class} ({s.tasksCompleted || 0} tasks recorded)
              </option>
            ))}
          </select>

          <label className="field-label" style={{ marginBottom: 12 }}>
            Task Type {selectedTask && `· Selected: ${TASK_TYPES.find(t=>t.key===selectedTask)?.label}`}
          </label>
          <div className="task-grid">
            {TASK_TYPES.map((t) => {
              const Icon = t.icon;
              const sel = selectedTask === t.key;
              return (
                <div
                  key={t.key}
                  className={`task-card ${sel ? "selected" : ""}`}
                  onClick={() => setSelectedTask(t.key)}
                  role="button"
                  tabIndex={0}
                >
                  <div className="ic" style={{ background: `${t.color}22`, color: t.color }}>
                    <Icon size={18} />
                  </div>
                  <div className="lb">{t.label}</div>
                </div>
              );
            })}
          </div>

          <div className="field-group" style={{ marginTop: 16 }}>
            <label className="field-label">Additional Task / Project Details (Optional)</label>
            <input
              className="field-input"
              placeholder="e.g. Chapter 4 review presentation or Canva newsletter cover"
              value={taskNote}
              onChange={(e) => setTaskNote(e.target.value)}
            />
          </div>

          {error && <div style={{ padding: "8px 12px", borderRadius: 8, background: "rgba(251,113,133,0.15)", color: "var(--danger)", fontSize: 12, marginTop: 12 }}>{error}</div>}
          <button
            className="btn btn-primary"
            style={{ marginTop: 6 }}
            disabled={!selectedTask || !selectedStudent || isSubmitting}
            onClick={handleAssign}
          >
            <Check size={14} /> {isSubmitting ? "Saving..." : "Assign Task"}
          </button>
        </div>

        {/* Log Card */}
        <div className="card">
          <SectionHead
            title="Today's Activity Log"
            sub={`${tasksLog.length} tasks recorded today`}
          />

          <div className="search-wrap" style={{ maxWidth: "100%", marginBottom: 14 }}>
            <Search size={14} />
            <input
              placeholder="Filter log by student or task…"
              value={logSearch}
              onChange={(e) => setLogSearch(e.target.value)}
            />
          </div>

          {filteredLog.length === 0 ? (
            <EmptyState
              title="No tasks found"
              message="No daily task entries match your search."
            />
          ) : (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 10,
                maxHeight: 520,
                overflowY: "auto",
                paddingRight: 4
              }}
            >
              {filteredLog.map((l) => (
                <motion.div
                  key={l.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    padding: "10px 12px",
                    background: "var(--surface2)",
                    borderRadius: 12,
                    border: "1px solid var(--border)"
                  }}
                  initial={shouldReduceMotion ? false : { opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: shouldReduceMotion ? 0 : 0.24 }}
                >
                  <Avatar name={l.student} hue={(l.student?.length || 1) * 37} size={32} radius={9} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 12.5, fontWeight: 700, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {l.student}
                    </div>
                    <div style={{ fontSize: 11, color: "var(--text-mute)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {l.task}
                    </div>
                  </div>
                  <div style={{ fontSize: 10.5, color: "var(--text-mute)", flexShrink: 0 }}>
                    {l.time}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
