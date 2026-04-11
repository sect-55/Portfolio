"use client";

import { useState } from "react";
import Link from "next/link";
import { Download, ArrowRight } from "lucide-react";

export default function ResumeCTA({ resumeUrl }: { resumeUrl: string }) {
  const [projectsHovered, setProjectsHovered] = useState(false);

  return (
    <div className="flex flex-wrap gap-4 justify-center">
      <a
        href={resumeUrl}
        target="_blank"
        rel="noopener noreferrer"
        download
        className={`inline-flex items-center gap-2 px-6 py-2.5 text-sm font-semibold rounded-sm transition-all ${
          projectsHovered
            ? "border border-transparent text-[#00E676]"
            : "border border-[#00E676] text-[#00E676] hover:bg-[#00E676]/10"
        }`}
      >
        <Download size={14} /> Download Resume
      </a>
      <Link
        href="/projects"
        className="inline-flex items-center gap-2 border border-border-light text-text-secondary px-6 py-2.5 text-sm hover:border-[#00E676] hover:text-[#00E676] transition-all rounded-sm"
        onMouseEnter={() => setProjectsHovered(true)}
        onMouseLeave={() => setProjectsHovered(false)}
      >
        Projects <ArrowRight size={14} />
      </Link>
    </div>
  );
}
