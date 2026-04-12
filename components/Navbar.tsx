"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { NAV_LINKS } from "@/lib/data";
export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const disableShrink = pathname === "/contact";

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isShrunk = scrolled && !disableShrink;

  useEffect(() => { setMobileOpen(false); }, [pathname]);

  useEffect(() => {
    for (const link of NAV_LINKS) {
      if (link.href !== pathname) router.prefetch(link.href);
    }
  }, [pathname, router]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 backdrop-blur-2xl border-b border-zinc-800/50 transition-all duration-300 ${
        scrolled ? "bg-[#0a0a0a]/75" : "bg-[#0a0a0a]/50"
      }`}
    >
      <nav className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo — arch-style prompt */}
        <Link
          href="/"
          className="font-mono text-lg font-bold text-white transition-colors duration-150 tracking-tight"
        >
          secT
        </Link>

        {/* Desktop nav */}
        <ul className="hidden md:flex items-center gap-2">
          {NAV_LINKS.map((link) => {
            const isActive = link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  prefetch
                  className={`font-mono text-sm tracking-wide uppercase transition-colors duration-150 px-3 py-1.5 ${
                    isActive
                      ? "text-white"
                      : "text-zinc-500 hover:text-zinc-200"
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Mobile toggle */}
        <button
          className="md:hidden font-mono text-base text-zinc-500 hover:text-[#00E676] transition-colors"
          onClick={() => setMobileOpen((prev) => !prev)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? "[ close ]" : "[ menu ]"}
        </button>
      </nav>

      {/* Mobile menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-200 border-t border-zinc-800/60 ${
          mobileOpen ? "max-h-64 bg-[#0a0a0a]" : "max-h-0"
        }`}
      >
        <ul className="px-6 py-3 flex flex-col gap-0.5">
          {NAV_LINKS.map((link) => {
            const isActive = link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  prefetch
                  className={`block font-mono text-sm tracking-wide uppercase py-2.5 border-b border-zinc-800/40 last:border-none transition-colors duration-150 ${
                    isActive ? "text-white" : "text-zinc-500 hover:text-zinc-200"
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </header>
  );
}
