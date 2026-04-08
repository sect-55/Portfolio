import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SITE_CONFIG, SKILLS } from "@/lib/data";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Me",
  description: `Learn more about ${SITE_CONFIG.fullName} — ${SITE_CONFIG.title}.`,
};

export default function AboutPage() {
  const conciseSkills = SKILLS.slice(0, 10);

  return (
    <div className="pt-20 pb-8">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="mb-8">
          <p className="font-mono text-xs text-accent tracking-[0.25em] uppercase mb-4">
            About me
          </p>
          <h1 className="font-display text-5xl md:text-6xl font-semibold text-text-primary leading-tight">
            Backend-focused.<br />
            <span className="text-text-secondary italic">Systems-minded.</span>
          </h1>
        </div>

        <div className="grid md:grid-cols-[1.5fr_1fr] gap-10 items-start min-h-[calc(100vh-180px)]">
          <div className="prose-dark">
              <h2>Hey there 👋</h2>
              <p>
                I&apos;m Sudharsan - an early-stage backend-focused engineer
                building production-ready systems with a strong emphasis on correctness,
                performance, and reliability.
              </p>
              <p>
                My sweet spot sits at the intersection of backend engineering and system
                design - I focus on how systems behave under real-world conditions, not
                just how they work in theory. I care deeply about developer experience,
                clean architecture, and building systems that don&apos;t break under load.
              </p>
              <p>
                I&apos;ve been actively building and shipping systems around authentication,
                rate limiting, caching, and containerized services - with a focus on
                understanding concurrency, latency, and failure handling at a practical
                level.
              </p>
              <p>
                I build in public, document what I learn, and keep refining how I design
                systems that scale and survive.
              </p>
            <div className="mt-8 flex gap-4">
              <Link
                href="/resume"
                className="group inline-flex items-center gap-2 bg-accent text-bg px-6 py-3 text-sm font-semibold rounded-sm hover:bg-accent/90 transition-all"
              >
                View Resume
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 border border-border-light text-text-secondary px-6 py-3 text-sm hover:border-accent hover:text-accent transition-all rounded-sm"
              >
                Get in touch
              </Link>
            </div>
          </div>

          <aside className="border border-border rounded-sm p-6 bg-surface/30">
            <p className="font-mono text-xs text-text-muted uppercase tracking-widest mb-4">
              Technical Skills
            </p>
            <div className="flex flex-wrap gap-2">
              {conciseSkills.map((skill) => (
                <span
                  key={skill.name}
                  className="font-mono text-xs text-text-secondary border border-border px-3 py-1.5 rounded-sm hover:border-accent/40 hover:text-accent transition-all cursor-default"
                >
                  {skill.name}
                </span>
              ))}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
