import Link from "next/link";
import { Github, Linkedin, Twitter, Heart } from "lucide-react";
import { SITE_CONFIG, NAV_LINKS } from "@/lib/data";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-border mt-24">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
          {/* Brand */}
          <div>
            <Link
              href="/"
              className="font-display text-2xl font-semibold text-text-primary hover:text-accent transition-colors"
            >
              {SITE_CONFIG.name}<span className="text-accent">.</span>
            </Link>
          </div>

          {/* Links */}
          <div>
            <p className="text-xs font-mono text-text-muted uppercase tracking-widest mb-4">
              Navigation
            </p>
            <ul className="space-y-2">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-text-secondary hover:text-accent transition-colors underline-anim"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <p className="text-xs font-mono text-text-muted uppercase tracking-widest mb-4">
              Connect
            </p>
            <div className="flex gap-4 mb-4">
              <a
                href={SITE_CONFIG.github}
                target="_blank"
                rel="noopener noreferrer"
                className="text-text-muted hover:text-accent transition-colors"
                aria-label="GitHub"
              >
                <Github size={18} />
              </a>
              <a
                href={SITE_CONFIG.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-text-muted hover:text-accent transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin size={18} />
              </a>
              <a
                href={SITE_CONFIG.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="text-text-muted hover:text-accent transition-colors"
                aria-label="Twitter"
              >
                <Twitter size={18} />
              </a>
            </div>
            <a
              href={`mailto:${SITE_CONFIG.email}`}
              className="text-sm text-text-secondary hover:text-accent transition-colors underline-anim"
            >
              {SITE_CONFIG.email}
            </a>
          </div>
        </div>

        <div className="border-t border-border pt-6 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-text-muted">
            © {year} {SITE_CONFIG.fullName}. All rights reserved.
          </p>
          <p className="text-xs text-text-muted flex items-center gap-1.5">
            Made with{" "}
            <Heart size={11} className="text-red-500 fill-red-500" />{" "}
            and{" "}
            <a
              href="https://cursor.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-accent transition-colors"
            >
              Cursor
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
