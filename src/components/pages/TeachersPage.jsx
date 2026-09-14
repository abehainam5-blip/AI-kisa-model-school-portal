import React, { useState } from "react";
import { Plus, Star } from "lucide-react";
import { PageHead } from "../common/PageHead";
import { Avatar } from "../common/Avatar";
import { AddTeacherModal } from "../modals/AddTeacherModal";
import { useData } from "../../context/DataContext";

export function TeachersPage() {
  const { teachers, students } = useData();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  return (
    <div>
      <PageHead
        title="Faculty Directory"
        sub="Every faculty teacher on staff, their assigned classes, student roster count, and status."
      >
        <button
          className="btn btn-primary btn-sm"
          onClick={() => setIsAddModalOpen(true)}
        >
          <Plus size={14} /> Add Teacher
        </button>
      </PageHead>

      <div className="grid grid-3">
        {teachers.map((t) => {
          const studentCount = students.filter((s) => t.classes.includes(s.class)).length;
          return (
            <div key={t.id} className="card">
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
                <Avatar name={t.name} hue={t.id * 63} size={46} radius={13} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      fontWeight: 800,
                      fontSize: 14,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap"
                    }}
                  >
                    {t.name}
                  </div>
                  <div style={{ fontSize: 11.5, color: "var(--text-mute)" }}>{t.subject}</div>
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 10 }}>
                <span style={{ color: "var(--text-mute)" }}>Assigned Classes</span>
                <span style={{ fontWeight: 700 }}>{t.classes.map((c) => `Class ${c}`).join(", ")}</span>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 14 }}>
                <span style={{ color: "var(--text-mute)" }}>Active Students</span>
                <span style={{ fontWeight: 700 }}>{studentCount} students</span>
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  paddingTop: 10,
                  borderTop: "1px solid var(--border)"
                }}
              >
                <span className={`badge ${t.status === "Active" ? "badge-green" : "badge-gray"}`}>
                  {t.status}
                </span>
                <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, fontWeight: 700, color: "var(--gold)" }}>
                  <Star size={12} fill="var(--gold)" /> {t.rating || 4.8}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <AddTeacherModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />
    </div>
  );
}
