import React, { useState } from "react";
import {
  Users, CalendarCheck, TrendingUp, ClipboardList, Plus,
  Calendar as CalendarIcon, Star, Check
} from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell
} from "recharts";
import { PageHead, SectionHead } from "../common/PageHead";
import { StatCard } from "../common/StatCard";
import { ProgressBar } from "../common/ProgressBar";
import { Avatar } from "../common/Avatar";
import { QuickTaskModal } from "../modals/QuickTaskModal";
import { StudentDetailsModal } from "../modals/StudentDetailsModal";
import { NewReportModal } from "../modals/NewReportModal";
import { useAuth } from "../../context/AuthContext";
import { useData } from "../../context/DataContext";
import { MONTHLY_TREND } from "../../data/mockData";
import { TEACHER_NAME, TEACHER_CLASSES } from "../../constants/navigation";
import { motion } from "framer-motion";
import { adminStagger, teacherStagger, useMotionConfig } from "../common/Motion";

export function DashboardPage({ setPage }) {
  const { role } = useAuth();
  const { roleStudents, reports, tasksLog } = useData();
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  const isTeacher = role === "teacher";
  const { shouldReduceMotion } = useMotionConfig();
  const students = roleStudents;

  const avgAttendance = students.length
    ? Math.round(students.reduce((a, s) => a + s.attendance, 0) / students.length)
    : 0;
  const avgPerf = students.length
    ? Math.round(students.reduce((a, s) => a + s.performance, 0) / students.length)
    : 0;
  const totalTasks = students.reduce((a, s) => a + (s.tasksCompleted || 0), 0);
  const topStudent = [...students].sort((a, b) => b.performance - a.performance)[0];

  const pieData = [
    { name: "Excellent (85+)", value: students.filter((s) => s.performance >= 85).length, color: "var(--accent)" },
    { name: "Good (65-84)", value: students.filter((s) => s.performance >= 65 && s.performance < 85).length, color: "var(--accent3)" },
    { name: "Needs Focus (<65)", value: students.filter((s) => s.performance < 65).length, color: "var(--gold)" },
  ];

  return (
    <div>
      <PageHead
        title={isTeacher ? `Welcome back, ${TEACHER_NAME.split(" ")[1] || TEACHER_NAME}` : "School Overview"}
        sub={
          isTeacher
            ? `Here's what's happening with Class ${TEACHER_CLASSES.join(" & ")} today.`
            : "A real-time snapshot across every class, teacher and report."
        }
      >
        <button
          className="btn btn-ghost btn-sm"
          onClick={() => setPage("calendar")}
          title="Go to Calendar"
        >
          <CalendarIcon size={14} /> Today
        </button>
          <motion.button
          className="btn btn-primary btn-sm"
          onClick={() => {
            if (isTeacher) setIsTaskModalOpen(true);
            else setIsReportModalOpen(true);
          }}
          whileHover={shouldReduceMotion ? undefined : { scale: 1.03 }}
          whileTap={shouldReduceMotion ? undefined : { scale: 0.98 }}
          animate={!isTeacher && !shouldReduceMotion ? { boxShadow: ["0 0 0 rgba(168,85,247,0)", "0 0 18px rgba(168,85,247,0.35)", "0 0 0 rgba(168,85,247,0)"] } : undefined}
          transition={!isTeacher && !shouldReduceMotion ? { duration: 2.4, repeat: Infinity } : undefined}
        >
          <Plus size={14} /> {isTeacher ? "Log Task" : "New Announcement"}
          </motion.button>
      </PageHead>

      {/* 4 Stat KPI Cards */}
      <motion.div
        className="grid grid-4"
        style={{ marginBottom: 18 }}
        variants={isTeacher ? teacherStagger : adminStagger}
        initial={shouldReduceMotion ? false : "hidden"}
        animate="visible"
      >
        <StatCard
          icon={Users}
          label={isTeacher ? "My Students" : "Total Students"}
          value={students.length}
          trend="4.2%"
        />
        <StatCard
          icon={CalendarCheck}
          label="Avg Attendance"
          value={avgAttendance}
          suffix="%"
          trend="2.1%"
        />
        <StatCard
          icon={TrendingUp}
          label="Avg Performance"
          value={avgPerf}
          suffix="%"
          trend="5.4%"
        />
        <StatCard
          icon={ClipboardList}
          label={isTeacher ? "Tasks Logged" : "Tasks Logged (School)"}
          value={totalTasks}
          trend="1.8%"
          trendDir="down"
        />
      </motion.div>

      {/* Chart Section */}
      <div className="grid" style={{ gridTemplateColumns: "1.7fr 1fr", marginBottom: 18 }}>
        <div className="card">
          <SectionHead
            title="Attendance & Performance Trend"
            sub="Last 9 months, school-wide average"
          />
          <ResponsiveContainer width="100%" height={230}>
            <AreaChart data={MONTHLY_TREND}>
              <defs>
                <linearGradient id="gradAtt" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--accent)" stopOpacity={0.5} />
                  <stop offset="100%" stopColor="var(--accent)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gradPerf" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--accent3)" stopOpacity={0.5} />
                  <stop offset="100%" stopColor="var(--accent3)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="month" tick={{ fill: "var(--text-mute)", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "var(--text-mute)", fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{
                  background: "var(--surface)",
                  border: "1px solid var(--border)",
                  borderRadius: 10,
                  fontSize: 12,
                  color: "var(--text)"
                }}
              />
              <Area type="monotone" dataKey="attendance" stroke="var(--accent)" fill="url(#gradAtt)" strokeWidth={2.5} name="Attendance %" />
              <Area type="monotone" dataKey="performance" stroke="var(--accent3)" fill="url(#gradPerf)" strokeWidth={2.5} name="Performance %" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <SectionHead title="Performance Split" sub="Where students currently stand" />
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                innerRadius={45}
                outerRadius={70}
                paddingAngle={4}
              >
                {pieData.map((d, i) => (
                  <Cell key={i} fill={d.color} stroke="var(--surface)" strokeWidth={2} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  background: "var(--surface)",
                  border: "1px solid var(--border)",
                  borderRadius: 10,
                  fontSize: 12,
                  color: "var(--text)"
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 6 }}>
            {pieData.map((d, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12 }}>
                <span style={{ width: 8, height: 8, borderRadius: 2, background: d.color, flexShrink: 0 }} />
                <span style={{ color: "var(--text-mute)", flex: 1 }}>{d.name}</span>
                <b>{d.value}</b>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Grid */}
      <div className="grid" style={{ gridTemplateColumns: "1fr 1fr" }}>
        {/* Top Performer Card with click to view profile */}
        <div
          className="card"
          style={{ cursor: "pointer", transition: "transform .15s ease, border-color .15s ease" }}
          onClick={() => topStudent && setSelectedStudent(topStudent)}
          title="Click to view full academic profile"
        >
          <SectionHead title="Top Performer This Month" sub="Click to inspect detailed profile" />
          {topStudent && (
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <Avatar name={topStudent.name} hue={topStudent.avatarHue} size={54} radius={16} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 800, fontSize: 15, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {topStudent.name}
                </div>
                <div style={{ fontSize: 12, color: "var(--text-mute)" }}>
                  Class {topStudent.class} · {topStudent.tasksCompleted || 0} tasks completed
                </div>
                <div style={{ marginTop: 8 }}>
                  <ProgressBar value={topStudent.performance} />
                </div>
              </div>
              <div style={{ textAlign: "right", flexShrink: 0 }}>
                <div style={{ fontSize: 22, fontWeight: 800, color: "var(--accent)" }}>
                  {topStudent.performance}%
                </div>
                <span className="badge badge-gold">
                  <Star size={11} /> Top rank
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Recent Activity / Approvals */}
        <div className="card">
          <SectionHead
            title={isTeacher ? "Recent Activity" : "Pending Approvals"}
            right={
              <button
                className="btn btn-ghost btn-sm"
                style={{ fontSize: 11, padding: "4px 8px" }}
                onClick={() => setPage(isTeacher ? "tasks" : "approval")}
              >
                View all
              </button>
            }
          />
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {(isTeacher
              ? tasksLog.slice(0, 3).map((l) => ({
                  t: `Assigned ${l.task} to ${l.student}`,
                  s: l.time
                }))
              : reports.filter((r) => r.status === "Pending").slice(0, 3).map((r) => ({
                  t: r.title,
                  s: r.submitted
                }))
            ).map((it, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: "var(--accent)",
                    flexShrink: 0,
                    boxShadow: "0 0 8px var(--accent)"
                  }}
                />
                <div style={{ flex: 1, fontSize: 12.5, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {it.t}
                </div>
                <div style={{ fontSize: 11, color: "var(--text-mute)", flexShrink: 0 }}>
                  {it.s}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modals */}
      <QuickTaskModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
      />
      <NewReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
      />
      <StudentDetailsModal
        student={selectedStudent}
        isOpen={!!selectedStudent}
        onClose={() => setSelectedStudent(null)}
      />
    </div>
  );
}
