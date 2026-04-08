import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Download, Github, Linkedin, Twitter } from "lucide-react";
import { SITE_CONFIG } from "@/lib/data";
import type { Metadata } from "next";
import profileImage from "@/public/img.jpg";

export const metadata: Metadata = {
  title: `${SITE_CONFIG.name} — ${SITE_CONFIG.title}`,
};

export default function HomePage() {
  return (
    <section className="min-h-screen flex items-center pt-16 relative overflow-hidden">
      {/* Background grid */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(#c9a96e 1px, transparent 1px), linear-gradient(90deg, #c9a96e 1px, transparent 1px)",
          backgroundSize: "80px 80px",
        }}
      />
      {/* Ambient glow */}
      <div className="absolute top-1/4 right-1/4 w-[600px] h-[600px] rounded-full bg-accent/5 blur-[120px] pointer-events-none" />
      <div className="max-w-6xl mx-auto px-6 py-20 grid md:grid-cols-2 gap-16 items-center w-full">
        {/* Text */}
        <div className="stagger-children">
          <p className="font-mono text-xs text-accent tracking-[0.25em] uppercase mb-6">
            Hello, I&apos;m
          </p>
          <h1 className="font-display text-6xl md:text-7xl lg:text-8xl font-semibold leading-[0.95] tracking-tight text-text-primary mb-6">
            {SITE_CONFIG.fullName}
          </h1>
          <p className="font-display text-xl md:text-2xl text-text-secondary italic mb-6 leading-snug">
            # {SITE_CONFIG.title}
          </p>
          <p className="text-text-secondary text-base leading-relaxed max-w-md mb-10">
            {SITE_CONFIG.tagline}
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <Link
              href="/contact"
              className="group inline-flex items-center gap-2 bg-accent text-bg px-6 py-3 text-sm font-semibold rounded-sm hover:bg-accent/90 transition-all duration-200"
            >
              Hire me
              <ArrowRight
                size={15}
                className="group-hover:translate-x-1 transition-transform"
              />
            </Link>
            <a
              href={SITE_CONFIG.resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 border border-border-light text-text-secondary px-6 py-3 text-sm font-semibold rounded-sm hover:border-accent hover:text-accent transition-all duration-200"
            >
              <Download size={14} />
              Get Resume
            </a>
          </div>

          {/* Socials */}
          <div className="flex items-center gap-5 mt-10">
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
                className="text-text-muted hover:text-accent transition-colors duration-200"
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

        {/* Photo */}
        <div className="hidden md:flex justify-end">
          <div className="relative w-72 h-80 lg:w-80 lg:h-96 rounded-sm overflow-hidden border-[4px] border-accent">
            <Image
              src={profileImage}
              alt={SITE_CONFIG.fullName}
              fill
              sizes="(max-width: 1024px) 288px, 320px"
              quality={75}
              placeholder="blur"
              className="object-cover"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
}
