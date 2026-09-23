import React, { useState, useMemo } from "react";
import { Modal } from "../common/Modal";
import { useData } from "../../context/DataContext";
import { CLASS_NUMS } from "../../constants/navigation";

const SOCIAL_MEDIA_REGEX = /(https?:\/\/)?(www\.)?(linkedin\.com|instagram\.com|facebook\.com|twitter\.com|x\.com)\/[A-Za-z0-9_\-\.\/]+/i;

function isValidSocialMediaUrl(url) {
  if (!url || !url.trim()) return false;
  const value = url.trim();
  // Accept bare profile names too, e.g. "instagram.com/username"
  return SOCIAL_MEDIA_REGEX.test(value) || /^(linkedin\.com|instagram\.com|facebook\.com|twitter\.com|x\.com)\/[A-Za-z0-9_\-\.\/]+$/i.test(value);
}

function generateStudentId(classNumber, existingCount) {
  const year = new Date().getFullYear();
  const seq = String(existingCount + 1).padStart(3, "0");
  return `KISA-${year}-${classNumber}-${seq}`;
}

export function AddStudentModal({ isOpen, onClose }) {
  const { addStudent, students, saving } = useData();
  const [name, setName] = useState("");
  const [cls, setCls] = useState("8");
  const [gender, setGender] = useState("Male");
  const [email, setEmail] = useState("");
  const [socialMedia, setSocialMedia] = useState("");
  const [studentId, setStudentId] = useState("");
  const [error, setError] = useState("");
  const isSubmitting = saving.students;

  const nextId = useMemo(
    () => generateStudentId(Number(cls), students.length),
    [cls, students.length]
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Please enter the student's full name.");
      return;
    }
    if (email.trim() && !/^\S+@\S+\.\S+$/.test(email.trim())) {
      setError("Please enter a valid email address if provided.");
      return;
    }
    if (socialMedia && !isValidSocialMediaUrl(socialMedia)) {
      setError("A valid Social Media Link / Profile URL (LinkedIn, Instagram, or Facebook) is required if provided.");
      return;
    }
    try {
      const generatedId = nextId;
      setStudentId(generatedId);
      await addStudent({
        name: name.trim(),
        class: cls,
        gender,
        email: email.trim(),
        socialMedia: socialMedia.trim(),
        studentId: generatedId,
      });
    } catch (submitError) {
      const errorMessage = typeof submitError === 'string' ? submitError : submitError?.message || submitError?.error || JSON.stringify(submitError);
      setError(errorMessage);
      return;
    }
    // Reset form
    setName("");
    setCls("8");
    setGender("Male");
    setEmail("");
    setSocialMedia("");
    setStudentId("");
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
            <label className="field-label">Student Email (Optional)</label>
            <input type="email" className="field-input" placeholder="student@aikisa.edu.pk" value={email} onChange={(e) => { setEmail(e.target.value); setError(""); }} />
          </div>
          <div>
            <label className="field-label">Class</label>
            <select className="field-input" value={cls} onChange={(e) => setCls(e.target.value)}>
              {CLASS_NUMS.map((c) => (
                <option key={c} value={c}>Class {c}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-2" style={{ marginBottom: 15 }}>
          <div>
            <label className="field-label">Gender</label>
            <select className="field-input" value={gender} onChange={(e) => setGender(e.target.value)}>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>

        <div className="field-group" style={{ marginBottom: 15 }}>
          <label className="field-label">Social Media Link / Profile URL (Optional)</label>
          <input
            className="field-input"
            placeholder="e.g. linkedin.com/in/username or instagram.com/username"
            value={socialMedia}
            onChange={(e) => { setSocialMedia(e.target.value); setError(""); }}
          />
          <div style={{ fontSize: 11, color: "var(--text-mute)", marginTop: 4 }}>
            Optional: LinkedIn, Instagram, or Facebook profile link.
          </div>
        </div>

        <div className="field-group">
          <label className="field-label">Generated Student ID</label>
          <input
            className="field-input"
            value={nextId}
            readOnly
            style={{ opacity: 0.85, cursor: "default" }}
          />
        </div>

      </form>
    </Modal>
  );
}