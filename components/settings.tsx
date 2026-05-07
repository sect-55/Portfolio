"use client";
import { IconMoon, IconSun } from "@tabler/icons-react";
import { motion } from "motion/react";
import Link from "next/link";
import { useEffect, useState } from "react";
const STORAGE_KEY = "theme";

export const Settings = () => {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    const prefersDark =
      saved === "dark" ||
      (!saved && window.matchMedia("(prefers-color-scheme: dark)").matches);
    setDark(prefersDark);
    document.documentElement.classList.toggle("dark", prefersDark);
  }, []);

  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key !== STORAGE_KEY) return;
      const next = e.newValue === "dark";
      setDark(next);
      document.documentElement.classList.toggle("dark", next);
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  useEffect(() => {
    const handleThemeToggle = () => {
      const next = !dark;
      setDark(next);
      document.documentElement.classList.toggle("dark", next);
      localStorage.setItem(STORAGE_KEY, next ? "dark" : "light");
    };
    window.addEventListener("theme-toggle", handleThemeToggle);
    return () => window.removeEventListener("theme-toggle", handleThemeToggle);
  }, [dark]);

  const toggle = () => {
    const next = !dark;
    const apply = () => {
      setDark(next);
      document.documentElement.classList.toggle("dark", next);
      localStorage.setItem(STORAGE_KEY, next ? "dark" : "light");
    };
    if (!document.startViewTransition) { apply(); return; }
    document.startViewTransition(apply);
  };

  return (
    <div className="fixed top-4 right-4 z-[60] flex items-center gap-2">
      <Link
        href="/contact"
        className="group/availability rounded-full border border-neutral-300/45 bg-transparent px-3.5 py-2 text-sm font-medium text-foreground/80 shadow-sm shadow-black/5 backdrop-blur-xl transition-colors duration-200 hover:border-neutral-500/60 hover:text-foreground dark:border-white/15 dark:hover:border-white/30"
      >
        <span className="inline-block transition-transform duration-200 group-hover/availability:scale-105">
          Available for work
        </span>
      </Link>
      <motion.button
        onClick={toggle}
        whileTap={{ scale: 0.85 }}
        initial={{ opacity: 0, rotate: -90 }}
        animate={{ opacity: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 10 }}
        style={{ viewTransitionName: "theme-btn" }}
        className="theme-toggle group/theme-toggle flex size-10 select-none items-center justify-center rounded-full border border-neutral-300/45 bg-transparent shadow-sm shadow-black/5 backdrop-blur-xl cursor-default dark:border-white/15"
      >
        <motion.div
          key={dark ? "sun" : "moon"}
          initial={{ scale: 0, rotate: -180, opacity: 0 }}
          animate={{ scale: 1, rotate: 0, opacity: 1 }}
          exit={{ scale: 0, rotate: 180, opacity: 0 }}
          transition={{ type: "spring", stiffness: 250, damping: 15 }}
        >
          <span className="block transition-transform duration-200 group-hover/theme-toggle:scale-[1.15]">
            {dark ? (
              <IconSun className="size-6 text-foreground" />
            ) : (
              <IconMoon className="size-6 text-foreground" />
            )}
          </span>
        </motion.div>
      </motion.button>
    </div>
  );
};
