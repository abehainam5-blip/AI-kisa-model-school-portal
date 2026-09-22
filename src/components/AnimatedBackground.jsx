import React, { useMemo } from "react";
import { motion } from "framer-motion";

/**
 * AnimatedBackground - Reusable moving ambient background for the portal.
 * Features:
 *  - Particle grid drifting diagonally
 *  - Floating geometric glow rings
 *  - Smooth gradient background waves
 *
 * Props:
 *  - particleCount (default 28)
 *  - ringCount    (default 3)
 *  - intensity   (default 1) - scales motion speed & opacity
 */
export function AnimatedBackground({
  particleCount = 28,
  ringCount = 3,
  intensity = 1,
  className = "",
}) {
  const particles = useMemo(() => {
    const list = [];
    for (let i = 0; i < particleCount; i++) {
      list.push({
        id: i,
        size: 2 + Math.random() * 3,
        left: Math.random() * 100,
        top: Math.random() * 100,
        duration: 18 + Math.random() * 22,
        delay: Math.random() * 10,
        hue: [262, 280, 320, 340, 200][i % 5],
        driftX: (Math.random() - 0.5) * 40,
        driftY: (Math.random() - 0.5) * 40,
      });
    }
    return list;
  }, [particleCount]);

  const rings = useMemo(() => {
    const list = [];
    for (let i = 0; i < ringCount; i++) {
      list.push({
        id: i,
        size: 120 + i * 70,
        left: 10 + i * 28,
        top: 10 + i * 18,
        duration: 14 + i * 6,
        delay: i * 2,
        hue: 262 + i * 12,
      });
    }
    return list;
  }, [ringCount]);

  const speed = Math.max(0.2, intensity);

  return (
    <div
      className={`animated-bg ${className}`}
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        overflow: "hidden",
        pointerEvents: "none",
        zIndex: 0,
        background:
          "radial-gradient(ellipse 80% 60% at 20% 10%, rgba(124,58,237,0.18), transparent 60%), radial-gradient(ellipse 70% 70% at 85% 90%, rgba(236,72,153,0.14), transparent 60%), linear-gradient(135deg, #0a0714 0%, #07060f 50%, #0a0714 100%)",
      }}
    >
      {/* Particle grid */}
      <div className="particle-grid">
        {particles.map((p) => (
          <motion.div
            key={p.id}
            className="particle"
            style={{
              position: "absolute",
              width: p.size,
              height: p.size,
              left: `${p.left}%`,
              top: `${p.top}%`,
              borderRadius: "50%",
              background: `hsl(${p.hue}, 80%, 65%)`,
              boxShadow: `0 0 ${p.size * 2.5}px hsl(${p.hue}, 80%, 60%)`,
              willChange: "transform",
            }}
            animate={{
              x: [0, p.driftX, 0],
              y: [0, p.driftY, 0],
              opacity: [0.25, 0.85, 0.25],
              scale: [0.8, 1.2, 0.8],
            }}
            transition={{
              duration: p.duration * speed,
              delay: p.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Floating glow rings */}
      <div className="glow-rings">
        {rings.map((r) => (
          <motion.div
            key={r.id}
            style={{
              position: "absolute",
              width: r.size,
              height: r.size,
              left: `${r.left}%`,
              top: `${r.top}%`,
              borderRadius: "50%",
              border: `1.5px solid hsla(${r.hue}, 80%, 60%, 0.35)`,
              boxShadow: `0 0 40px hsla(${r.hue}, 80%, 55%, 0.25), inset 0 0 20px hsla(${r.hue}, 80%, 55%, 0.12)`,
              willChange: "transform",
            }}
            animate={{
              rotate: [0, 360],
              scale: [1, 1.08, 1],
              y: [0, -20, 0],
            }}
            transition={{
              duration: r.duration * speed,
              delay: r.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Background waves (smooth flowing gradients) */}
      <motion.div
        className="bg-wave bg-wave-1"
        animate={{
          backgroundPosition: ["0% 0%", "200% 0%", "0% 0%"],
        }}
        transition={{ duration: 32 * speed, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        className="bg-wave bg-wave-2"
        animate={{
          backgroundPosition: ["0% 0%", "-200% 0%", "0% 0%"],
        }}
        transition={{ duration: 40 * speed, repeat: Infinity, ease: "linear" }}
      />
    </div>
  );
}

export default AnimatedBackground;