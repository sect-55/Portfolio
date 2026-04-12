"use client";

import { useState } from "react";
import Link from "next/link";
import { Download, ArrowRight } from "lucide-react";

export default function ResumeCTA({ resumeUrl }: { resumeUrl: string }) {
  const [projectsHovered, setProjectsHovered] = useState(false);

  return (
    <div className="flex flex-wrap gap-4 justify-center">
      {/* Download Resume — border wipes right→left on Projects hover */}
      <a
        href={resumeUrl}
        target="_blank"
        rel="noopener noreferrer"
        download
        className="relative inline-flex items-center gap-2 px-6 py-2.5 text-sm font-semibold rounded-sm text-[#ffffff] hover:bg-[#ffffff]/10 transition-colors duration-200"
      >
        <span
          className="pointer-events-none absolute inset-0 rounded-sm border border-[#ffffff]"
          style={{
            transformOrigin: "right",
            transform: projectsHovered ? "scaleX(0)" : "scaleX(1)",
            transition: "transform 0.35s cubic-bezier(0.4,0,0.2,1)",
          }}
        />
        <Download size={14} /> Download Resume
      </a>

      {/* Projects — border wipes left→right on hover, arrow animates */}
      <Link
        href="/projects"
        className="group relative inline-flex items-center gap-2 px-6 py-2.5 text-sm font-semibold rounded-sm text-text-secondary hover:text-[#ffffff] transition-colors duration-200"
        onMouseEnter={() => setProjectsHovered(true)}
        onMouseLeave={() => setProjectsHovered(false)}
      >
        <span className="pointer-events-none absolute inset-0 rounded-sm border border-border-light" />
        <span
          className="pointer-events-none absolute inset-0 rounded-sm border border-[#ffffff]"
          style={{
            transformOrigin: "left",
            transform: projectsHovered ? "scaleX(1)" : "scaleX(0)",
            transition: "transform 0.35s cubic-bezier(0.4,0,0.2,1)",
          }}
        />
        Projects
        <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform duration-200" />
      </Link>
    </div>
  );
}



