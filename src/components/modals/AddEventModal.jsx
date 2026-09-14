import React, { useState } from "react";
import { Modal } from "../common/Modal";
import { useData } from "../../context/DataContext";

export function AddEventModal({ isOpen, onClose, defaultDay = 15 }) {
  const { addCalendarEvent, saving } = useData();
  const [day, setDay] = useState(defaultDay);
  const [title, setTitle] = useState("");
  const [error, setError] = useState("");
  const isSubmitting = saving.calendar;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError("Please enter the event or deadline name.");
      return;
    }
    const d = Number(day);
    if (!d || d < 1 || d > 30) {
      setError("Please pick a valid day (1-30).");
      return;
    }
    try {
      await addCalendarEvent(d, title.trim());
    } catch (submitError) {
      setError(submitError.message || "Unable to save this event.");
      return;
    }
    setTitle("");
    setError("");
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add School Event or Deadline"
      footer={
        <>
          <button type="button" className="btn btn-ghost btn-sm" onClick={onClose}>
            Cancel
          </button>
          <button type="button" className="btn btn-primary btn-sm" onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Save Event"}
          </button>
        </>
      }
    >
      <form onSubmit={handleSubmit}>
        {error && (
          <div style={{ padding: "8px 12px", borderRadius: 8, background: "rgba(251,113,133,0.15)", color: "var(--danger)", fontSize: 12, marginBottom: 14 }}>
            {error}
          </div>
        )}
        <div className="grid grid-2" style={{ marginBottom: 15 }}>
          <div>
            <label className="field-label">Month</label>
            <input className="field-input" value="September 2026" disabled />
          </div>
          <div>
            <label className="field-label">Day (1 - 30)</label>
            <input
              type="number"
              min="1"
              max="30"
              className="field-input"
              value={day}
              onChange={(e) => setDay(e.target.value)}
            />
          </div>
        </div>

        <div className="field-group">
          <label className="field-label">Event / Deadline Title *</label>
          <input
            className="field-input"
            placeholder="e.g. Mid-Term Mark Sheet Review"
            value={title}
            onChange={(e) => { setTitle(e.target.value); setError(""); }}
            autoFocus
          />
        </div>
      </form>
    </Modal>
  );
}
