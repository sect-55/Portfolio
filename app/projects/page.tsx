"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { Github, ExternalLink, X, ArrowRight, ChevronDown, ChevronUp } from "lucide-react";
import { PROJECTS, SITE_CONFIG } from "@/lib/data";

// ─── DecURL Structure Modal ──────────────────────────────────────────────────

function DecURLStructureModal({ onClose }: { onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-6"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-bg/40 backdrop-blur-sm" />
      <div
        className="relative bg-[#0a0a0a] border border-zinc-800 rounded-xl p-4 sm:p-5 w-full max-w-md text-zinc-300 shadow-2xl overflow-x-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs tracking-[0.3em] text-zinc-500 uppercase">DecURL — On-Chain Flow</p>
          <button onClick={onClose} className="text-zinc-500 hover:text-[#00E676] transition-colors duration-150">
            <X size={14} />
          </button>
        </div>
        <div className="border-t border-zinc-800 pt-3">
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-3 font-mono text-xs overflow-x-auto">
            <div className="text-zinc-500 mb-2">// Create &amp; Resolve Flow</div>
            <div className="space-y-1 pb-2">
              {[
                { cls: "", content: <><span className="text-blue-400">User</span><span className="text-zinc-500">.</span><span className="text-green-400">submit</span><span className="text-zinc-500">(url, code)</span></> },
                { cls: "text-zinc-500 ml-4", content: "│" },
                { cls: "text-zinc-500 ml-4", content: "├─→" },
                { cls: "ml-8", content: <><span className="text-orange-400">Pinata</span><span className="text-zinc-500">.</span><span className="text-green-400">uploadToIPFS</span><span className="text-zinc-500">(url)</span></> },
                { cls: "text-zinc-500 ml-12", content: "│" },
                { cls: "text-zinc-500 ml-12", content: "├─→" },
                { cls: "ml-16", content: <><span className="text-purple-400">Contract</span><span className="text-zinc-500">.</span><span className="text-green-400">create</span><span className="text-zinc-500">(code, cid)</span></> },
                { cls: "text-zinc-500 ml-20", content: "│" },
                { cls: "text-zinc-500 ml-20", content: "│   on-chain · immutable" },
                { cls: "text-zinc-500 ml-20", content: "│" },
                { cls: "text-zinc-500 ml-20", content: "└─→  resolve /r/code" },
                { cls: "text-zinc-500 ml-24", content: "│" },
                { cls: "text-zinc-500 ml-24", content: "├─→" },
                { cls: "ml-28", content: <><span className="text-purple-400">Contract</span><span className="text-zinc-500">.</span><span className="text-green-400">get</span><span className="text-zinc-500">(code) → cid</span></> },
                { cls: "text-zinc-500 ml-32", content: "│" },
                { cls: "text-zinc-500 ml-32", content: "├─→" },
                { cls: "ml-36", content: <><span className="text-orange-400">IPFS</span><span className="text-zinc-500">.</span><span className="text-green-400">resolve</span><span className="text-zinc-500">(cid) → url</span></> },
                { cls: "text-zinc-500 ml-40", content: "│" },
                { cls: "text-zinc-500 ml-40", content: "└─→" },
                { cls: "ml-44", content: <><span className="text-green-400">Response</span><span className="text-zinc-500">.</span><span className="text-green-400">redirect</span><span className="text-zinc-500">(302)</span></> },
              ].map((row, i) => (
                <div key={i} className={row.cls} style={{animation:"fadeUp 0.25s ease forwards",animationDelay:`${0.05 + i * 0.07}s`,opacity:0}}>{row.content}</div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── GitHub Timeline Modal ────────────────────────────────────────────────────

type EventType = "build" | "fix" | "launch" | "update";
interface TLEvent { id: string; title: string; repo: string; commit_url: string | null; date: string; type: EventType; }
interface TLMeta { total: number; streak: number; }

const TYPE_META: Record<EventType, { icon: string; color: string }> = {
  build: { icon: "⬡", color: "#00E676" },
  fix: { icon: "◈", color: "#f87171" },
  launch: { icon: "◆", color: "#34d399" },
  update: { icon: "◇", color: "#60a5fa" },
};

function formatDate(d: string) {
  return new Date(d + "T00:00:00Z").toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "UTC" });
}

function groupByDate(events: TLEvent[]) {
  const map = new Map<string, TLEvent[]>();
  for (const ev of events) {
    if (!map.has(ev.date)) map.set(ev.date, []);
    map.get(ev.date)!.push(ev);
  }
  return Array.from(map.entries());
}

function GithubTimelineModal({ onClose }: { onClose: () => void }) {
  const [events, setEvents] = useState<TLEvent[]>([]);
  const [meta, setMeta] = useState<TLMeta>({ total: 0, streak: 0 });
  const [repos, setRepos] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeType, setActiveType] = useState<EventType | null>(null);
  const [activeRepo, setActiveRepo] = useState<string | null>(null);
  const username = "sect-55";
  // Cache all events locally — filters applied client-side, no extra API calls
  const allEventsCache = useRef<TLEvent[] | null>(null);
  const allMetaCache = useRef<TLMeta | null>(null);
  const reposCache = useRef<string[] | null>(null);

  const applyFilters = useCallback((type: EventType | null, repo: string | null) => {
    if (!allEventsCache.current) return;
    let filtered = allEventsCache.current;
    if (type) filtered = filtered.filter((e) => e.type === type);
    if (repo) filtered = filtered.filter((e) => e.repo === repo);
    setEvents(filtered);
    setMeta(allMetaCache.current || { total: filtered.length, streak: 0 });
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [tlRes, repoRes] = await Promise.all([
        fetch(`/api/timeline?limit=200`),
        reposCache.current ? Promise.resolve(null) : fetch("/api/timeline/repos", { cache: "force-cache" }),
      ]);
      const tl = await tlRes.json();
      allEventsCache.current = tl.data || [];
      allMetaCache.current = tl.meta || { total: 0, streak: 0 };
      if (repoRes) {
        reposCache.current = await repoRes.json();
      }
      setEvents(allEventsCache.current ?? []);
      setMeta(allMetaCache.current ?? { total: 0, streak: 0 });
      setRepos(reposCache.current || []);
    } catch { /* show empty */ }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const setType = (t: EventType | null) => { setActiveType(t); applyFilters(t, activeRepo); };
  const setRepo = (r: string | null) => { setActiveRepo(r); applyFilters(activeType, r); };
  const clear = () => { setActiveType(null); setActiveRepo(null); applyFilters(null, null); };

  const grouped = groupByDate(events);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4" onClick={onClose}>
      <div className="absolute inset-0 bg-bg/60 backdrop-blur-sm" />

      <div
        className="relative bg-[#0a0a0a] border border-zinc-800 rounded-xl w-full max-w-2xl max-h-[80vh] flex flex-col shadow-2xl"
        style={{animation:"fadeUp 0.35s ease forwards",opacity:0}}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 p-4 sm:p-5 border-b border-zinc-800 flex-shrink-0">
          <div>
            <p className="font-mono text-xs text-[#00E676] tracking-[0.25em] uppercase mb-1">@{username}</p>
          </div>
          <div className="flex items-center gap-4 sm:gap-5">
            <div className="flex flex-col items-end gap-0.5">
              <span className="font-display text-lg sm:text-xl font-bold text-white">{meta.total}</span>
              <span className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest">commits</span>
            </div>
            <div className="w-px h-7 bg-zinc-800" />
            <div className="flex flex-col items-end gap-0.5">
              <span className="font-display text-lg sm:text-xl font-bold text-green-400">🔥 {meta.streak}</span>
              <span className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest">streak</span>
            </div>
            <button onClick={onClose} className="ml-2 text-zinc-500 hover:text-white transition-colors">
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 px-5 py-3 border-b border-zinc-800 flex-wrap flex-shrink-0">
          <span className="font-mono text-[10px] text-zinc-500">type:</span>
          {(["build", "fix", "launch", "update"] as EventType[]).map((t) => {
            const m = TYPE_META[t];
            const isActive = activeType === t;
            return (
              <button key={t} onClick={() => setType(isActive ? null : t)}
                className="font-mono text-[11px] px-2 py-0.5 border rounded-sm transition-all duration-150"
                style={{ borderColor: isActive ? m.color : "#27272a", color: isActive ? m.color : "#71717a", backgroundColor: isActive ? `${m.color}14` : "transparent" }}>
                {m.icon} {t}
              </button>
            );
          })}
          {repos.length > 0 && (
            <>
              <span className="font-mono text-[10px] text-zinc-500 ml-1">repo:</span>
              <select
                className="font-mono text-[11px] px-2 py-0.5 border border-zinc-800 bg-zinc-900 text-zinc-400 rounded-sm outline-none"
                value={activeRepo || ""}
                onChange={(e) => setRepo(e.target.value || null)}
              >
                <option value="">all</option>
                {repos.map((r) => <option key={r} value={r}>{r}</option>)}
              </select>
            </>
          )}
          {(activeType || activeRepo) && (
            <button onClick={clear} className="ml-auto font-mono text-[11px] px-2 py-0.5 border border-zinc-800 text-zinc-500 rounded-sm hover:border-red-400/60 hover:text-red-400 transition-all">
              × clear
            </button>
          )}
        </div>

        {/* Events */}
        <div className="overflow-y-auto flex-1 p-5 space-y-8">
          {loading ? (
            <div className="flex items-center justify-center py-16 text-zinc-500 font-mono text-sm">
              <span className="animate-pulse">fetching activity...</span>
            </div>
          ) : grouped.length === 0 ? (
            <div className="flex flex-col items-center gap-3 py-16 text-zinc-500 font-mono text-sm">
              <span>no events found</span>
              {(activeType || activeRepo) && <button onClick={clear} className="text-[#00E676] text-xs underline">clear filters</button>}
            </div>
          ) : (
            grouped.map(([date, dayEvents]) => (
              <div key={date}>
                <div className="flex items-center gap-3 mb-3">
                  <span className="font-display text-sm font-bold text-zinc-400 whitespace-nowrap">{formatDate(date)}</span>
                  <span className="flex-1 h-px bg-zinc-800" />
                  <span className="font-mono text-[10px] text-zinc-600 whitespace-nowrap">{dayEvents.length} event{dayEvents.length !== 1 ? "s" : ""}</span>
                </div>
                <div className="flex flex-col gap-0.5">
                  {dayEvents.map((ev, evIdx) => {
                    const m = TYPE_META[ev.type] || TYPE_META.update;
                    return (
                      <div key={ev.id} className="flex items-start gap-3 px-3 py-3 border border-zinc-800 bg-zinc-900/40 rounded-sm hover:border-zinc-700 hover:bg-zinc-900/70 transition-all duration-200 group" style={{animation:"fadeUp 0.35s cubic-bezier(0.16,1,0.3,1) forwards",animationDelay:`${evIdx * 0.06}s`,opacity:0}}>
                        <span className="text-base shrink-0 mt-0.5 group-hover:scale-110 transition-transform" style={{ color: m.color }}>{m.icon}</span>
                        <div className="flex-1 min-w-0">
                          <p className="font-mono text-sm text-zinc-200 font-medium truncate">{ev.title}</p>
                          <div className="flex items-center gap-2 mt-1 flex-wrap">
                            <button onClick={() => setRepo(activeRepo === ev.repo ? null : ev.repo)}
                              className="font-mono text-[10px] text-zinc-500 border border-zinc-800 px-1.5 py-0.5 rounded-sm hover:border-zinc-600 hover:text-zinc-400 transition-all">
                              {ev.repo}
                            </button>
                            <span className="font-mono text-[10px] opacity-70" style={{ color: m.color }}>{ev.type}</span>
                          </div>
                        </div>
                        {ev.commit_url && (
                          <a href={ev.commit_url} target="_blank" rel="noopener noreferrer"
                            className="text-sm text-zinc-600 hover:text-[#00E676] transition-colors shrink-0 self-center px-1" title="View commit">
                            ↗
                          </a>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-zinc-800 flex-shrink-0">
          <span className="font-mono text-[11px] text-zinc-600">
            synced from github ·{" "}
            <a href={`https://github.com/${username}`} target="_blank" rel="noopener noreferrer" className="hover:text-[#00E676] transition-colors">
              @{username}
            </a>
          </span>
        </div>
      </div>
    </div>
  );
}

// ─── Projects Page ────────────────────────────────────────────────────────────

export default function ProjectsPage() {
  const projects = PROJECTS.slice(0, 2);
  const [structureOpen, setStructureOpen] = useState(false);
  const [githubOpen, setGithubOpen] = useState(false);
  const [githubBtnHovered, setGithubBtnHovered] = useState(false);
  const [structureBtnHovered, setStructureBtnHovered] = useState(false);

  return (
    <div className="pt-24 pb-20">
      {structureOpen && <DecURLStructureModal onClose={() => setStructureOpen(false)} />}
      {githubOpen && <GithubTimelineModal onClose={() => setGithubOpen(false)} />}

      <div className="max-w-6xl mx-auto px-6">
        {/* Actively Building card - hover disabled when Github button hovered */}
        <div className={`mb-6 border border-border bg-surface/30 rounded-sm p-6 transition-all duration-300 ${githubBtnHovered ? "" : "hover:border-[#00E676]/40 hover:bg-surface/70"}`} style={{animation:"fadeUp 0.6s ease forwards",opacity:0}}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
            <div className="flex items-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="font-mono text-sm text-green-400 uppercase tracking-widest">Actively Building</span>
            </div>
            <button
              onClick={() => setGithubOpen(true)}
              onMouseEnter={() => setGithubBtnHovered(true)}
              onMouseLeave={() => setGithubBtnHovered(false)}
              className="inline-flex items-center gap-2 border border-border-light text-text-secondary px-4 py-2 sm:px-6 sm:py-3 text-sm sm:text-base font-semibold rounded-sm hover:border-green-400 hover:text-green-400 transition-all duration-200 self-start sm:self-auto"
            >
              <Github size={18} />
              Github Timeline
            </button>
          </div>
        </div>

        {/* Project cards */}
        <div className="grid md:grid-cols-2 gap-6">
          {projects.map((project, i) => (
            <article
              key={project.id}
              style={{animation:"fadeUp 0.55s ease forwards",animationDelay:`${0.15 + i * 0.1}s`,opacity:0}}
              className={`group border border-border bg-surface/30 rounded-sm p-6 transition-all duration-300 flex flex-col ${project.id === "decurl" && structureBtnHovered ? "" : "hover:border-[#00E676]/40 hover:bg-surface/70"}`}
            >
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                  {project.featured && (
                    <span className="font-mono text-[10px] text-[#00E676] border border-[#00E676]/30 px-1.5 py-0.5 rounded-sm">featured</span>
                  )}
                  <span className="font-mono text-xs text-text-muted">{project.year}</span>
                </div>
                <span className="text-xs text-text-muted border border-border px-2 py-0.5 rounded-sm group-hover:text-[#00E676] group-hover:border-[#00E676]/50 transition-colors duration-300">{project.category}</span>
              </div>

              <div className="flex items-center gap-3 mb-3">
                <h3 className="font-display text-2xl font-semibold text-text-primary group-hover:text-[#00E676] transition-colors">
                  {project.title}
                </h3>
                {project.id === "decurl" && (
                  <button
                    onClick={() => setStructureOpen((v) => !v)}
                    onMouseEnter={() => setStructureBtnHovered(true)}
                    onMouseLeave={() => setStructureBtnHovered(false)}
                    className="shrink-0 font-mono text-[10px] border border-blue-500 text-blue-400 px-2 py-0.5 rounded-sm"
                  >
                    Structure
                  </button>
                )}
              </div>

              <p className="text-base text-text-muted leading-relaxed flex-1 mb-5">{project.description}</p>

              <div className="flex flex-wrap gap-1.5 mb-5">
                {project.tech.slice(0, 5).map((t) => (
                  <span key={t} className="font-mono text-xs text-text-muted bg-border/50 px-2 py-0.5 rounded-sm">{t}</span>
                ))}
                {project.tech.length > 5 && (
                  <span className="font-mono text-xs text-text-muted px-1">+{project.tech.length - 5}</span>
                )}
              </div>

              <div className="flex items-center gap-4 pt-4 border-t border-border">
                {project.github && (
                  <a href={project.github} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-xs text-text-secondary hover:text-[#00E676] transition-colors">
                    <Github size={13} /> Code
                  </a>
                )}
                {project.live && (
                  <a href={project.live} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-xs text-text-secondary hover:text-[#00E676] transition-colors">
                    <ExternalLink size={13} /> Live
                  </a>
                )}
              </div>
            </article>
          ))}
        </div>

        {/* Footer CTA */}
        <div className="mt-16 border-t border-border pt-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4" style={{animation:"fadeUp 0.6s ease forwards",animationDelay:"0.35s",opacity:0}}>
          <div>
            <p className="font-mono text-xs text-[#00E676] tracking-[0.25em] uppercase mb-1">Let&apos;s work together</p>
            <p className="text-text-secondary text-sm">Have a project or opportunity in mind?</p>
          </div>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 border border-border-light text-text-secondary px-6 py-3 text-sm font-semibold rounded-sm hover:border-[#00E676] hover:text-[#00E676] transition-all duration-200 self-start sm:self-auto"
          >
            Contact <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
}
