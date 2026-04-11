"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function AboutCTA() {
  const [touchHovered, setTouchHovered] = useState(false);

  return (
    <div className="mt-8 flex flex-wrap gap-4">
      <Link
        href="/resume"
        className={`group inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold rounded-sm transition-all ${
          touchHovered
            ? "border border-transparent text-[#00E676]"
            : "border border-[#00E676] text-[#00E676] hover:bg-[#00E676]/10"
        }`}
      >
        View Resume
        <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
      </Link>
      <Link
        href="/contact"
        className="inline-flex items-center gap-2 border border-border-light text-text-secondary px-6 py-3 text-sm hover:border-[#00E676] hover:text-[#00E676] transition-all rounded-sm"
        onMouseEnter={() => setTouchHovered(true)}
        onMouseLeave={() => setTouchHovered(false)}
      >
        Get in touch
      </Link>
    </div>
  );
}
