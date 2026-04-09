"use client";

import { useEffect, useRef, useState } from "react";
import type { ChatMessage } from "@/lib/chat-types";

const SUGGESTED_QUESTIONS = [
  "Is Sudharsan available for work?",
  "What's his backend stack?",
  "Show me his projects",
  "What roles is he looking for?",
];

const BOT_INTRO: ChatMessage = {
  role: "assistant",
  content:
    "Hey — I'm Sudharsan's assistant. Ask me anything: his stack, availability, projects, or what kind of roles he's after.",
};

export default function AIChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([BOT_INTRO]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hasOpened, setHasOpened] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [messages, isOpen]);

  const handleOpen = () => {
    setIsOpen(true);
    setHasOpened(true);
  };

  const sendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMessage: ChatMessage = { role: "user", content: text.trim() };
    const updatedMessages = [...messages, userMessage];

    setMessages(updatedMessages);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: updatedMessages.filter(
            (m) =>
              m.role !== "assistant" || updatedMessages.indexOf(m) !== 0
          ),
        }),
      });

      const data = await res.json();

      if (data.error) {
        setMessages([
          ...updatedMessages,
          {
            role: "assistant",
            content:
              "Something went wrong. Try again or email sudharsan24@zohomail.in directly.",
          },
        ]);
      } else {
        setMessages([...updatedMessages, { role: "assistant", content: data.message }]);
      }
    } catch {
      setMessages([
        ...updatedMessages,
        {
          role: "assistant",
          content: "Connection error. Reach out at sudharsan24@zohomail.in",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const showSuggestions = messages.length === 1;

  return (
    <>
      <button
        onClick={handleOpen}
        aria-label="Open AI Assistant"
        style={{
          position: "fixed",
          bottom: "28px",
          right: "28px",
          zIndex: 9998,
          display: isOpen ? "none" : "flex",
          alignItems: "center",
          gap: "10px",
          background: "#111111",
          border: "1px solid #c9a96e",
          borderRadius: "999px",
          padding: "12px 20px",
          cursor: "pointer",
          boxShadow: "0 0 24px rgba(201,169,110,0.15)",
          transition: "all 0.2s ease",
          animation: !hasOpened ? "pulse-gold 2.5s ease-in-out infinite" : "none",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLButtonElement).style.boxShadow =
            "0 0 32px rgba(201,169,110,0.35)";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLButtonElement).style.boxShadow =
            "0 0 24px rgba(201,169,110,0.15)";
        }}
      >
        <span style={{ fontSize: "18px" }}>✦</span>
        <span
          style={{
            fontFamily: "DM Sans, sans-serif",
            fontSize: "13px",
            color: "#c9a96e",
            letterSpacing: "0.04em",
            fontWeight: 500,
          }}
        >
          Ask about Sudharsan
        </span>
      </button>

      {isOpen && (
        <div
          style={{
            position: "fixed",
            bottom: "28px",
            right: "28px",
            zIndex: 9999,
            width: "min(420px, calc(100vw - 32px))",
            height: "min(580px, calc(100vh - 56px))",
            background: "#0d0d0d",
            border: "1px solid #1e1e1e",
            borderRadius: "16px",
            display: "flex",
            flexDirection: "column",
            boxShadow:
              "0 8px 64px rgba(0,0,0,0.7), 0 0 0 1px rgba(201,169,110,0.08)",
            overflow: "hidden",
            animation: "slideUp 0.2s ease",
          }}
        >
          <div
            style={{
              padding: "16px 20px",
              borderBottom: "1px solid #1a1a1a",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              background: "#111111",
              flexShrink: 0,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div
                style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "50%",
                  background: "rgba(201,169,110,0.12)",
                  border: "1px solid rgba(201,169,110,0.3)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "14px",
                  color: "#c9a96e",
                }}
              >
                ✦
              </div>
              <div>
                <div
                  style={{
                    fontFamily: "DM Sans, sans-serif",
                    fontSize: "13px",
                    fontWeight: 600,
                    color: "#f0ece4",
                    letterSpacing: "0.02em",
                  }}
                >
                  Sudharsan&apos;s Assistant
                </div>
                <div
                  style={{
                    fontFamily: "JetBrains Mono, monospace",
                    fontSize: "10px",
                    color: "#555555",
                    letterSpacing: "0.05em",
                  }}
                >
                  POWERED BY CLAUDE
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "#555555",
                fontSize: "18px",
                lineHeight: 1,
                padding: "4px",
                transition: "color 0.15s",
              }}
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLButtonElement).style.color = "#f0ece4")
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLButtonElement).style.color = "#555555")
              }
              aria-label="Close"
            >
              ×
            </button>
          </div>

          <div
            style={{
              flex: 1,
              overflowY: "auto",
              padding: "20px",
              display: "flex",
              flexDirection: "column",
              gap: "16px",
              scrollbarWidth: "thin",
              scrollbarColor: "#1e1e1e transparent",
            }}
          >
            {messages.map((msg, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
                  animation: "fadeIn 0.2s ease",
                }}
              >
                <div
                  style={{
                    maxWidth: "82%",
                    padding: "10px 14px",
                    borderRadius:
                      msg.role === "user"
                        ? "12px 12px 2px 12px"
                        : "12px 12px 12px 2px",
                    background:
                      msg.role === "user" ? "rgba(201,169,110,0.12)" : "#161616",
                    border:
                      msg.role === "user"
                        ? "1px solid rgba(201,169,110,0.2)"
                        : "1px solid #1e1e1e",
                    fontFamily: "DM Sans, sans-serif",
                    fontSize: "13.5px",
                    lineHeight: "1.6",
                    color: msg.role === "user" ? "#f0ece4" : "#c8c2ba",
                    whiteSpace: "pre-wrap",
                  }}
                >
                  {msg.content}
                </div>
              </div>
            ))}

            {showSuggestions && (
              <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginTop: "4px" }}>
                <div
                  style={{
                    fontFamily: "JetBrains Mono, monospace",
                    fontSize: "10px",
                    color: "#444444",
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    marginBottom: "2px",
                  }}
                >
                  suggested
                </div>
                {SUGGESTED_QUESTIONS.map((q) => (
                  <button
                    key={q}
                    onClick={() => sendMessage(q)}
                    style={{
                      background: "none",
                      border: "1px solid #1e1e1e",
                      borderRadius: "8px",
                      padding: "8px 12px",
                      textAlign: "left",
                      cursor: "pointer",
                      fontFamily: "DM Sans, sans-serif",
                      fontSize: "12.5px",
                      color: "#888888",
                      transition: "all 0.15s",
                      letterSpacing: "0.01em",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.borderColor =
                        "rgba(201,169,110,0.3)";
                      (e.currentTarget as HTMLButtonElement).style.color = "#c9a96e";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.borderColor = "#1e1e1e";
                      (e.currentTarget as HTMLButtonElement).style.color = "#888888";
                    }}
                  >
                    {q}
                  </button>
                ))}
              </div>
            )}

            {isLoading && (
              <div style={{ display: "flex", justifyContent: "flex-start" }}>
                <div
                  style={{
                    padding: "10px 14px",
                    borderRadius: "12px 12px 12px 2px",
                    background: "#161616",
                    border: "1px solid #1e1e1e",
                  }}
                >
                  <div style={{ display: "flex", gap: "4px", alignItems: "center" }}>
                    {[0, 1, 2].map((i) => (
                      <div
                        key={i}
                        style={{
                          width: "5px",
                          height: "5px",
                          borderRadius: "50%",
                          background: "#c9a96e",
                          opacity: 0.6,
                          animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite`,
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          <div
            style={{
              padding: "14px 16px",
              borderTop: "1px solid #1a1a1a",
              background: "#111111",
              flexShrink: 0,
            }}
          >
            <div
              style={{
                display: "flex",
                gap: "10px",
                alignItems: "center",
                background: "#0d0d0d",
                border: "1px solid #1e1e1e",
                borderRadius: "10px",
                padding: "8px 12px",
                transition: "border-color 0.15s",
              }}
              onFocusCapture={(e) =>
                ((e.currentTarget as HTMLDivElement).style.borderColor =
                  "rgba(201,169,110,0.3)")
              }
              onBlurCapture={(e) =>
                ((e.currentTarget as HTMLDivElement).style.borderColor = "#1e1e1e")
              }
            >
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask anything…"
                disabled={isLoading}
                style={{
                  flex: 1,
                  background: "none",
                  border: "none",
                  outline: "none",
                  fontFamily: "DM Sans, sans-serif",
                  fontSize: "13.5px",
                  color: "#f0ece4",
                  caretColor: "#c9a96e",
                }}
              />
              <button
                onClick={() => sendMessage(input)}
                disabled={!input.trim() || isLoading}
                style={{
                  background: input.trim() && !isLoading ? "#c9a96e" : "#1e1e1e",
                  border: "none",
                  borderRadius: "6px",
                  width: "28px",
                  height: "28px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: input.trim() && !isLoading ? "pointer" : "default",
                  transition: "background 0.15s",
                  flexShrink: 0,
                }}
                aria-label="Send"
              >
                <svg
                  width="13"
                  height="13"
                  viewBox="0 0 13 13"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M1 6.5H12M12 6.5L7 1.5M12 6.5L7 11.5"
                    stroke={input.trim() && !isLoading ? "#080808" : "#555555"}
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(16px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0)    scale(1); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes bounce {
          0%, 80%, 100% { transform: scale(0.7); opacity: 0.4; }
          40%            { transform: scale(1);   opacity: 1;   }
        }
        @keyframes pulse-gold {
          0%, 100% { box-shadow: 0 0 24px rgba(201,169,110,0.15); }
          50%       { box-shadow: 0 0 36px rgba(201,169,110,0.35); }
        }
      `}</style>
    </>
  );
}

