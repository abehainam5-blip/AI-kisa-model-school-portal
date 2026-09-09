import React, { useState } from "react";
import { Modal } from "../common/Modal";
import { useData } from "../../context/DataContext";
import { CLASS_NUMS } from "../../constants/navigation";

export function AddStudentModal({ isOpen, onClose }) {
  const { addStudent } = useData();
  const [name, setName] = useState("");
  const [cls, setCls] = useState("8");
  const [gender, setGender] = useState("Male");
  const [attendance, setAttendance] = useState("85");
  const [performance, setPerformance] = useState("75");
  const [guardianContact, setGuardianContact] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Please enter the student's full name.");
      return;
    }
    addStudent({
      name: name.trim(),
      class: cls,
      gender,
      attendance,
      performance,
      guardianContact: guardianContact.trim() || "+92 300 1234567"
    });
    // Reset form
    setName("");
    setCls("8");
    setGender("Male");
    setAttendance("85");
    setPerformance("75");
    setGuardianContact("");
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
          <button type="button" className="btn btn-primary btn-sm" onClick={handleSubmit}>
            Save Student
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
          />
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

        <div className="field-group">
          <label className="field-label">Guardian Contact Number</label>
          <input
            className="field-input"
            placeholder="+92 300 1234567"
            value={guardianContact}
            onChange={(e) => setGuardianContact(e.target.value)}
          />
        </div>
      </form>
    </Modal>
  );
}
