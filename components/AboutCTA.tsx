"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function AboutCTA() {
  const [touchHovered, setTouchHovered] = useState(false);

  return (
    <div className="mt-8 flex flex-wrap gap-4">
      {/* View Resume — border wipes right→left on Get in touch hover */}
      <Link
        href="/resume"
        className="group relative inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold rounded-sm text-[#ffffff] hover:bg-[#ffffff]/10 transition-colors duration-200"
      >
        <span
          className="pointer-events-none absolute inset-0 rounded-sm border border-[#ffffff]"
          style={{
            transformOrigin: "right",
            transform: touchHovered ? "scaleX(0)" : "scaleX(1)",
            transition: "transform 0.35s cubic-bezier(0.4,0,0.2,1)",
          }}
        />
        View Resume
        <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
      </Link>

      {/* Get in touch — border wipes left→right on hover */}
      <Link
        href="/contact"
        className="relative inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold rounded-sm text-text-secondary hover:text-[#ffffff] transition-colors duration-200"
        onMouseEnter={() => setTouchHovered(true)}
        onMouseLeave={() => setTouchHovered(false)}
      >
        <span className="pointer-events-none absolute inset-0 rounded-sm border border-border-light" />
        <span
          className="pointer-events-none absolute inset-0 rounded-sm border border-[#ffffff]"
          style={{
            transformOrigin: "left",
            transform: touchHovered ? "scaleX(1)" : "scaleX(0)",
            transition: "transform 0.35s cubic-bezier(0.4,0,0.2,1)",
          }}
        />
        Get in touch
      </Link>
    </div>
  );
}



