import React from "react";
import { motion } from "framer-motion";
import { BookOpen, GraduationCap, BarChart3 } from "lucide-react";

export function OrbBackground() {
  return (
    <div className="orb-field" aria-hidden="true">
      <div className="orb orb-a" />
      <div className="orb orb-b" />
      <div className="orb orb-c" />
      <motion.div className="ambient-icon ambient-book" animate={{ y: [0, -10, 0], rotate: [0, 3, 0] }} transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}><BookOpen size={22} /></motion.div>
      <motion.div className="ambient-icon ambient-grade" animate={{ y: [0, 8, 0], rotate: [0, -4, 0] }} transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 1 }}><GraduationCap size={25} /></motion.div>
      <motion.div className="ambient-icon ambient-chart" animate={{ y: [0, -7, 0], scale: [1, 1.05, 1] }} transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 2 }}><BarChart3 size={20} /></motion.div>
    </div>
  );
}
