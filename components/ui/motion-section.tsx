"use client";

import { motion } from "framer-motion";

const EASE_OUT_QUART = [0.22, 1, 0.36, 1] as const;

/** Container variant: triggers stagger on children. Use whileInView. */
const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

/** Item variant: each direct child animates individually. */
const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: EASE_OUT_QUART },
  },
};

interface MotionSectionProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Scroll-triggered stagger container.
 * Wrap section content in this; place <MotionItem> around each element
 * you want to stagger (heading, body, etc.).
 */
export function MotionSection({ children, className = "" }: MotionSectionProps) {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.15 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/**
 * Individual animated child. Must be a descendant of <MotionSection>.
 */
export function MotionItem({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div variants={itemVariants} className={className}>
      {children}
    </motion.div>
  );
}

/**
 * Mount animation variant for elements that should animate on page load
 * (i.e., the Hero which is always visible — not scroll-triggered).
 */
export function MotionOnMount({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: EASE_OUT_QUART, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
