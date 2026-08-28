"use client";

import { useEffect, useState, type ReactNode } from "react";
import { motion } from "motion/react";
import { prefersReducedMotion } from "@/lib/gsap";

type MobileRevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
};

export function MobileReveal({
  children,
  className = "",
  delay = 0,
}: MobileRevealProps) {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    setReduced(prefersReducedMotion());
  }, []);

  if (reduced) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2, margin: "-6% 0px" }}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
