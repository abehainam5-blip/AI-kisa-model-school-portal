import React from "react";
import { Users, GraduationCap, TrendingUp, CalendarCheck } from "lucide-react";
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer
} from "recharts";
import { PageHead, SectionHead } from "../common/PageHead";
import { StatCard } from "../common/StatCard";
import { useData } from "../../context/DataContext";
import { CLASS_NUMS } from "../../constants/navigation";
import { MONTHLY_TREND } from "../../data/mockData";

export function AnalyticsPage() {
  const { students, teachers } = useData();

  const avgPerf = students.length
    ? Math.round(students.reduce((a, s) => a + s.performance, 0) / students.length)
    : 0;
  const avgAtt = students.length
    ? Math.round(students.reduce((a, s) => a + s.attendance, 0) / students.length)
    : 0;

  const byClass = CLASS_NUMS.map((c) => {
    const list = students.filter((s) => s.class === c);
    const perf = list.length
      ? Math.round(list.reduce((a, s) => a + s.performance, 0) / list.length)
      : 0;
    const att = list.length
      ? Math.round(list.reduce((a, s) => a + s.attendance, 0) / list.length)
      : 0;
    return { name: `C${c}`, performance: perf, attendance: att };
  });

  return (
    <div>
      <PageHead
        title="Performance Analytics"
        sub="School-wide metrics and macro trends across all 10 classes."
      />

      <div className="grid grid-4" style={{ marginBottom: 18 }}>
        <StatCard icon={Users} label="Total Students" value={students.length} trend="3.1%" />
        <StatCard icon={GraduationCap} label="Total Teachers" value={teachers.length} trend="0%" trendDir="up" />
        <StatCard icon={TrendingUp} label="Avg Performance" value={avgPerf} suffix="%" trend="4.7%" />
        <StatCard icon={CalendarCheck} label="Avg Attendance" value={avgAtt} suffix="%" trend="1.2%" />
      </div>

      <div className="card" style={{ marginBottom: 18 }}>
        <SectionHead
          title="Performance & Attendance by Class"
          sub="Comparing average examination score vs attendance rate across grades"
        />
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={byClass}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
            <XAxis dataKey="name" tick={{ fill: "var(--text-mute)", fontSize: 11 }} axisLine={false} tickLine={false} />
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
            <Bar dataKey="performance" fill="var(--accent)" radius={[6, 6, 0, 0]} name="Performance %" />
            <Bar dataKey="attendance" fill="var(--accent3)" radius={[6, 6, 0, 0]} name="Attendance %" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="card">
        <SectionHead
          title="Monthly School Trend"
          sub="9-month historical trajectory of performance and attendance"
        />
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={MONTHLY_TREND}>
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
            <Line type="monotone" dataKey="performance" stroke="var(--accent)" strokeWidth={2.5} dot={false} name="Performance %" />
            <Line type="monotone" dataKey="attendance" stroke="var(--accent3)" strokeWidth={2.5} dot={false} name="Attendance %" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
