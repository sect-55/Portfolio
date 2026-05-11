"use client";

import { motion } from "motion/react";

export function BackIconButton({
  onClick,
  className,
  viewTransitionName,
  ariaLabel = "Back",
}: {
  onClick: () => void;
  className?: string;
  viewTransitionName?: string;
  ariaLabel?: string;
}) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileTap={{ scale: 0.94 }}
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ type: "spring", stiffness: 240, damping: 22 }}
      style={viewTransitionName ? { viewTransitionName } : undefined}
      className={
        className ??
        "group flex items-center justify-center px-1 text-foreground/80 drop-shadow-sm transition-colors duration-200 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/15"
      }
      aria-label={ariaLabel}
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="size-5 transition-transform duration-200 group-hover:-translate-x-0.5"
      >
        <path
          d="M15 18L9 12L15 6"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </motion.button>
  );
}

