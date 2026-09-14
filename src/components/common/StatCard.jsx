import React from "react";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import { cardReveal, useMotionConfig } from "./Motion";

export function StatCard({ icon: Icon, label, value, trend, trendDir = "up", suffix = "" }) {
  const { role } = useAuth();
  const { shouldReduceMotion } = useMotionConfig();
  return (
    <motion.div
      className="card stat-card"
      variants={cardReveal}
      initial={shouldReduceMotion ? false : "hidden"}
      animate="visible"
      whileHover={shouldReduceMotion ? undefined : { y: -3, transition: { duration: 0.16 } }}
      transition={{ delay: shouldReduceMotion ? 0 : role === "super_admin" ? 0.06 : 0.1 }}
    >
      <div className="stat-top">
        <div className="stat-icon">{Icon && <Icon size={18} />}</div>
        {trend != null && (
          <div className={`stat-trend ${trendDir === "up" ? "trend-up" : "trend-down"}`}>
            {trendDir === "up" ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}
            {trend}
          </div>
        )}
      </div>
      <div className="stat-value">{value}{suffix}</div>
      <div className="stat-label">{label}</div>
    </motion.div>
  );
}
