import React, { useState } from "react";
import {
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";
import { PageHead, SectionHead } from "../common/PageHead";
import { Avatar } from "../common/Avatar";
import { useData } from "../../context/DataContext";

export function PerformancePage() {
  const { roleStudents, weeklyInsights } = useData();
  const [selectedId, setSelectedId] = useState(roleStudents[0]?.id || "");
  const st = roleStudents.find((s) => s.id === selectedId) || roleStudents[0];

  const radarData = st
    ? [
        { subject: "Attendance", value: st.attendance },
        { subject: "Performance", value: st.performance },
        { subject: "Tasks", value: Math.min(100, (st.tasksCompleted || 0) * 8) },
        { subject: "Consistency", value: Math.round((st.attendance + st.performance) / 2 - 5) },
        { subject: "Growth", value: Math.min(100, st.performance + 8) },
      ]
    : [];

  const barData = roleStudents.map((s) => ({
    name: s.name.split(" ")[0],
    performance: s.performance
  }));

  return (
    <div>
      <PageHead
        title="Performance Analytics"
        sub="Individual student skill breakdown with radar visualization and class comparative analysis."
      />

      {/* Top Grid: Student selector + Radar */}
      <div className="grid" style={{ gridTemplateColumns: "1fr 1.3fr", marginBottom: 18 }}>
        <div className="card">
          <SectionHead
            title="Select Student"
            sub="Pick a student to view their individual skill radar"
          />
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 6,
              maxHeight: 360,
              overflowY: "auto",
              paddingRight: 4
            }}
          >
            {roleStudents.map((s) => (
              <div
                key={s.id}
                onClick={() => setSelectedId(s.id)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "9px 12px",
                  borderRadius: 11,
                  cursor: "pointer",
                  background: selectedId === s.id ? "rgba(168,85,247,0.14)" : "transparent",
                  border: selectedId === s.id ? "1px solid var(--border-strong)" : "1px solid transparent",
                  transition: "background .15s ease"
                }}
              >
                <Avatar name={s.name} hue={s.avatarHue} size={30} radius={8} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12.5, fontWeight: 700, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {s.name}
                  </div>
                  <div style={{ fontSize: 11, color: "var(--text-mute)" }}>
                    Class {s.class}
                  </div>
                </div>
                <div style={{ fontSize: 12, fontWeight: 700, color: "var(--accent)" }}>
                  {s.performance}%
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <SectionHead
            title={st ? `${st.name} — Skill Radar` : "Skill Radar"}
            sub="Balanced strength distribution across key developmental areas"
          />
          <ResponsiveContainer width="100%" height={280}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="var(--border)" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: "var(--text-mute)", fontSize: 11 }} />
              <PolarRadiusAxis tick={false} axisLine={false} domain={[0, 100]} />
              <Radar
                dataKey="value"
                stroke="var(--accent)"
                fill="var(--accent)"
                fillOpacity={0.35}
                strokeWidth={2}
              />
              <Tooltip
                contentStyle={{
                  background: "var(--surface)",
                  border: "1px solid var(--border)",
                  borderRadius: 10,
                  fontSize: 12,
                  color: "var(--text)"
                }}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bottom Grid: Class comparison bar chart + Strengths/Weaknesses */}
      <div className="grid" style={{ gridTemplateColumns: "1.4fr 1fr" }}>
        <div className="card">
          <SectionHead
            title="Class Score Comparison"
            sub="Performance benchmark across students"
          />
          <ResponsiveContainer width="100%" height={230}>
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis
                dataKey="name"
                tick={{ fill: "var(--text-mute)", fontSize: 10.5 }}
                axisLine={false}
                tickLine={false}
                interval={0}
                angle={-30}
                textAnchor="end"
                height={45}
              />
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
              <Bar dataKey="performance" radius={[6, 6, 0, 0]} fill="var(--accent)" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <SectionHead
            title={st ? `${st.name}'s Profile Highlights` : "Profile Highlights"}
          />
          {st && (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div>
                <div style={{ fontSize: 11.5, color: "var(--text-mute)", fontWeight: 700, marginBottom: 8 }}>
                  Recognized Strengths
                </div>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  {st.strengths?.map((x, i) => (
                    <span key={i} className="badge badge-green">{x}</span>
                  ))}
                </div>
              </div>

              <div>
                <div style={{ fontSize: 11.5, color: "var(--text-mute)", fontWeight: 700, marginBottom: 8 }}>
                  Identified Weak Points
                </div>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  {st.weakPoints?.map((x, i) => (
                    <span key={i} className="badge badge-red">{x}</span>
                  ))}
                </div>
              </div>

              <div style={{ padding: 12, borderRadius: 12, background: "var(--surface2)", border: "1px solid var(--border)", fontSize: 12, color: "var(--text-dim)", lineHeight: 1.5 }}>
                {st.name.split(" ")[0]} has achieved an overall performance score of {st.performance}% with {st.attendance}% attendance record this term.
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="card" style={{ marginTop: 18 }}>
        <SectionHead title="Weekly Progress Intelligence" sub="Maximum progress, neglected areas, and task mastery" />
        <div className="grid grid-3">
          {weeklyInsights.byStudent.filter(({ student }) => !st || student.id === st.id).map(({ student, mastery, progress, weak, neglected, completed, pending }) => (
            <div key={student.id} style={{ padding: 14, borderRadius: 12, background: "var(--surface2)", border: "1px solid var(--border)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 9 }}><Avatar name={student.name} hue={student.avatarHue} size={30} radius={8} /><b>{student.name}</b></div>
              <div style={{ marginTop: 12, fontSize: 12, color: "var(--text-dim)" }}>Task mastery <strong style={{ color: "var(--accent)" }}>{mastery}%</strong></div>
              <div style={{ marginTop: 5, fontSize: 11, color: "var(--success)" }}>Progress: {progress}</div>
              <div style={{ marginTop: 5, fontSize: 11, color: "var(--danger)" }}>Weak point: {weak}</div>
              <div style={{ marginTop: 5, fontSize: 11, color: "var(--text-mute)" }}>Completed {completed} · Pending {pending} · Neglected {neglected.length ? neglected.join(", ") : "None"}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
