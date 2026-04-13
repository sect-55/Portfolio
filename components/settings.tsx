"use client";
import { IconMoon, IconSun } from "@tabler/icons-react";
import { motion } from "motion/react";
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

  const toggle = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem(STORAGE_KEY, next ? "dark" : "light");
  };

  return (
    <motion.button
      onClick={toggle}
      whileTap={{ scale: 0.85 }}
      whileHover={{ scale: 1.15 }}
      initial={{ opacity: 0, rotate: -90 }}
      animate={{ opacity: 1, rotate: 0 }}
      transition={{ type: "spring", stiffness: 200, damping: 10 }}
      className="fixed top-5 right-5 z-50 flex size-10 items-center justify-center"
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
  );
};
