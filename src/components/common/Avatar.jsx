import React from "react";

export function initials(name = "") {
  return name
    .split(" ")
    .filter(Boolean)
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function Avatar({ name, hue = 260, size = 32, radius = 9 }) {
  return (
    <div
      className="mini-avatar"
      style={{
        width: size,
        height: size,
        borderRadius: radius,
        background: `linear-gradient(135deg, hsl(${hue}, 70%, 55%), hsl(${(hue + 50) % 360}, 75%, 50%))`
      }}
    >
      {initials(name)}
    </div>
  );
}
