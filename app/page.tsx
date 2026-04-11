import Image from "next/image";
import Link from "next/link";
import { Github, Linkedin, Twitter } from "lucide-react";
import HomeCTA from "@/components/HomeCTA";
import HeroText from "@/components/HeroText";
import { SITE_CONFIG } from "@/lib/data";
import type { Metadata } from "next";
import ArchitectureGraph from "@/components/ArchitectureGraph";

export const metadata: Metadata = {
  title: `${SITE_CONFIG.name} — ${SITE_CONFIG.title}`,
};

export default function HomePage() {
  return (
    <section className="min-h-[100dvh] flex items-center pt-20 pb-8 md:pt-8 relative">
      <div className="max-w-6xl mx-auto px-6 py-8 grid md:grid-cols-2 gap-16 items-center w-full">
        {/* Text */}
        <div className="stagger-children">
          <HeroText fullName={SITE_CONFIG.fullName} />
          <p className="font-display text-xl md:text-2xl text-text-secondary italic mb-4 leading-snug">
            # {SITE_CONFIG.title}
          </p>
          <p className="text-text-secondary text-base leading-relaxed max-w-md mb-4">
            {SITE_CONFIG.tagline}
          </p>
          <HomeCTA resumeUrl={SITE_CONFIG.resumeUrl} />

          {/* Socials */}
          <div className="flex items-center gap-5 mt-6">
            {[
              { icon: Github, href: SITE_CONFIG.github, label: "GitHub" },
              { icon: Linkedin, href: SITE_CONFIG.linkedin, label: "LinkedIn" },
              { icon: Twitter, href: SITE_CONFIG.twitter, label: "Twitter" },
            ].map(({ icon: Icon, href, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="text-text-muted hover:text-[#00E676] transition-colors duration-200"
              >
                <Icon size={18} />
              </a>
            ))}
            <span className="text-border-light text-sm">|</span>
            <span className="font-mono text-xs text-text-muted">
              {SITE_CONFIG.location}
            </span>
          </div>
        </div>

        {/* Architecture Graph */}
        <div className="flex justify-center">
          <ArchitectureGraph />
        </div>
      </div>
    </section>
  );
}
