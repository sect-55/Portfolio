"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";

export const Navbar = () => {
  const pathname = usePathname();

  return (
    <nav className="mx-auto flex max-w-2xl flex-col items-start gap-4 px-4 pt-4 md:pt-8">
      <div className="flex items-center gap-2">
        <Link
          href="/"
          className="text-foreground text-xl font-medium tracking-tight transition-colors hover:text-primary md:text-2xl"
        >
          Sudharsan
        </Link>
      </div>
      <div className="flex flex-wrap items-center gap-3 md:gap-4">
        <AnimatePresence>
          {pathname === "/resume" && (
            <motion.a
              key="download-btn"
              href="/api/resume-download"
              download="sudharsanBackend.pdf"
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              transition={{ type: "spring", visualDuration: 0.35, bounce: 0.2 }}
              className="group flex items-center gap-1.5 text-sm text-foreground/70 transition-colors hover:text-primary"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="size-3.5 transition-transform duration-300 group-hover:translate-y-0.5"
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              <span className="hidden sm:inline">Download</span>
            </motion.a>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};
