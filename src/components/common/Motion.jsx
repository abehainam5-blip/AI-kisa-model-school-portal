import { motion, useReducedMotion } from "framer-motion";

export const pageVariants = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 }
};

export const adminStagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06, delayChildren: 0.04 } }
};

export const teacherStagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.08 } }
};

export const cardReveal = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.32, ease: "easeOut" } }
};

export function useMotionConfig() {
  const shouldReduceMotion = useReducedMotion();
  return { shouldReduceMotion };
}

export function MotionPage({ children, pageKey }) {
  const { shouldReduceMotion } = useMotionConfig();
  return (
    <motion.div
      key={pageKey}
      variants={pageVariants}
      initial={shouldReduceMotion ? false : "initial"}
      animate="animate"
      exit={shouldReduceMotion ? undefined : "exit"}
      transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.28, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}