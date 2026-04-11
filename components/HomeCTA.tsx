"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Download } from "lucide-react";

export default function HomeCTA({ resumeUrl }: { resumeUrl: string }) {
  const [resumeHovered, setResumeHovered] = useState(false);

  return (
    <div className="flex flex-wrap items-center gap-4">
      <Link
        href="/contact"
        className={`group inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold rounded-sm transition-all duration-200 ${
          resumeHovered
            ? "border border-transparent text-[#00E676]"
            : "border border-[#00E676] text-[#00E676] hover:bg-[#00E676]/10"
        }`}
      >
        Hire me
        <ArrowRight
          size={15}
          className="group-hover:translate-x-1 transition-transform"
        />
      </Link>
      <a
        href={resumeUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 border border-border-light text-text-secondary px-6 py-3 text-sm font-semibold rounded-sm hover:border-[#00E676] hover:text-[#00E676] transition-all duration-200"
        onMouseEnter={() => setResumeHovered(true)}
        onMouseLeave={() => setResumeHovered(false)}
      >
        <Download size={14} />
        Get Resume
      </a>
    </div>
  );
}
