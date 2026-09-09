import React, { useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";
import { PageHead, SectionHead } from "../common/PageHead";
import { Avatar } from "../common/Avatar";
import { StudentDetailsModal } from "../modals/StudentDetailsModal";
import { useData } from "../../context/DataContext";

export function WeakPointsPage() {
  const { roleStudents } = useData();
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [classFilter, setClassFilter] = useState("all");

  const students = classFilter === "all"
    ? roleStudents
    : roleStudents.filter((s) => s.class === Number(classFilter));

  const classes = Array.from(new Set(roleStudents.map((s) => s.class))).sort((a, b) => a - b);

  const tally = {};
  students.forEach((s) => {
    s.weakPoints?.forEach((w) => {
      tally[w] = (tally[w] || 0) + 1;
    });
  });

  const chartData = Object.entries(tally)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);

  const worst = [...students].sort((a, b) => a.performance - b.performance).slice(0, 5);

  return (
    <div>
      <PageHead
        title="Weak Points"
        sub="Where students are struggling most, so teachers know exactly where to prioritize revision and support."
      >
        <select
          className="field-input"
          style={{ width: 140 }}
          value={classFilter}
          onChange={(e) => setClassFilter(e.target.value)}
        >
          <option value="all">All Classes</option>
          {classes.map((c) => (
            <option key={c} value={c}>Class {c}</option>
          ))}
        </select>
      </PageHead>

      <div className="grid" style={{ gridTemplateColumns: "1fr 1fr" }}>
        {/* Horizontal Bar Chart of Weak Areas */}
        <div className="card">
          <SectionHead
            title="Most Common Weak Areas"
            sub="Frequency of identified weak points in current batch"
          />
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={chartData} layout="vertical" margin={{ left: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal={false} />
              <XAxis type="number" tick={{ fill: "var(--text-mute)", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis
                type="category"
                dataKey="name"
                width={150}
                tick={{ fill: "var(--text-dim)", fontSize: 11.5 }}
                axisLine={false}
                tickLine={false}
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
              <Bar dataKey="count" radius={[0, 6, 6, 0]} fill="var(--danger)" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Priority Focus List */}
        <div className="card">
          <SectionHead
            title="Students Needing Attention"
            sub="Lowest performance score this month — click to view profile"
          />
          <div style={{ display: "flex", flexDirection: "column", gap: 11 }}>
            {worst.map((s) => (
              <div
                key={s.id}
                onClick={() => setSelectedStudent(s)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 11,
                  padding: "8px 10px",
                  borderRadius: 12,
                  cursor: "pointer",
                  background: "var(--surface2)",
                  border: "1px solid var(--border)",
                  transition: "border-color .15s ease"
                }}
              >
                <Avatar name={s.name} hue={s.avatarHue} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12.5, fontWeight: 700, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {s.name} <span style={{ fontSize: 11, color: "var(--text-mute)", fontWeight: 500 }}>· Class {s.class}</span>
                  </div>
                  <div style={{ fontSize: 11, color: "var(--text-mute)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {s.weakPoints?.join(", ")}
                  </div>
                </div>
                <span className="badge badge-red">{s.performance}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <StudentDetailsModal
        student={selectedStudent}
        isOpen={!!selectedStudent}
        onClose={() => setSelectedStudent(null)}
      />
    </div>
  );
}
