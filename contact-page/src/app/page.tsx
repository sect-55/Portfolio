"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";

const VoiceNote = dynamic(() => import("@/components/VoiceNote"), { ssr: false });

export default function ContactPage() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const [hovering, setHovering] = useState(false);
  const [mode, setMode] = useState<"form" | "voice">("form");
  const [form, setForm] = useState({ name: "", company: "", email: "", message: "", agreed: false });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const move = (e: MouseEvent) => {
      if (!cursorRef.current) return;
      cursorRef.current.style.left = e.clientX + "px";
      cursorRef.current.style.top = e.clientY + "px";
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  useEffect(() => {
    const els = document.querySelectorAll("a, button, input, textarea, label, .hoverable");
    const on = () => setHovering(true);
    const off = () => setHovering(false);
    els.forEach(el => { el.addEventListener("mouseenter", on); el.addEventListener("mouseleave", off); });
    return () => els.forEach(el => { el.removeEventListener("mouseenter", on); el.removeEventListener("mouseleave", off); });
  }, [mode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.agreed) { setErrorMsg("Please accept the terms."); return; }
    setStatus("loading"); setErrorMsg("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: form.name, company: form.company, email: form.email, message: form.message }),
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
      <div ref={cursorRef} className={`cursor ${hovering ? "hover" : ""}`} />

      <main style={{ minHeight: "100vh", background: "var(--bg)", display: "flex", flexDirection: "column" }}>

        {/* Header */}
        <header className="anim-1" style={{
          display: "flex", justifyContent: "space-between", alignItems: "center",
          padding: "24px 40px", borderBottom: "1px solid var(--border)",
        }}>
          <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: "1rem" }}>Studio</span>
          <nav style={{ display: "flex", gap: "2rem" }}>
            {["Strategy.", "Design.", "Development."].map(item => (
              <span key={item} className="label hoverable" style={{ fontSize: "0.72rem", cursor: "none" }}>{item}</span>
            ))}
          </nav>
        </header>

        {/* Layout */}
        <div className="layout" style={{ display: "flex", flex: 1 }}>

          {/* Left panel */}
          <div style={{
            flex: "0 0 50%", padding: "48px 40px",
            display: "flex", flexDirection: "column", justifyContent: "space-between",
          }}>
            <div className="anim-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1.5rem", marginBottom: "3rem" }}>
              {[
                { title: "Strategy.", body: "Build a reliable brand foundation that aligns design, aesthetic and strategy." },
                { title: "Design.", body: "Design that fortifies the connection between your brand and customers." },
                { title: "Development.", body: "Development that pushes boundaries, enabling the highest usability and performance." },
              ].map(s => (
                <div key={s.title}>
                  <p className="label" style={{ marginBottom: "0.5rem" }}>{s.title}</p>
                  <p style={{ fontSize: "0.78rem", color: "var(--muted2)", lineHeight: 1.6 }}>{s.body}</p>
                </div>
              ))}
            </div>

            <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
              <p className="anim-2" style={{ fontSize: "0.85rem", color: "var(--muted2)", marginBottom: "1.5rem", fontStyle: "italic" }}>
                Let&apos;s make something amazing, together.
              </p>
              <h1 className="display anim-3" style={{ fontSize: "clamp(4.5rem, 9vw, 8rem)", color: "var(--text)" }}>
                just<br />send it.
              </h1>

              <div className="anim-4" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem", marginTop: "3rem", borderTop: "1px solid var(--border)", paddingTop: "2rem" }}>
                <div>
                  <p className="label" style={{ marginBottom: "0.75rem" }}>You don&apos;t like forms?</p>
                  <p style={{ fontSize: "0.78rem", color: "var(--muted2)", lineHeight: 1.6, marginBottom: "1rem" }}>
                    Reach out directly — we&apos;ll make something incredible together.
                  </p>
                  <a href="mailto:hello@refokus.com" className="hoverable" style={{
                    display: "inline-flex", alignItems: "center", gap: "6px",
                    border: "1px solid var(--border)", borderRadius: "100px",
                    padding: "7px 16px", fontSize: "0.78rem", color: "var(--muted2)",
                    transition: "border-color 0.2s, color 0.2s",
                  }}>→ hello@refokus.com</a>
                </div>
                <div>
                  <p className="label" style={{ marginBottom: "0.75rem" }}>Looking to do great work?</p>
                  <p style={{ fontSize: "0.78rem", color: "var(--muted2)", lineHeight: 1.6, marginBottom: "1rem" }}>
                    We&apos;re always looking for talented people to join our team.
                  </p>
                  <a href="/careers" className="hoverable" style={{
                    display: "inline-flex", alignItems: "center", gap: "6px",
                    border: "1px solid var(--border)", borderRadius: "100px",
                    padding: "7px 16px", fontSize: "0.78rem", color: "var(--muted2)",
                    transition: "border-color 0.2s, color 0.2s",
                  }}>→ Job Openings</a>
                </div>
              </div>
            </div>
          </div>

          {/* Vertical divider */}
          <div className="vdivider" />

          {/* Right panel */}
          <div style={{ flex: "0 0 50%", padding: "48px 40px", display: "flex", flexDirection: "column" }}>

            {/* Toggle */}
            <div style={{
              display: "inline-flex", background: "var(--surface2)",
              borderRadius: "100px", padding: "4px",
              border: "1px solid var(--border)", marginBottom: "2.5rem",
              alignSelf: "flex-start",
            }}>
              {(["form", "voice"] as const).map(m => (
                <button
                  key={m}
                  onClick={() => setMode(m)}
                  className="hoverable"
                  style={{
                    borderRadius: "100px", padding: "8px 20px",
                    border: "none", fontSize: "0.82rem", cursor: "none",
                    fontFamily: "'DM Sans', sans-serif",
                    background: mode === m ? "white" : "transparent",
                    color: mode === m ? "black" : "var(--muted2)",
                    fontWeight: mode === m ? 500 : 400,
                    transition: "background 0.2s, color 0.2s",
                    display: "flex", alignItems: "center", gap: "6px",
                  }}
                >
                  {m === "voice" ? <><span>🎙</span> Voice note</> : <><span>✏️</span> Text form</>}
                </button>
              ))}
            </div>

            {/* Form mode */}
            {mode === "form" && (
              status === "success" ? (
                <div style={{ display: "flex", flexDirection: "column", gap: "1rem", animation: "fadeUp 0.4s ease" }}>
                  <div style={{ width: 56, height: 56, borderRadius: "50%", border: "1px solid rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.5rem", marginBottom: "1rem" }}>✓</div>
                  <h2 className="display" style={{ fontSize: "3rem" }}>Message<br />sent.</h2>
                  <p style={{ color: "var(--muted2)", fontSize: "0.9rem", lineHeight: 1.7 }}>We&apos;ll get back to you within 24–48 hours.</p>
                  <button
                    onClick={() => { setStatus("idle"); setForm({ name: "", company: "", email: "", message: "", agreed: false }); }}
                    className="hoverable"
                    style={{ background: "none", border: "1px solid var(--border)", borderRadius: "100px", padding: "10px 24px", color: "var(--muted2)", fontSize: "0.85rem", cursor: "none", marginTop: "1rem", width: "fit-content" }}
                  >Send another</button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                  <div className="anim-1" style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                    <label className="label" htmlFor="name">Full Name</label>
                    <input id="name" type="text" required className="field hoverable" placeholder="John Doe" value={form.name} onChange={set("name")} />
                  </div>
                  <div className="anim-2" style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                    <label className="label" htmlFor="company">Company</label>
                    <input id="company" type="text" className="field hoverable" placeholder="Acme Inc. (optional)" value={form.company} onChange={set("company")} />
                  </div>
                  <div className="anim-2" style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                    <label className="label" htmlFor="email">Email Address</label>
                    <input id="email" type="email" required className="field hoverable" placeholder="john@acme.com" value={form.email} onChange={set("email")} />
                  </div>
                  <div className="anim-3" style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                    <label className="label" htmlFor="message">Tell us about your project</label>
                    <textarea id="message" required rows={5} className="field hoverable" placeholder="We're looking to build..." value={form.message} onChange={set("message")} />
                  </div>
                  <div className="anim-4">
                    <label className="checkbox-wrap hoverable">
                      <input type="checkbox" checked={form.agreed} onChange={e => setForm(f => ({ ...f, agreed: e.target.checked }))} />
                      <span style={{ fontSize: "0.8rem", color: "var(--muted2)", lineHeight: 1.5 }}>I hereby accept the General Terms and Privacy Policy</span>
                    </label>
                  </div>
                  {(status === "error" || errorMsg) && <p style={{ fontSize: "0.8rem", color: "#ff6b6b" }}>{errorMsg}</p>}
                  <div className="anim-4" style={{ display: "flex", alignItems: "center", gap: "1rem", marginTop: "0.5rem" }}>
                    <button type="submit" disabled={status === "loading"} className="btn-send hoverable">
                      {status === "loading" ? (
                        <><span style={{ width: 14, height: 14, border: "2px solid rgba(0,0,0,0.3)", borderTopColor: "black", borderRadius: "50%", display: "inline-block", animation: "spin 0.6s linear infinite" }} />Sending...</>
                      ) : "Send Message →"}
                    </button>
                    <p style={{ fontSize: "0.75rem", color: "var(--muted)" }}>We reply within 24–48h</p>
                  </div>
                </form>
              )
            )}

            {/* Voice mode */}
            {mode === "voice" && (
              <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
                <VoiceNote />
              </div>
            )}
          </div>
        </div>
      </main>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        a:hover { color: white !important; border-color: rgba(255,255,255,0.3) !important; }
      `}</style>
    </>
  );
}
