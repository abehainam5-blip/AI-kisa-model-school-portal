import React from "react";

export function ProgressBar({ value = 0, color }) {
  const clamped = Math.min(100, Math.max(0, Number(value) || 0));
  return (
    <div className="progress-track">
      <div
        className="progress-fill"
        style={{
          width: `${clamped}%`,
          ...(color ? { background: color } : {})
        }}
      />
    </div>
  );
}
