"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { DottedUnderline } from "./dotted-underline";
import { motion, AnimatePresence } from "motion/react";

function isActivePath(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

const links = [
  { title: "Home", href: "/" },
  { title: "Resume", href: "/resume" },
  { title: "Favorites", href: "/inspiration" },
];

export const Navbar = () => {
  const pathname = usePathname();

  return (
    <nav className="mx-auto flex max-w-2xl flex-col items-start gap-4 px-4 pt-4 md:pt-8">
      <div className="flex items-center gap-2">
        <h1 className="text-foreground text-xl font-medium tracking-tight md:text-2xl">
          Sudharsan
        </h1>
      </div>
      <div className="flex items-center gap-4">
        {links.map((link) => {
          const active = isActivePath(pathname, link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "group relative transition-colors",
                active
                  ? "text-primary"
                  : "text-foreground/70 hover:text-primary",
              )}
            >
              {link.title}
              <DottedUnderline
                className={cn(
                  "mask-x-from-90% transition-opacity duration-300",
                  active
                    ? "opacity-100"
                    : "opacity-0 group-hover:opacity-100",
                )}
              />
            </Link>
          );
        })}
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
              Download
            </motion.a>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};
