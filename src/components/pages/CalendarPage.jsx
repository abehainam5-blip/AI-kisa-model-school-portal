import React, { useState } from "react";
import { Plus, Calendar as CalendarIcon, Clock } from "lucide-react";
import { PageHead, SectionHead } from "../common/PageHead";
import { AddEventModal } from "../modals/AddEventModal";
import { useData } from "../../context/DataContext";

export function CalendarPage() {
  const { calendarEvents } = useData();
  const [selectedDay, setSelectedDay] = useState(18);
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);

  const daysInMonth = 30;
  const startOffset = 2; // Tuesday start for Sep 2026
  const cells = Array.from({ length: startOffset }, () => null).concat(
    Array.from({ length: daysInMonth }, (_, i) => i + 1)
  );

  return (
    <div>
      <PageHead
        title="Calendar & Deadlines"
        sub="Academic schedule, report deadlines, parent-teacher reviews, and school activities."
      >
        <button
          className="btn btn-primary btn-sm"
          onClick={() => setIsEventModalOpen(true)}
        >
          <Plus size={14} /> Add Event
        </button>
      </PageHead>

      <div className="grid" style={{ gridTemplateColumns: "1fr 300px" }}>
        {/* Calendar Grid */}
        <div className="card">
          <SectionHead
            title="September 2026"
            sub="Click any date to inspect scheduled events"
          />

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(7, 1fr)",
              gap: 8,
              marginBottom: 10
            }}
          >
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
              <div
                key={d}
                style={{
                  textAlign: "center",
                  fontSize: 11.5,
                  color: "var(--text-mute)",
                  fontWeight: 700
                }}
              >
                {d}
              </div>
            ))}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 8 }}>
            {cells.map((d, i) => {
              const hasEvent = d && calendarEvents[d];
              const isSelected = d === selectedDay;
              return (
                <div
                  key={i}
                  onClick={() => d && setSelectedDay(d)}
                  style={{
                    aspectRatio: "1",
                    borderRadius: 12,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    background: isSelected
                      ? "linear-gradient(145deg, rgba(168,85,247,0.25), rgba(192,38,211,0.12))"
                      : d
                      ? "var(--surface2)"
                      : "transparent",
                    border: isSelected
                      ? "1.5px solid var(--accent)"
                      : d
                      ? "1px solid var(--border)"
                      : "none",
                    fontSize: 12.5,
                    fontWeight: 700,
                    position: "relative",
                    color: d ? "var(--text)" : "transparent",
                    cursor: d ? "pointer" : "default",
                    boxShadow: isSelected ? "var(--glow)" : "none",
                    transition: "all .15s ease"
                  }}
                >
                  {d}
                  {hasEvent && (
                    <span
                      style={{
                        position: "absolute",
                        bottom: 6,
                        width: 5,
                        height: 5,
                        borderRadius: "50%",
                        background: "var(--accent)",
                        boxShadow: "0 0 6px var(--accent)"
                      }}
                    />
                  )}
                </div>
              );
            })}
          </div>

          {selectedDay && (
            <div
              style={{
                marginTop: 18,
                padding: 12,
                borderRadius: 12,
                background: "var(--surface2)",
                border: "1px solid var(--border)",
                display: "flex",
                alignItems: "center",
                gap: 10
              }}
            >
              <CalendarIcon size={16} color="var(--accent)" />
              <div style={{ fontSize: 12.5 }}>
                <b>September {selectedDay}, 2026:</b>{" "}
                {calendarEvents[selectedDay] || "No formal school event scheduled for this date."}
              </div>
            </div>
          )}
        </div>

        {/* Upcoming Events Column */}
        <div className="card">
          <SectionHead title="Upcoming Events" sub="School-wide schedule" />
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {Object.entries(calendarEvents).map(([d, label]) => (
              <div
                key={d}
                onClick={() => setSelectedDay(Number(d))}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "8px 10px",
                  borderRadius: 11,
                  cursor: "pointer",
                  background: Number(d) === selectedDay ? "rgba(168,85,247,0.12)" : "transparent",
                  border: Number(d) === selectedDay ? "1px solid var(--border-strong)" : "1px solid transparent",
                  transition: "all .15s ease"
                }}
              >
                <div
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: 10,
                    background: "rgba(168, 85, 247, 0.14)",
                    color: "var(--accent)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 800,
                    fontSize: 13,
                    flexShrink: 0
                  }}
                >
                  {d}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12.5, fontWeight: 700, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {label}
                  </div>
                  <div style={{ fontSize: 11, color: "var(--text-mute)" }}>
                    Sep {d}, 2026
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <AddEventModal
        isOpen={isEventModalOpen}
        onClose={() => setIsEventModalOpen(false)}
        defaultDay={selectedDay || 15}
      />
    </div>
  );
}
