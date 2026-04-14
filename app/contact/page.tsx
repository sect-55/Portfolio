"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import Container from "@/components/container";
import { Subheading } from "@/components/subheading";
import { DottedSeparator } from "@/components/separator";
import { cn } from "@/lib/utils";

const VoiceNote = dynamic(() => import("@/components/VoiceNote"), { ssr: false });

const inputClass =
  "w-full rounded-lg border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm text-foreground placeholder:text-foreground/30 outline-none transition-colors focus:border-neutral-400 dark:border-neutral-700 dark:bg-neutral-900 dark:focus:border-neutral-500 resize-none";

export default function ContactPage() {
  const [mode, setMode] = useState<"form" | "voice">("form");
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading"); setErrorMsg("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: form.name, email: form.email, message: form.message }),
      });
      const data = await res.json();
      if (!res.ok) { setErrorMsg(data.error || "Something went wrong."); setStatus("error"); return; }
      setStatus("success");
    } catch { setErrorMsg("Network error. Please try again."); setStatus("error"); }
  };

  const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm(f => ({ ...f, [field]: e.target.value }));

  return (
    <>
      <Container className="mt-6">
        <div className="flex flex-col gap-10 md:flex-row md:gap-12">

          {/* Left: headline + links */}
          <div className="flex flex-col gap-6 md:w-1/2">
            <div>
              <Subheading>Contact</Subheading>
              <h1 className="mt-3 text-5xl font-bold tracking-tight leading-[0.95] text-foreground md:text-6xl">
                just<br />send it.
              </h1>
              <p className="mt-4 text-sm text-foreground/60 italic">
                Let&apos;s make something amazing, together.
              </p>
            </div>

          </div>

          {/* Divider (desktop only) */}
          <div className="hidden md:block w-px bg-border self-stretch" />

          {/* Right: toggle + form / voice */}
          <div className="flex flex-col gap-6 md:w-1/2">

            {/* Toggle */}
            <div className="flex items-center self-start gap-3">
              {(["form", "voice"] as const).map(m => (
                <button
                  key={m}
                  onClick={() => setMode(m)}
                  className={cn(
                    "flex items-center gap-1.5 text-sm transition-colors",
                    mode === m
                      ? "text-primary font-medium"
                      : "text-foreground/40 hover:text-foreground/70"
                  )}
                >
                  <span>{m === "voice" ? "🎙" : "✏️"}</span>
                  {m === "voice" ? "Voice note" : "Text form"}
                </button>
              ))}
            </div>

            {/* Form */}
            {mode === "form" && (
              status === "success" ? (
                <div className="flex flex-col gap-4">
                  <div className="flex size-12 items-center justify-center rounded-full border border-border text-lg">✓</div>
                  <h2 className="text-3xl font-bold tracking-tight leading-tight text-foreground">
                    Message<br />sent.
                  </h2>
                  <p className="text-sm text-foreground/60 leading-relaxed">I&apos;ll get back to you within 24–48 hours.</p>
                  <button
                    onClick={() => { setStatus("idle"); setForm({ name: "", email: "", message: "" }); }}
                    className="w-fit rounded-full border border-border px-5 py-2 text-sm text-foreground/60 hover:text-foreground transition-colors"
                  >
                    Send another
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-mono uppercase tracking-wide text-foreground/40" htmlFor="cp-name">Full Name</label>
                    <input id="cp-name" type="text" required className={inputClass} placeholder="Sudharsan" value={form.name} onChange={set("name")} />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-mono uppercase tracking-wide text-foreground/40" htmlFor="cp-email">Email Address</label>
                    <input id="cp-email" type="email" required className={inputClass} placeholder="sudharsan24@zohomail.in" value={form.email} onChange={set("email")} />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-mono uppercase tracking-wide text-foreground/40" htmlFor="cp-message">Tell me about your project</label>
                    <textarea id="cp-message" required rows={5} className={inputClass} placeholder="I'm looking to build..." value={form.message} onChange={set("message")} />
                  </div>
                  {(status === "error" || errorMsg) && (
                    <p className="text-xs text-red-500">{errorMsg}</p>
                  )}
                  <div className="flex items-center gap-4 mt-1">
                    <button
                      type="submit"
                      disabled={status === "loading"}
                      className="inline-flex items-center gap-2 text-sm font-medium text-primary transition-opacity hover:opacity-70 disabled:opacity-30"
                    >
                      {status === "loading" ? (
                        <>
                          <span className="size-3.5 animate-spin rounded-full border-2 border-primary/30 border-t-primary" />
                          Sending...
                        </>
                      ) : "Send Message →"}
                    </button>
                    <p className="text-xs text-foreground/40">I reply within 24–48h</p>
                  </div>
                </form>
              )
            )}

            {/* Voice */}
            {mode === "voice" && (
              <div className="flex flex-col justify-center">
                <VoiceNote />
              </div>
            )}
          </div>
        </div>
      </Container>

      <Container>
        <DottedSeparator className="my-8" />
      </Container>
    </>
  );
}
