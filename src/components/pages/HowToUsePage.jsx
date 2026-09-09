import React from "react";
import { PageHead } from "../common/PageHead";
import { useAuth } from "../../context/AuthContext";

const TEACHER_GUIDE = [
  { t: "Dashboard", d: "See attendance, performance, top performers, and task trends for your classes at a glance." },
  { t: "Students Directory", d: "Search and filter your students by name or class, and inspect any profile for detailed academic metrics." },
  { t: "Daily Tasks", d: "Pick a student, choose today's task type from 15 categories, and log the activity with real-time timestamps." },
  { t: "Attendance Register", d: "Mark Present or Absent per student or use batch controls — update it anytime during the day." },
  { t: "Performance Analytics", d: "Select a student to view their individual skill radar chart, strengths, and targeted focus areas." },
  { t: "Mark Sheet Generation", d: "Every student gets an auto-built monthly report card with grade, subject breakdown, and teacher review." },
];

const ADMIN_GUIDE = [
  { t: "Faculty Directory", d: "View every teacher on staff, their assigned classes, student counts, and active status." },
  { t: "Classes & Rosters", d: "Browse Class 1 through Class 10, each with its dedicated roster, student counts, and class teachers." },
  { t: "Report Approval Queue", d: "Review, approve, or reject academic reports submitted by teachers before publishing." },
  { t: "Performance Analytics", d: "School-wide comparative analytics across attendance, tasks, and class scores." },
  { t: "Audit Logs", d: "A timestamped trail of every significant action, submission, and modification across the portal." },
  { t: "System Notifications", d: "Stay informed on pending approvals, low attendance alerts, and system events in one central hub." },
];

export function HowToUsePage() {
  const { role } = useAuth();
  const guide = role === "teacher" ? TEACHER_GUIDE : ADMIN_GUIDE;

  return (
    <div>
      <PageHead
        title="How to Use the Portal"
        sub={`A comprehensive feature guide and operational workflow for the ${role === "teacher" ? "Teacher" : "Super Admin"} Portal.`}
      />
      <div className="howto-grid">
        {guide.map((g, i) => (
          <div key={i} className="howto-card">
            <div className="howto-num">{i + 1}</div>
            <div style={{ fontWeight: 800, fontSize: 14.5, marginBottom: 6 }}>{g.t}</div>
            <div style={{ fontSize: 12.5, color: "var(--text-mute)", lineHeight: 1.6 }}>{g.d}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
