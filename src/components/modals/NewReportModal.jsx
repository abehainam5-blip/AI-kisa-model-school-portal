import React, { useState } from "react";
import { Modal } from "../common/Modal";
import { useData } from "../../context/DataContext";
import { CLASS_NUMS } from "../../constants/navigation";

export function NewReportModal({ isOpen, onClose }) {
  const { submitReport, saving } = useData();
  const [title, setTitle] = useState("");
  const [cls, setCls] = useState("9");
  const [category, setCategory] = useState("Progress Report");
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const isSubmitting = saving.reports;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError("Please enter a title for the report.");
      return;
    }

    try {
      await submitReport({ title: title.trim(), class: cls, category, content: content.trim() });
    } catch (submitError) {
      const errorMessage = submitError?.message || submitError?.toString() || "Unable to submit this report.";
      setError(errorMessage);
      return;
    }

    setTitle("");
    setCls("9");
    setCategory("Progress Report");
    setContent("");
    setError("");
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Submit New Academic Report"
      footer={
        <>
          <button type="button" className="btn btn-ghost btn-sm" onClick={onClose}>
            Cancel
          </button>
          <button type="button" className="btn btn-primary btn-sm" onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit for Approval"}
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

        <div className="field-group">
          <label className="field-label">Report Title *</label>
          <input
            className="field-input"
            placeholder="e.g. Class 9 — Bi-Weekly Digital Media Assessment"
            value={title}
            onChange={(e) => { setTitle(e.target.value); setError(""); }}
            autoFocus
          />
        </div>

        <div className="grid grid-2" style={{ marginBottom: 15 }}>
          <div>
            <label className="field-label">Target Class</label>
            <select className="field-input" value={cls} onChange={(e) => setCls(e.target.value)}>
              {CLASS_NUMS.map((c) => (
                <option key={c} value={c}>Class {c}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="field-label">Category</label>
            <select className="field-input" value={category} onChange={(e) => setCategory(e.target.value)}>
              <option value="Progress Report">Progress Report</option>
              <option value="Technical Assessment">Technical Assessment</option>
              <option value="Attendance Report">Attendance Report</option>
              <option value="Weak Point Analysis">Weak Point Analysis</option>
              <option value="Special Activity">Special Activity</option>
            </select>
          </div>
        </div>

        <div className="field-group">
          <label className="field-label">Summary & Evaluation Notes</label>
          <textarea
            className="field-input"
            rows={4}
            placeholder="Write key observations, performance highlights, and recommendations for this batch..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            style={{ resize: "vertical" }}
          />
        </div>
      </form>
    </Modal>
  );
}
