import React from "react";

export function SectionHead({ title, sub, right }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, marginBottom: 14, flexWrap: "wrap" }}>
      <div>
        <h3 className="section-title">{title}</h3>
        {sub && <p className="section-sub" style={{ marginBottom: 0 }}>{sub}</p>}
      </div>
      {right && <div>{right}</div>}
    </div>
  );
}

export function PageHead({ title, sub, children }) {
  return (
    <div className="page-head">
      <div>
        <h1>{title}</h1>
        {sub && <p>{sub}</p>}
      </div>
      {children && <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>{children}</div>}
    </div>
  );
}
