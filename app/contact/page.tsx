"use client";

import { useState, FormEvent } from "react";
import { Send, Github, Linkedin, Twitter, MapPin, Mail, AlertCircle } from "lucide-react";
import { SITE_CONFIG } from "@/lib/data";
import type { ContactFormData } from "@/types";

type FormStatus = "idle" | "loading" | "error";

export default function ContactPage() {
  const [form, setForm] = useState<ContactFormData>({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [status, setStatus] = useState<FormStatus>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        setStatus("idle");
        setForm({ name: "", email: "", subject: "", message: "" });
      } else {
        setStatus("error");
        setErrorMsg(data.message || "Something went wrong. Please try again.");
      }
    } catch {
      setStatus("error");
      setErrorMsg("Network error. Please try again.");
    }
  };

  return (
    <div className="pt-24 pb-20">
      <div className="max-w-5xl mx-auto px-6">
        {/* Header */}
        <div className="mb-10 sm:mb-16" style={{animation:"fadeUp 0.6s ease forwards",opacity:0}}>
          <p className="font-mono text-xs text-[#00E676] tracking-[0.25em] uppercase mb-4">
            Contact
          </p>
          <h1 className="font-display text-3xl sm:text-4xl md:text-6xl font-semibold text-text-primary leading-tight">
            Get in touch
          </h1>
          <p className="text-text-muted text-sm mt-6 max-w-lg leading-relaxed">
            Have a project in mind, a job opportunity, or just want to talk
            fullstack engineer? I&apos;m always happy to hear from people.
          </p>
        </div>

        <div className="grid md:grid-cols-[1fr_1.6fr] gap-12">
          {/* Info panel */}
          <div style={{animation:"fadeUp 0.6s ease forwards",animationDelay:"0.15s",opacity:0}}>
            <div className="space-y-6 mb-10">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-sm bg-surface/30 border border-[#00E676]/20 flex items-center justify-center shrink-0 mt-0.5">
                  <Mail size={15} className="text-[#00E676]" />
                </div>
                <div>
                  <p className="text-xs text-text-muted mb-0.5">Email</p>
                  <a
                    href={`mailto:${SITE_CONFIG.email}`}
                    className="text-sm text-text-primary hover:text-[#00E676] transition-colors"
                  >
                    {SITE_CONFIG.email}
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-sm bg-surface/30 border border-[#00E676]/20 flex items-center justify-center shrink-0 mt-0.5">
                  <MapPin size={15} className="text-[#00E676]" />
                </div>
                <div>
                  <p className="text-xs text-text-muted mb-0.5">Location</p>
                  <p className="text-sm text-text-primary">{SITE_CONFIG.location}</p>
                </div>
              </div>
            </div>

            <div className="border-t border-border pt-8">
              <p className="font-mono text-xs text-text-muted uppercase tracking-widest mb-5">
                Social
              </p>
              <div className="flex gap-4">
                {[
                  { icon: Github, href: SITE_CONFIG.github, label: "GitHub" },
                  { icon: Linkedin, href: SITE_CONFIG.linkedin, label: "LinkedIn" },
                  { icon: Twitter, href: SITE_CONFIG.twitter, label: "Twitter" },
                ].map(({ icon: Icon, href, label }, i) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="w-10 h-10 rounded-sm border border-border flex items-center justify-center text-text-muted hover:border-[#00E676] hover:text-[#00E676] hover:scale-110 transition-all"
                    style={{animation:"fadeUp 0.4s ease forwards",animationDelay:`${0.3 + i * 0.07}s`,opacity:0}}
                  >
                    <Icon size={16} />
                  </a>
                ))}
              </div>
            </div>

            <div className="mt-10 border border-border bg-surface/30 rounded-sm p-6" style={{animation:"fadeUp 0.5s ease forwards",animationDelay:"0.4s",opacity:0}}>
              <p className="font-mono text-xs text-[#00E676] mb-2">Availability</p>
              <p className="text-sm text-text-muted leading-relaxed">
                Currently open to full-time backend / systems roles and
                fast-paced, real-world building environments.
              </p>
            </div>
          </div>

          {/* Form */}
          <div style={{animation:"fadeUp 0.6s ease forwards",animationDelay:"0.2s",opacity:0}}>
            <form
              onSubmit={handleSubmit}
              className="space-y-5"
              noValidate
            >
                <div className="grid sm:grid-cols-2 gap-5" style={{animation:"fadeUp 0.4s ease forwards",animationDelay:"0.25s",opacity:0}}>
                  <div>
                    <label
                      htmlFor="name"
                      className="block font-mono text-xs text-text-muted mb-2"
                    >
                      Name *
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      required
                      value={form.name}
                      onChange={handleChange}
                      placeholder="Your name"
                      className="w-full bg-surface border border-border rounded-sm px-4 py-3 text-sm text-text-primary placeholder-text-muted focus:outline-none focus:border-[#00E676] transition-colors"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="email"
                      className="block font-mono text-xs text-text-muted mb-2"
                    >
                      Email *
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={form.email}
                      onChange={handleChange}
                      placeholder="your@email.com"
                      className="w-full bg-surface border border-border rounded-sm px-4 py-3 text-sm text-text-primary placeholder-text-muted focus:outline-none focus:border-[#00E676] transition-colors"
                    />
                  </div>
                </div>

                <div style={{animation:"fadeUp 0.4s ease forwards",animationDelay:"0.3s",opacity:0}}>
                  <label
                    htmlFor="subject"
                    className="block font-mono text-xs text-text-muted mb-2"
                  >
                    Subject *
                  </label>
                  <input
                    id="subject"
                    name="subject"
                    type="text"
                    required
                    value={form.subject}
                    onChange={handleChange}
                    placeholder="What's this about?"
                    className="w-full bg-surface border border-border rounded-sm px-4 py-3 text-sm text-text-primary placeholder-text-muted focus:outline-none focus:border-[#00E676] transition-colors"
                  />
                </div>

                <div style={{animation:"fadeUp 0.4s ease forwards",animationDelay:"0.35s",opacity:0}}>
                  <label
                    htmlFor="message"
                    className="block font-mono text-xs text-text-muted mb-2"
                  >
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={7}
                    value={form.message}
                    onChange={handleChange}
                    placeholder="Tell me what you have in mind..."
                    className="w-full bg-surface border border-border rounded-sm px-4 py-3 text-sm text-text-primary placeholder-text-muted focus:outline-none focus:border-[#00E676] transition-colors resize-none"
                  />
                </div>

                {status === "error" && (
                  <div className="flex items-center gap-2 text-red-400 text-xs border border-red-900/40 bg-red-900/10 rounded-sm px-3 py-2">
                    <AlertCircle size={13} />
                    {errorMsg}
                  </div>
                )}

              <button
                type="submit"
                disabled={status === "loading"}
                className="w-full group inline-flex items-center justify-center gap-2 border border-[#00E676] text-[#00E676] py-3.5 text-sm font-semibold rounded-sm hover:bg-[#00E676]/10 hover:scale-[1.02] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                style={{animation:"fadeUp 0.4s ease forwards",animationDelay:"0.4s",opacity:0}}
              >
                {status === "loading" ? (
                  <>
                    <span className="w-4 h-4 border-2 border-[#00E676]/30 border-t-[#00E676] rounded-full animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send size={14} className="group-hover:translate-x-0.5 transition-transform" />
                    Submit
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
