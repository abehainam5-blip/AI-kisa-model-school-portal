import React, { useState } from "react";
import { Modal } from "../common/Modal";
import { useData } from "../../context/DataContext";
import { CLASS_NUMS } from "../../constants/navigation";

export function AddStudentModal({ isOpen, onClose }) {
  const { addStudent, saving } = useData();
  const [name, setName] = useState("");
  const [cls, setCls] = useState("8");
  const [gender, setGender] = useState("Male");
  const [attendance, setAttendance] = useState("85");
  const [performance, setPerformance] = useState("75");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const isSubmitting = saving.students;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Please enter the student's full name.");
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
      await addStudent({ name: name.trim(), class: cls, gender, attendance, performance, email: email.trim(), password });
    } catch (submitError) {
      setError(submitError.message || "Unable to save this student.");
      return;
    }
    // Reset form
    setName("");
    setCls("8");
    setGender("Male");
    setAttendance("85");
    setPerformance("75");
    setEmail("");
    setPassword("");
    setError("");
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add New Student"
      footer={
        <>
          <button type="button" className="btn btn-ghost btn-sm" onClick={onClose}>
            Cancel
          </button>
          <button type="button" className="btn btn-primary btn-sm" onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Save Student"}
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
          <label className="field-label">Student Full Name *</label>
          <input
            className="field-input"
            placeholder="e.g. Mahnoor Fatima"
            value={name}
            onChange={(e) => { setName(e.target.value); setError(""); }}
            autoFocus
            aria-label="Student Full Name *"
          />
        </div>

        <div className="grid grid-2" style={{ marginBottom: 15 }}>
          <div>
            <label className="field-label">Student Email *</label>
            <input type="email" className="field-input" placeholder="student@aikisa.edu.pk" value={email} onChange={(e) => { setEmail(e.target.value); setError(""); }} />
          </div>
          <div>
            <label className="field-label">Initial Password *</label>
            <input type="password" className="field-input" placeholder="At least 8 characters" value={password} onChange={(e) => { setPassword(e.target.value); setError(""); }} autoComplete="new-password" />
          </div>
        </div>

        <div className="grid grid-2" style={{ marginBottom: 15 }}>
          <div>
            <label className="field-label">Class</label>
            <select className="field-input" value={cls} onChange={(e) => setCls(e.target.value)}>
              {CLASS_NUMS.map((c) => (
                <option key={c} value={c}>Class {c}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="field-label">Gender</label>
            <select className="field-input" value={gender} onChange={(e) => setGender(e.target.value)}>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>

        <div className="grid grid-2" style={{ marginBottom: 15 }}>
          <div>
            <label className="field-label">Initial Attendance (%)</label>
            <input
              type="number"
              min="0"
              max="100"
              className="field-input"
              value={attendance}
              onChange={(e) => setAttendance(e.target.value)}
            />
          </div>
          <div>
            <label className="field-label">Initial Performance (%)</label>
            <input
              type="number"
              min="0"
              max="100"
              className="field-input"
              value={performance}
              onChange={(e) => setPerformance(e.target.value)}
            />
          </div>
        </div>

      </form>
    </Modal>
  );
}
