import React, { useState } from "react";
import { Search, ShieldCheck } from "lucide-react";
import { PageHead } from "../common/PageHead";
import { EmptyState } from "../common/EmptyState";
import { useData } from "../../context/DataContext";

export function AuditLogsPage() {
  const { auditLogs } = useData();
  const [search, setSearch] = useState("");
  const [actorFilter, setActorFilter] = useState("all");

  const actors = Array.from(new Set(auditLogs.map((l) => l.actor)));

  const filtered = auditLogs.filter((l) => {
    const matchesSearch =
      l.actor.toLowerCase().includes(search.toLowerCase()) ||
      l.action.toLowerCase().includes(search.toLowerCase()) ||
      l.target.toLowerCase().includes(search.toLowerCase());
    const matchesActor = actorFilter === "all" || l.actor === actorFilter;
    return matchesSearch && matchesActor;
  });

  return (
    <div>
      <PageHead
        title="Audit Logs & Compliance Trail"
        sub="A timestamped trail of administrative actions, attendance updates, mark sheet generation, and report approvals."
      />

      <div className="card">
        <div style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap", alignItems: "center" }}>
          <div className="search-wrap" style={{ maxWidth: 280 }}>
            <Search size={14} />
            <input
              placeholder="Search audit actions, actors, targets…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <select
            className="field-input"
            style={{ width: 160 }}
            value={actorFilter}
            onChange={(e) => setActorFilter(e.target.value)}
          >
            <option value="all">All Actors</option>
            {actors.map((a) => (
              <option key={a} value={a}>{a}</option>
            ))}
          </select>

          {(search || actorFilter !== "all") && (
            <button
              className="btn btn-ghost btn-sm"
              onClick={() => { setSearch(""); setActorFilter("all"); }}
              style={{ marginLeft: "auto" }}
            >
              Reset Filters
            </button>
          )}
        </div>

        {filtered.length === 0 ? (
          <EmptyState
            title="No audit records found"
            message="No system activities match your current search query."
          />
        ) : (
          <div className="scroll-x">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Actor</th>
                  <th>Action Recorded</th>
                  <th>Target Entity</th>
                  <th>Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((l) => (
                  <tr key={l.id}>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <ShieldCheck size={14} color="var(--accent)" />
                        <b>{l.actor}</b>
                      </div>
                    </td>
                    <td>
                      <span className="badge badge-purple">{l.action}</span>
                    </td>
                    <td style={{ color: "var(--text-dim)" }}>{l.target}</td>
                    <td style={{ color: "var(--text-mute)", fontSize: 12 }}>{l.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
