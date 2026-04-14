"use client";

import { useEffect, useRef, useState, useCallback } from "react";

type Phase =
  | "idle"       // big mic button
  | "recording"  // recording with waveform + timer
  | "recorded"   // preview + re-record + send
  | "details"    // name/email form before sending
  | "sending"
  | "success"
  | "error";

const MAX_SECONDS = 60;

export default function VoiceNote() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [seconds, setSeconds] = useState(0);
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [bars, setBars] = useState<number[]>(Array(40).fill(3));
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Animate bars from analyser
  const animateBars = useCallback(() => {
    if (!analyserRef.current) return;
    const data = new Uint8Array(analyserRef.current.frequencyBinCount);
    analyserRef.current.getByteFrequencyData(data);
    const step = Math.floor(data.length / 40);
    const newBars = Array.from({ length: 40 }, (_, i) => {
      const val = data[i * step] / 255;
      return Math.max(3, val * 72);
    });
    setBars(newBars);
    animFrameRef.current = requestAnimationFrame(animateBars);
  }, []);

  const stopAnimating = () => {
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    setBars(Array(40).fill(3));
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      // Set up analyser for visualizer
      audioCtxRef.current = new AudioContext();
      const source = audioCtxRef.current.createMediaStreamSource(stream);
      const analyser = audioCtxRef.current.createAnalyser();
      analyser.fftSize = 256;
      source.connect(analyser);
      analyserRef.current = analyser;

      // Start recorder
      const mr = new MediaRecorder(stream, { mimeType: getSupportedMimeType() });
      mediaRecorderRef.current = mr;
      chunksRef.current = [];

      mr.ondataavailable = (e) => { if (e.data.size > 0) chunksRef.current.push(e.data); };
      mr.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: getSupportedMimeType() });
        setAudioBlob(blob);
        setAudioURL(URL.createObjectURL(blob));
        stream.getTracks().forEach(t => t.stop());
        stopAnimating();
        setPhase("recorded");
      };

      mr.start(100);
      setPhase("recording");
      setSeconds(0);

      // Timer
      timerRef.current = setInterval(() => {
        setSeconds(s => {
          if (s + 1 >= MAX_SECONDS) { stopRecording(); return MAX_SECONDS; }
          return s + 1;
        });
      }, 1000);

      animateBars();
    } catch {
      setError("Microphone access denied. Please allow mic permissions.");
      setPhase("error");
    }
  };

  const stopRecording = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (mediaRecorderRef.current?.state !== "inactive") {
      mediaRecorderRef.current?.stop();
    }
    if (audioCtxRef.current) audioCtxRef.current.close();
  };

  const reset = () => {
    stopRecording();
    stopAnimating();
    setPhase("idle");
    setSeconds(0);
    setAudioURL(null);
    setAudioBlob(null);
    setIsPlaying(false);
    setError("");
    if (audioRef.current) { audioRef.current.pause(); audioRef.current.currentTime = 0; }
  };

  const togglePlay = () => {
    if (!audioRef.current || !audioURL) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleSend = async () => {
    if (!name.trim() || !email.trim()) { setError("Name and email required."); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setError("Invalid email."); return; }
    if (!audioBlob) return;

    setPhase("sending");
    setError("");

    const fd = new FormData();
    fd.append("audio", audioBlob, "voice-note.webm");
    fd.append("name", name);
    fd.append("email", email);

    try {
      const res = await fetch("/api/voice-note", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Failed to send."); setPhase("details"); return; }
      setPhase("success");
    } catch {
      setError("Network error. Try again.");
      setPhase("details");
    }
  };

  // Cleanup on unmount
  useEffect(() => () => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    if (audioCtxRef.current) audioCtxRef.current.close();
  }, []);

  const fmt = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
  const progress = (seconds / MAX_SECONDS) * 100;

  return (
    <div style={{
      width: "100%",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: "2rem",
      padding: "2rem 0",
    }}>

      {/* ── IDLE ── */}
      {phase === "idle" && (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1.5rem" }}>
          <p style={{ fontFamily: "'Syne', sans-serif", fontSize: "clamp(1.8rem, 4vw, 2.8rem)", fontWeight: 800, textAlign: "center", lineHeight: 1.1, letterSpacing: "-0.03em" }}>
            Skip the form.<br />Just talk to me.
          </p>
          <p style={{ color: "var(--muted2)", fontSize: "0.88rem", textAlign: "center", maxWidth: 320, lineHeight: 1.6 }}>
            Record a 60-second voice note. Tell me about your project in your own words.
          </p>

          {/* Big mic button */}
          <button
            onClick={startRecording}
            style={{
              width: 120, height: 120,
              borderRadius: "50%",
              background: "white",
              border: "none",
              cursor: "none",
              display: "flex", alignItems: "center", justifyContent: "center",
              transition: "transform 0.2s, box-shadow 0.2s",
              boxShadow: "0 0 0 0 rgba(255,255,255,0.15)",
              animation: "pulse 2s ease infinite",
            }}
            onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.06)")}
            onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
          >
            <MicIcon color="black" size={40} />
          </button>

          <p style={{ fontSize: "0.75rem", color: "var(--muted)", letterSpacing: "0.1em", textTransform: "uppercase" }}>
            Tap to record · max 60s
          </p>
        </div>
      )}

      {/* ── RECORDING ── */}
      {phase === "recording" && (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "2rem", width: "100%" }}>
          {/* Live waveform */}
          <div style={{
            width: "100%", height: 80,
            display: "flex", alignItems: "center", justifyContent: "center", gap: 3,
          }}>
            {bars.map((h, i) => (
              <div key={i} style={{
                width: 3, borderRadius: 2,
                height: h,
                background: `rgba(255,255,255,${0.3 + (h / 72) * 0.7})`,
                transition: "height 0.05s ease",
              }} />
            ))}
          </div>

          {/* Timer */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.75rem", width: "100%" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <span style={{
                width: 8, height: 8, borderRadius: "50%", background: "#ff4444",
                animation: "blink 1s ease infinite",
                display: "inline-block",
              }} />
              <span style={{ fontFamily: "'Syne', sans-serif", fontSize: "2rem", fontWeight: 700, letterSpacing: "-0.02em" }}>
                {fmt(seconds)}
              </span>
              <span style={{ color: "var(--muted)", fontSize: "0.8rem" }}>/ 1:00</span>
            </div>

            {/* Progress bar */}
            <div style={{ width: "100%", maxWidth: 320, height: 2, background: "rgba(255,255,255,0.1)", borderRadius: 2 }}>
              <div style={{ width: `${progress}%`, height: "100%", background: "white", borderRadius: 2, transition: "width 1s linear" }} />
            </div>
          </div>

          {/* Stop button */}
          <button
            onClick={stopRecording}
            style={{
              width: 72, height: 72, borderRadius: "50%",
              background: "#ff4444", border: "none", cursor: "none",
              display: "flex", alignItems: "center", justifyContent: "center",
              transition: "transform 0.15s",
            }}
            onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.08)")}
            onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
          >
            <StopIcon />
          </button>
          <p style={{ fontSize: "0.75rem", color: "var(--muted)", letterSpacing: "0.1em", textTransform: "uppercase" }}>Tap to stop</p>
        </div>
      )}

      {/* ── RECORDED ── */}
      {phase === "recorded" && audioURL && (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1.5rem", width: "100%" }}>
          <p style={{ fontFamily: "'Syne', sans-serif", fontSize: "1.5rem", fontWeight: 700, letterSpacing: "-0.03em" }}>
            Sounds good? 🎙️
          </p>

          {/* Playback */}
          <audio ref={audioRef} src={audioURL} onEnded={() => setIsPlaying(false)} />
          <div style={{
            width: "100%", maxWidth: 360,
            background: "var(--surface2)",
            borderRadius: 12, padding: "16px 20px",
            display: "flex", alignItems: "center", gap: "1rem",
            border: "1px solid var(--border)",
          }}>
            <button
              onClick={togglePlay}
              style={{
                width: 44, height: 44, borderRadius: "50%",
                background: "white", border: "none", cursor: "none",
                display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0, transition: "transform 0.15s",
              }}
              onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.08)")}
              onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
            >
              {isPlaying ? <PauseIcon /> : <PlayIcon />}
            </button>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: "0.8rem", color: "var(--muted2)", marginBottom: 6 }}>Your voice note · {fmt(seconds)}</div>
              <div style={{ height: 2, background: "rgba(255,255,255,0.1)", borderRadius: 2 }}>
                <div style={{ width: isPlaying ? "100%" : "0%", height: "100%", background: "white", borderRadius: 2, transition: isPlaying ? `width ${seconds}s linear` : "none" }} />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div style={{ display: "flex", gap: "0.75rem" }}>
            <button
              onClick={reset}
              style={{
                background: "none", border: "1px solid var(--border)",
                borderRadius: "100px", padding: "10px 22px",
                color: "var(--muted2)", fontSize: "0.85rem", cursor: "none",
                transition: "border-color 0.2s, color 0.2s",
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.25)"; e.currentTarget.style.color = "white"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.color = "var(--muted2)"; }}
            >
              Re-record
            </button>
            <button
              onClick={() => setPhase("details")}
              style={{
                background: "white", border: "none",
                borderRadius: "100px", padding: "10px 24px",
                color: "black", fontSize: "0.85rem", fontWeight: 500, cursor: "none",
                transition: "transform 0.15s, opacity 0.15s",
              }}
              onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.04)")}
              onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
            >
              Send it →
            </button>
          </div>
        </div>
      )}

      {/* ── DETAILS ── */}
      {phase === "details" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem", width: "100%", maxWidth: 360 }}>
          <p style={{ fontFamily: "'Syne', sans-serif", fontSize: "1.4rem", fontWeight: 700, letterSpacing: "-0.03em" }}>
            One last thing
          </p>
          <p style={{ color: "var(--muted2)", fontSize: "0.85rem", lineHeight: 1.6 }}>
            So I know who to reply to.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <label style={{ fontFamily: "Courier New, monospace", fontSize: "0.68rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--muted)" }}>
              Your name
            </label>
            <input
              type="text" value={name} onChange={e => setName(e.target.value)}
              placeholder="John Doe"
              className="field"
              style={{ background: "var(--surface2)", border: "1px solid var(--border)", borderRadius: 6, padding: "13px 16px", color: "white", fontSize: "0.9rem", outline: "none", fontFamily: "'DM Sans', sans-serif" }}
            />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <label style={{ fontFamily: "Courier New, monospace", fontSize: "0.68rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--muted)" }}>
              Email address
            </label>
            <input
              type="email" value={email} onChange={e => setEmail(e.target.value)}
              placeholder="john@acme.com"
              className="field"
              style={{ background: "var(--surface2)", border: "1px solid var(--border)", borderRadius: 6, padding: "13px 16px", color: "white", fontSize: "0.9rem", outline: "none", fontFamily: "'DM Sans', sans-serif" }}
            />
          </div>

          {error && <p style={{ fontSize: "0.8rem", color: "#ff6b6b" }}>{error}</p>}

          <div style={{ display: "flex", gap: "0.75rem", marginTop: "0.25rem" }}>
            <button
              onClick={() => setPhase("recorded")}
              style={{
                background: "none", border: "1px solid var(--border)",
                borderRadius: "100px", padding: "10px 22px",
                color: "var(--muted2)", fontSize: "0.85rem", cursor: "none",
                transition: "border-color 0.2s, color 0.2s",
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.25)"; e.currentTarget.style.color = "white"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.color = "var(--muted2)"; }}
            >
              ← Back
            </button>
            <button
              onClick={handleSend}
              style={{
                background: "white", border: "none",
                borderRadius: "100px", padding: "10px 24px",
                color: "black", fontSize: "0.85rem", fontWeight: 500, cursor: "none",
                transition: "transform 0.15s",
              }}
              onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.04)")}
              onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
            >
              Send voice note →
            </button>
          </div>
        </div>
      )}

      {/* ── SENDING ── */}
      {phase === "sending" && (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem" }}>
          <div style={{
            width: 56, height: 56, borderRadius: "50%",
            border: "2px solid rgba(255,255,255,0.1)",
            borderTopColor: "white",
            animation: "spin 0.7s linear infinite",
          }} />
          <p style={{ color: "var(--muted2)", fontSize: "0.88rem" }}>Sending your voice note...</p>
        </div>
      )}

      {/* ── SUCCESS ── */}
      {phase === "success" && (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1.25rem", animation: "fadeUp 0.5s ease" }}>
          <div style={{
            width: 72, height: 72, borderRadius: "50%",
            border: "1px solid rgba(255,255,255,0.2)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "2rem",
          }}>
            🎙️
          </div>
          <p style={{ fontFamily: "'Syne', sans-serif", fontSize: "2rem", fontWeight: 800, textAlign: "center", letterSpacing: "-0.03em", lineHeight: 1.1 }}>
            Message<br />received.
          </p>
          <p style={{ color: "var(--muted2)", fontSize: "0.88rem", textAlign: "center", lineHeight: 1.7, maxWidth: 280 }}>
            I&apos;ll listen to your note and reply within 24 hours. Talk soon.
          </p>
          <button
            onClick={reset}
            style={{
              background: "none", border: "1px solid var(--border)",
              borderRadius: "100px", padding: "10px 24px",
              color: "var(--muted2)", fontSize: "0.85rem", cursor: "none",
              transition: "border-color 0.2s, color 0.2s",
              marginTop: "0.5rem",
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.25)"; e.currentTarget.style.color = "white"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.color = "var(--muted2)"; }}
          >
            Send another
          </button>
        </div>
      )}

      {/* ── ERROR ── */}
      {phase === "error" && (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem" }}>
          <p style={{ color: "#ff6b6b", fontSize: "0.9rem", textAlign: "center" }}>{error}</p>
          <button
            onClick={reset}
            style={{
              background: "none", border: "1px solid var(--border)",
              borderRadius: "100px", padding: "10px 22px",
              color: "var(--muted2)", fontSize: "0.85rem", cursor: "none",
            }}
          >
            Try again
          </button>
        </div>
      )}

      <style>{`
        @keyframes pulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(255,255,255,0.12); }
          50% { box-shadow: 0 0 0 20px rgba(255,255,255,0); }
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

function getSupportedMimeType(): string {
  const types = ["audio/webm;codecs=opus", "audio/webm", "audio/ogg;codecs=opus", "audio/mp4"];
  for (const t of types) if (MediaRecorder.isTypeSupported(t)) return t;
  return "audio/webm";
}

function MicIcon({ color = "white", size = 24 }: { color?: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <rect x="9" y="2" width="6" height="12" rx="3" fill={color} />
      <path d="M5 10a7 7 0 0 0 14 0" stroke={color} strokeWidth="2" strokeLinecap="round" fill="none" />
      <line x1="12" y1="17" x2="12" y2="21" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <line x1="9" y1="21" x2="15" y2="21" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function StopIcon() {
  return (
    <svg width={20} height={20} viewBox="0 0 24 24" fill="white">
      <rect x="4" y="4" width="16" height="16" rx="2" />
    </svg>
  );
}

function PlayIcon() {
  return (
    <svg width={16} height={16} viewBox="0 0 24 24" fill="black">
      <polygon points="5,3 19,12 5,21" />
    </svg>
  );
}

function PauseIcon() {
  return (
    <svg width={16} height={16} viewBox="0 0 24 24" fill="black">
      <rect x="6" y="4" width="4" height="16" rx="1" />
      <rect x="14" y="4" width="4" height="16" rx="1" />
    </svg>
  );
}
