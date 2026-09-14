import React, { useState } from "react";
import { AtSign, Edit2, Lock, Sparkles, UserRound } from "lucide-react";
import { motion } from "framer-motion";
import { PageHead } from "../common/PageHead";
import { Modal } from "../common/Modal";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import { cardReveal, useMotionConfig } from "../common/Motion";

const CREATOR_BIO =
  "I designed and developed this Teacher Management System to create a modern, organized, and easy-to-use digital experience for teachers and school administration at AI KISA Model School.";

export function ProfilePage() {
  const { role, currentUser } = useAuth();
  const { showToast } = useToast();
  const { shouldReduceMotion } = useMotionConfig();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [bio, setBio] = useState(CREATOR_BIO);

  const handleSaveContact = (e) => {
    e.preventDefault();
    setIsEditModalOpen(false);
    showToast("Profile details updated successfully.", "success");
  };

  const isTeacher = role === "teacher";
  const accountName = isTeacher ? currentUser?.name || "Teacher" : "AI Kisa Admin";
  const initials = isTeacher ? currentUser?.initials || "T" : "AI";
  const details = [
    { label: "Portal access", value: isTeacher ? "Teacher Portal" : "Super Admin Portal" },
    { label: "Assigned classes", value: isTeacher ? "Class 8 & Class 9" : "All school classes" },
    { label: "Official email", value: currentUser?.email || "admin@aikisa.edu.pk", icon: AtSign },
  ];

  return (
    <div className="profile-page">
      <PageHead
        title="Profile & Identity"
        sub="Your account details and the creator identity behind the AI KISA Model School portal."
      />

      <div className="profile-layout">
        <motion.section className="card profile-account-card" variants={cardReveal} initial={shouldReduceMotion ? false : "hidden"} animate="visible" aria-labelledby="account-title">
          <div className="profile-account-head">
            <div className="profile-avatar" aria-hidden="true">{initials}</div>
            <div className="profile-account-copy">
              <span className="profile-eyebrow"><UserRound size={13} /> Verified account</span>
              <h2 id="account-title">{accountName}</h2>
              <p>{isTeacher ? "Teacher · English & Digital Media" : "Super Admin · School administration"}</p>
            </div>
            <span className="badge badge-purple">{isTeacher ? "Teacher Access" : "Super Admin"}</span>
          </div>
          <div className="profile-detail-grid">
            {details.map(({ label, value, icon: Icon }) => (
              <div className="profile-detail" key={label}>
                <div className="profile-detail-label">{label}</div>
                <div className="profile-detail-value">{Icon && <Icon size={14} aria-hidden="true" />}<span>{value}</span></div>
              </div>
            ))}
          </div>
          <div className="profile-account-foot">
            <div className="profile-status"><span /> Account active</div>
            <button className="btn btn-ghost btn-sm" onClick={() => setIsEditModalOpen(true)}><Edit2 size={12} /> Edit profile info</button>
          </div>
        </motion.section>

        <motion.section className="developer-card" variants={cardReveal} initial={shouldReduceMotion ? false : "hidden"} animate="visible" transition={{ delay: shouldReduceMotion ? 0 : 0.08 }} aria-labelledby="developer-attribution-title">
          <div className="developer-card-kicker"><Sparkles size={13} /> Creator identity</div>
          <h2 id="developer-attribution-title">Designed &amp; Developed By</h2>
          <div className="developer-card-name">Abeha Inam</div>
          <div className="developer-card-role">Designer · Developer · AI &amp; Digital Technology</div>
          <p>{bio}</p>
          <div className="developer-card-footer"><span className="badge badge-gray"><Lock size={11} /> Identity verified</span></div>
        </motion.section>
      </div>

      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Update Profile Info"
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
            <label className="field-label">Creator Biography</label>
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
