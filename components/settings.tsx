"use client";
import { IconMoon, IconSun } from "@tabler/icons-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import KeyboardControls from "@/components/KeyboardControls";
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
    <div className="fixed top-5 right-5 z-50 flex items-center gap-3">
      <div className="relative z-[51]">
        <KeyboardControls />
      </div>
      <motion.button
        onClick={toggle}
        whileTap={{ scale: 0.85 }}
        whileHover={{ scale: 1.15 }}
        initial={{ opacity: 0, rotate: -90 }}
        animate={{ opacity: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 10 }}
        style={{ viewTransitionName: "theme-btn" }}
        className="theme-toggle flex size-10 select-none items-center justify-center cursor-default"
      >
        <motion.div
          key={dark ? "sun" : "moon"}
          initial={{ scale: 0, rotate: -180, opacity: 0 }}
          animate={{ scale: 1, rotate: 0, opacity: 1 }}
          exit={{ scale: 0, rotate: 180, opacity: 0 }}
          transition={{ type: "spring", stiffness: 250, damping: 15 }}
        >
          {dark ? (
            <IconSun className="size-6 text-foreground" />
          ) : (
            <IconMoon className="size-6 text-foreground" />
          )}
        </motion.div>
      </motion.button>
    </div>
  );
};
