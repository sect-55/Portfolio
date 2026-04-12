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
    <section className="min-h-[100dvh] flex items-center pt-20 pb-10 md:pt-8 relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 md:py-8 grid md:grid-cols-2 gap-8 md:gap-16 items-center w-full">
        {/* Text */}
        <div className="stagger-children">
          <HeroText fullName={SITE_CONFIG.fullName} />
          <p className="font-display text-2xl md:text-3xl text-text-secondary italic mb-4 leading-snug">
            # {SITE_CONFIG.title}
          </p>
          <p className="text-text-secondary text-lg leading-relaxed max-w-md mb-6">
            {SITE_CONFIG.tagline}
          </p>
          <HomeCTA resumeUrl={SITE_CONFIG.resumeUrl} />

          {/* Socials */}
          <div className="flex items-center gap-4 mt-7">
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
                className="w-8 h-8 flex items-center justify-center rounded-sm border border-white/[0.06] text-text-muted hover:border-[#00E676]/40 hover:text-[#00E676] transition-all duration-200"
              >
                <Icon size={15} />
              </a>
            ))}
          </div>
        </div>

        {/* Architecture Graph */}
        <div className="hidden md:flex justify-center mt-8">
          <ArchitectureGraph />
        </div>
      </div>
    </section>
  );
}
