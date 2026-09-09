import React, { useState } from "react";
import { Lock, ShieldCheck, Edit2, Code2, Sparkles } from "lucide-react";
import { PageHead } from "../common/PageHead";
import { Modal } from "../common/Modal";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";

export function ProfilePage() {
  const { role, currentUser } = useAuth();
  const { showToast } = useToast();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [phone, setPhone] = useState("+92 321 9876543");
  const [bio, setBio] = useState(
    "AI KISA Model School's management system was designed and built by Abeha Inam to give teachers and administrators one clear, connected place to track student growth — from daily tasks to monthly report cards."
  );

  const handleSaveContact = (e) => {
    e.preventDefault();
    setIsEditModalOpen(false);
    showToast("Contact details updated successfully.", "success");
  };

  return (
    <div>
      <PageHead
        title="Profile & Identity"
        sub="Your verified system credentials and developer identity across the AI KISA Model School portal."
      />

      <div className="card" style={{ maxWidth: 640 }}>
        <div className="profile-hero" style={{ marginBottom: 22 }}>
          <div className="profile-avatar">
            {role === "teacher" ? "AN" : "AI"}
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: 20 }}>
              {role === "teacher" ? currentUser?.name : "Abeha Inam"}
            </div>
            <div style={{ fontSize: 13, color: "var(--text-mute)", marginTop: 2 }}>
              {role === "teacher" ? "Teacher · English & Digital Media" : "Student / Developer · Class 10"}
            </div>
          </div>
          <div style={{ marginLeft: "auto" }}>
            <span className="badge badge-purple">
              <ShieldCheck size={12} /> {role === "teacher" ? "Teacher Access" : "Super Admin"}
            </span>
          </div>
        </div>

        <div className="grid grid-2" style={{ marginBottom: 18 }}>
          {[
            { l: "Portal Tier", v: role === "teacher" ? "Teacher Portal" : "Super Admin Portal" },
            { l: "Assigned Grade", v: role === "teacher" ? "Class 8 & Class 9" : "Class 10 / All School" },
            { l: "Designed & Developed By", v: "Abeha Inam" },
            { l: "System Architecture", v: "React.js · PHP PDO API · PostgreSQL" },
            { l: "Official Email", v: currentUser?.email || "developer@aikisa.edu.pk" },
            { l: "Contact Hotline", v: phone },
          ].map((f, i) => (
            <div key={i} style={{ padding: "8px 0" }}>
              <div style={{ fontSize: 11, color: "var(--text-mute)", fontWeight: 700, marginBottom: 4 }}>
                {f.l}
              </div>
              <div style={{ fontSize: 13, fontWeight: 600 }}>{f.v}</div>
            </div>
          ))}
        </div>

        <div style={{ fontSize: 11.5, color: "var(--text-mute)", fontWeight: 700, marginBottom: 8 }}>
          About This Management System
        </div>
        <p style={{ fontSize: 12.5, lineHeight: 1.7, color: "var(--text-dim)", margin: "0 0 16px 0" }}>
          {bio}
        </p>

        <div style={{ display: "flex", gap: 10, alignItems: "center", justifyContent: "space-between", flexWrap: "wrap" }}>
          <div className="badge badge-gray">
            <Lock size={11} /> Core Developer Attribution Protected
          </div>
          <button
            className="btn btn-ghost btn-sm"
            onClick={() => setIsEditModalOpen(true)}
          >
            <Edit2 size={12} /> Update Contact Info
          </button>
        </div>
      </div>

      <section className="developer-card" aria-labelledby="developer-attribution-title">
        <div className="developer-card-icon" aria-hidden="true">
          <Code2 size={20} />
        </div>
        <div className="developer-card-content">
          <div className="developer-card-kicker"><Sparkles size={13} /> System Information</div>
          <h2 id="developer-attribution-title">Designed &amp; Developed By</h2>
          <div className="developer-card-name">Abeha Inam</div>
          <div className="developer-card-role">Sole Designer &amp; Lead Developer · System Architect</div>
          <p>Designed and engineered by Abeha Inam to deliver a seamless, modern, and connected digital workflow for teachers and administration at AI KISA Model School.</p>
          <div className="developer-card-stack" aria-label="System architecture">
            <span>React.js <small>Frontend</small></span>
            <span>PHP PDO API <small>Backend</small></span>
            <span>PostgreSQL <small>Database</small></span>
          </div>
        </div>
      </section>

      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Update Profile Contact Info"
        footer={
          <>
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={() => setIsEditModalOpen(false)}
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={handleSaveContact}
            >
              Save Details
            </button>
          </>
        }
      >
        <form onSubmit={handleSaveContact}>
          <div className="field-group">
            <label className="field-label">Contact Phone</label>
            <input
              className="field-input"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
          <div className="field-group">
            <label className="field-label">System Biography</label>
            <textarea
              className="field-input"
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
            />
          </div>
        </form>
      </Modal>
    </div>
  );
}
