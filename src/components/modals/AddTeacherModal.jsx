import React, { useState } from "react";
import { Modal } from "../common/Modal";
import { useData } from "../../context/DataContext";
import { CLASS_NUMS } from "../../constants/navigation";

export function AddTeacherModal({ isOpen, onClose }) {
  const { addTeacher, saving } = useData();
  const [name, setName] = useState("");
  const [subject, setSubject] = useState("");
  const [selectedClasses, setSelectedClasses] = useState([8, 9]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const isSubmitting = saving.teachers;

  const toggleClass = (c) => {
    setSelectedClasses((prev) =>
      prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c].sort((a, b) => a - b)
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Please enter the teacher's full name.");
      return;
    }
    if (!subject.trim()) {
      setError("Please enter the teacher's subject specialty.");
      return;
    }
    if (!selectedClasses.length) {
      setError("Please assign at least one class.");
      return;
    }
    if (!email.trim() || !/^\S+@\S+\.\S+$/.test(email.trim())) {
      setError("Please enter a valid unique email address.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    try {
      await addTeacher({ name: name.trim(), subject: subject.trim(), classes: selectedClasses, email: email.trim(), password });
    } catch (submitError) {
      setError(submitError.message || "Unable to save this teacher.");
      return;
    }

    setName("");
    setSubject("");
    setSelectedClasses([8, 9]);
    setEmail("");
    setPassword("");
    setError("");
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add New Faculty Member"
      footer={
        <>
          <button type="button" className="btn btn-ghost btn-sm" onClick={onClose}>
            Cancel
          </button>
          <button type="button" className="btn btn-primary btn-sm" onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Save Teacher"}
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
          <label className="field-label">Teacher Full Name *</label>
          <input
            className="field-input"
            placeholder="e.g. Mr. Kashif Baig"
            value={name}
            onChange={(e) => { setName(e.target.value); setError(""); }}
            autoFocus
          />
        </div>

        <div className="field-group">
          <label className="field-label">Subject Specialty *</label>
          <input
            className="field-input"
            placeholder="e.g. Physics & Robotics"
            value={subject}
            onChange={(e) => { setSubject(e.target.value); setError(""); }}
          />
        </div>

        <div className="field-group">
          <label className="field-label">Assigned Classes *</label>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 4 }}>
            {CLASS_NUMS.map((c) => {
              const isSel = selectedClasses.includes(c);
              return (
                <button
                  type="button"
                  key={c}
                  onClick={() => toggleClass(c)}
                  className="chip"
                  style={{
                    cursor: "pointer",
                    background: isSel ? "linear-gradient(135deg, var(--accent), var(--accent2))" : "var(--surface2)",
                    color: isSel ? "#fff" : "var(--text-dim)",
                    borderColor: isSel ? "var(--accent)" : "var(--border)"
                  }}
                >
                  Class {c}
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid grid-2">
          <div>
            <label className="field-label">Email Address</label>
            <input
              type="email"
              className="field-input"
              placeholder="teacher@aikisa.edu.pk"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="field-label">Initial Password *</label>
            <input
              type="password"
              className="field-input"
              placeholder="At least 8 characters"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(""); }}
              autoComplete="new-password"
            />
          </div>
        </div>
      </form>
    </Modal>
  );
}
