import React, { useState } from "react";
import { Modal } from "../common/Modal";
import { useData } from "../../context/DataContext";
import { TASK_TYPES } from "../../constants/taskTypes";

export function QuickTaskModal({ isOpen, onClose }) {
  const { roleStudents, assignTask } = useData();
  const [selectedStudent, setSelectedStudent] = useState(roleStudents[0]?.id || "");
  const [selectedTask, setSelectedTask] = useState("canva");
  const [note, setNote] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedStudent || !selectedTask) return;
    assignTask(Number(selectedStudent), selectedTask, note.trim());
    setNote("");
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Log Daily Student Activity"
      size="lg"
      footer={
        <>
          <button type="button" className="btn btn-ghost btn-sm" onClick={onClose}>
            Cancel
          </button>
          <button type="button" className="btn btn-primary btn-sm" onClick={handleSubmit}>
            Assign Activity
          </button>
        </>
      }
    >
      <form onSubmit={handleSubmit}>
        <div className="field-group">
          <label className="field-label">Student</label>
          <select
            className="field-input"
            value={selectedStudent}
            onChange={(e) => setSelectedStudent(e.target.value)}
          >
            {roleStudents.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} · Class {s.class}
              </option>
            ))}
          </select>
        </div>

        <label className="field-label" style={{ marginBottom: 10 }}>Task Type</label>
        <div className="task-grid" style={{ maxHeight: 240, overflowY: "auto", padding: 2, marginBottom: 15 }}>
          {TASK_TYPES.map((t) => {
            const Icon = t.icon;
            const sel = selectedTask === t.key;
            return (
              <div
                key={t.key}
                className={`task-card ${sel ? "selected" : ""}`}
                onClick={() => setSelectedTask(t.key)}
              >
                <div className="ic" style={{ background: `${t.color}22`, color: t.color }}>
                  <Icon size={18} />
                </div>
                <div className="lb">{t.label}</div>
              </div>
            );
          })}
        </div>

        <div className="field-group">
          <label className="field-label">Optional Task Notes</label>
          <input
            className="field-input"
            placeholder="e.g. Science fair presentation template completed"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </div>
      </form>
    </Modal>
  );
}
