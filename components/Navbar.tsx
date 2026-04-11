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

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => { setMobileOpen(false); }, [pathname]);

  useEffect(() => {
    for (const link of NAV_LINKS) {
      if (link.href !== pathname) router.prefetch(link.href);
    }
  }, [pathname, router]);

  return (
    <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-bg/90 backdrop-blur-md border-b border-border"
            : "bg-transparent"
        }`}
      >
        <nav className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link
            href="/"
            className="font-display text-3xl md:text-4xl font-semibold tracking-wide text-text-primary hover:text-[#00E676] transition-colors duration-300 group"
          >
            secT<span className="text-[#00E676] group-hover:text-white transition-colors duration-300">.</span>
          </Link>

          {/* Desktop nav */}
          <ul className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => {
              const isActive = link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    prefetch
                    className={`relative px-3 py-1.5 text-base font-ui font-medium transition-all duration-200 rounded-sm group ${
                      isActive ? "text-[#00E676]" : "text-text-secondary hover:text-text-primary"
                    }`}
                  >
                    <span className={`absolute bottom-0 left-3 right-3 h-px bg-[#00E676] transition-all duration-300 ${
                      isActive ? "opacity-100 scale-x-100" : "opacity-0 scale-x-0 group-hover:opacity-40 group-hover:scale-x-100"
                    }`} style={{transformOrigin:"left"}} />
                    {link.label}
                  </Link>
                </li>
              );
            })}

          </ul>

          {/* Mobile toggle */}
          <button
            className="md:hidden text-text-secondary hover:text-text-primary transition-colors"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </nav>

        {/* Mobile menu */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 border-b border-border ${
            mobileOpen ? "max-h-96 bg-bg/95 backdrop-blur-md" : "max-h-0"
          }`}
        >
          <ul className="px-6 py-4 flex flex-col gap-1">
            {NAV_LINKS.map((link) => {
              const isActive = link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    prefetch
                    className={`block py-2.5 text-base font-ui font-medium border-b border-border/50 last:border-none transition-colors duration-200 ${
                      isActive ? "text-[#00E676]" : "text-text-secondary hover:text-text-primary"
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
