import Link from "next/link";
import { Download, ArrowRight, Briefcase, GraduationCap } from "lucide-react";
import ResumeCTA from "@/components/ResumeCTA";
import { SITE_CONFIG, EXPERIENCES, SKILLS } from "@/lib/data";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Resume",
  description: `Professional resume of ${SITE_CONFIG.fullName}.`,
};

export default function ResumePage() {
  return (
    <div className="pt-24 pb-20">
      <div className="max-w-4xl mx-auto px-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-16" style={{animation:"fadeUp 0.6s ease forwards",opacity:0}}>
          <div>
            <p className="font-mono text-xs text-[#00E676] tracking-[0.25em] uppercase mb-4">
              Resume
            </p>
            <h1 className="font-display text-3xl sm:text-4xl md:text-6xl font-semibold text-text-primary leading-tight">
              Experience &<br />
              <span className="text-text-secondary italic">Qualifications</span>
            </h1>
          </div>
          <a
            href={SITE_CONFIG.resumeUrl}
            target="_blank"
            rel="noopener noreferrer"
            download
            className="inline-flex items-center gap-2 border border-[#00E676] text-[#00E676] px-5 py-2.5 text-sm font-semibold rounded-sm hover:bg-[#00E676]/10 transition-all self-start sm:self-auto"
          >
            <Download size={14} />
            Download PDF
          </a>
        </div>

        {/* Work Experience */}
        <section className="mb-16" style={{animation:"fadeUp 0.6s ease forwards",animationDelay:"0.15s",opacity:0}}>
          <div className="flex items-center gap-3 mb-8">
            <Briefcase size={16} className="text-[#00E676]" />
            <h2 className="font-mono text-xs text-text-muted uppercase tracking-widest">
              Work Experience
            </h2>
          </div>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-0 top-2 bottom-2 w-px bg-border" />

            <div className="space-y-10 pl-8">
              {EXPERIENCES.map((exp, i) => (
                <div key={exp.company + exp.role} className="relative" style={{animation:"fadeUp 0.5s ease forwards",animationDelay:`${0.2 + i * 0.1}s`,opacity:0}}>
                  {/* Dot */}
                  <div
                    className={`absolute -left-8 top-1.5 w-2.5 h-2.5 rounded-full border ${
                      exp.current
                        ? "bg-[#00E676] border-[#00E676]"
                        : "bg-bg border-border"
                    }`}
                  />
                  {exp.current && (
                    <div className="absolute -left-[34px] top-0.5 w-4 h-4 rounded-full bg-[#00E676]/20 animate-ping" />
                  )}

                  <div className="border border-border bg-surface/30 rounded-sm p-6 hover:border-[#00E676]/30 transition-colors">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 mb-4">
                      <div>
                        <h3 className="font-semibold text-text-primary">
                          {exp.company}
                        </h3>
                        <p className="text-[#00E676]/80 text-sm mt-0.5">
                          {exp.role}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        {exp.period && (
                          <span className="font-mono text-xs text-text-muted border border-border px-2 py-1 rounded-sm whitespace-nowrap">
                            {exp.period}
                          </span>
                        )}
                        {exp.current && (
                          <span className="font-mono text-xs text-[#00E676] border border-[#00E676]/30 px-2 py-1 rounded-sm">
                            {exp.statusLabel ?? "Current"}
                          </span>
                        )}
                      </div>
                    </div>
                    {exp.description.length > 0 && (
                      <ul className="space-y-1.5 mb-5">
                        {exp.description.map((d, i) => (
                          <li
                            key={i}
                            className="text-sm text-text-muted leading-relaxed flex gap-2"
                          >
                            <span className="text-[#00E676] mt-[5px] shrink-0">▸</span>
                            {d}
                          </li>
                        ))}
                      </ul>
                    )}
                    <div className="flex flex-wrap gap-1.5">
                      {exp.tech.map((t) => (
                        <span
                          key={t}
                          className="font-mono text-xs text-text-muted bg-border/50 px-2 py-0.5 rounded-sm"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Education */}
        <section className="mb-16" style={{animation:"fadeUp 0.6s ease forwards",animationDelay:"0.35s",opacity:0}}>
          <div className="flex items-center gap-3 mb-8">
            <GraduationCap size={16} className="text-[#00E676]" />
            <h2 className="font-mono text-xs text-text-muted uppercase tracking-widest">
              Education
            </h2>
          </div>
          <div className="grid gap-4">
            <div className="border border-border bg-surface/30 rounded-sm p-6">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                <div>
                  <h3 className="font-semibold text-text-primary">
                    B.Tech in Computer Science & Engineering
                  </h3>
                  <p className="text-[#00E676]/80 text-sm mt-0.5">
                    Apollo Engineering College
                  </p>
                </div>
                <span className="font-mono text-xs text-text-muted border border-border px-2 py-1 rounded-sm self-start">
                  2022-2024
                </span>
              </div>
            </div>

            <div className="border border-border bg-surface/30 rounded-sm p-6">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                <div>
                  <h3 className="font-semibold text-text-primary">
                    Diploma in Computer Science & Engineering
                  </h3>
                  <p className="text-[#00E676]/80 text-sm mt-0.5">
                    Apollo Polytechnic College
                  </p>
                </div>
                <span className="font-mono text-xs text-text-muted border border-border px-2 py-1 rounded-sm self-start">
                  2019-2022
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Skills summary */}
        <section className="mb-16" style={{animation:"fadeUp 0.6s ease forwards",animationDelay:"0.45s",opacity:0}}>
          <div className="flex items-center gap-3 mb-8">
            <span className="text-[#00E676]">⬡</span>
            <h2 className="font-mono text-xs text-text-muted uppercase tracking-widest">
              Technical Skills
            </h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {SKILLS.map((skill, i) => (
              <span
                key={skill.name}
                className="font-mono text-xs text-text-secondary border border-border px-3 py-1.5 rounded-sm hover:border-[#00E676]/40 hover:text-[#00E676] hover:scale-105 transition-all cursor-default"
                style={{animation:"fadeUp 0.4s ease forwards",animationDelay:`${0.5 + i * 0.03}s`,opacity:0}}
              >
                {skill.name}
              </span>
            ))}
          </div>
        </section>

        {/* CTA */}
        <div className="border border-[#00E676]/20 rounded-sm p-8 bg-surface/30 text-center" style={{animation:"fadeUp 0.6s ease forwards",animationDelay:"0.55s",opacity:0}}>
          <p className="text-text-secondary mb-4">
            Want the full picture? Download my resume or reach out directly.
          </p>
          <ResumeCTA resumeUrl={SITE_CONFIG.resumeUrl} />
        </div>
      </div>
    </div>
  );
}
