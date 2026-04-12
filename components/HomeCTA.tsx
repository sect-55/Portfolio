"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Download } from "lucide-react";

export default function HomeCTA({ resumeUrl }: { resumeUrl: string }) {
  const [resumeHovered, setResumeHovered] = useState(false);

  return (
    <div className="flex flex-wrap items-center gap-4">
      {/* Hire me — border wipes right→left on resume hover */}
      <Link
        href="/contact"
        className="group relative inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold rounded-sm text-[#ffffff] hover:bg-[#ffffff]/10 transition-colors duration-200"
      >
        {/* Animated border layer */}
        <span
          className="pointer-events-none absolute inset-0 rounded-sm border border-[#ffffff]"
          style={{
            transformOrigin: "right",
            transform: resumeHovered ? "scaleX(0)" : "scaleX(1)",
            transition: "transform 0.35s cubic-bezier(0.4,0,0.2,1)",
          }}
        />
        Hire me
        <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
      </Link>

      {/* Get Resume — border wipes left→right on resume hover */}
      <a
        href={resumeUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="relative inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold rounded-sm text-text-secondary hover:text-[#ffffff] transition-colors duration-200"
        onMouseEnter={() => setResumeHovered(true)}
        onMouseLeave={() => setResumeHovered(false)}
      >
        {/* Static dim border always visible */}
        <span className="pointer-events-none absolute inset-0 rounded-sm border border-border-light" />
        {/* Animated green border layer */}
        <span
          className="pointer-events-none absolute inset-0 rounded-sm border border-[#ffffff]"
          style={{
            transformOrigin: "left",
            transform: resumeHovered ? "scaleX(1)" : "scaleX(0)",
            transition: "transform 0.35s cubic-bezier(0.4,0,0.2,1)",
          }}
        />
        <Download size={14} />
        Get Resume
      </a>
    </div>
  );
}



