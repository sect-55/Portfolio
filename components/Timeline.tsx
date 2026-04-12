"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

export type EventType = "build" | "fix" | "launch" | "update";

export interface TimelineEvent {
  id: string;
  title: string;
  repo: string;
  commit_url: string | null;
  date: string;
  type: EventType;
}

interface TimelineMeta {
  total: number;
  streak: number;
}

interface TimelineProps {
  events: TimelineEvent[];
  meta: TimelineMeta;
  repos: string[];
  username: string;
  activeType: string | null;
  activeRepo: string | null;
}

const TYPE_META: Record<EventType, { icon: string; label: string; color: string }> = {
  build:  { icon: "⬡", label: "Built",    color: "#c9a96e" },
  fix:    { icon: "◈", label: "Fixed",    color: "#f87171" },
  launch: { icon: "◆", label: "Launched", color: "#34d399" },
  update: { icon: "◇", label: "Updated",  color: "#60a5fa" },
};

function formatDate(dateStr: string) {
  const d = new Date(dateStr + "T00:00:00Z");
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "UTC" });
}

function groupByDate(events: TimelineEvent[]) {
  const map = new Map<string, TimelineEvent[]>();
  for (const ev of events) {
    if (!map.has(ev.date)) map.set(ev.date, []);
    map.get(ev.date)!.push(ev);
  }
  return Array.from(map.entries());
}

export default function Timeline({ events, meta, repos, username, activeType, activeRepo }: TimelineProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const setFilter = useCallback(
    (key: string, value: string | null) => {
      const p = new URLSearchParams(searchParams.toString());
      if (value) p.set(key, value);
      else p.delete(key);
      router.push(`?${p.toString()}`);
    },
    [router, searchParams]
  );

  const clearFilters = () => router.push("/timeline");
  const grouped = groupByDate(events);
  const hasFilters = activeType || activeRepo;

  return (
    <div className="max-w-3xl mx-auto px-6 pt-24 pb-20">
      {/* Header */}
      <header className="pb-8 border-b border-border">
        <div className="flex items-end justify-between gap-6 flex-wrap">
          <div>
            <p className="font-mono text-xs text-accent tracking-[0.25em] uppercase mb-3">
              @{username}
            </p>
            <h1 className="font-display text-5xl md:text-6xl font-semibold text-text-primary leading-tight">
              dev_timeline
            </h1>
            <p className="font-mono text-xs text-text-muted mt-3 tracking-wide">
              I build things. Consistently.
            </p>
          </div>

          <div className="flex items-center gap-5">
            <div className="flex flex-col items-end gap-0.5">
              <span className="font-display text-2xl font-bold text-text-primary">{meta.total}</span>
              <span className="font-mono text-[10px] text-text-muted uppercase tracking-widest">commits</span>
            </div>
            <div className="w-px h-8 bg-border" />
            <div className="flex flex-col items-end gap-0.5">
              <span className="font-display text-2xl font-bold text-green-400">🔥 {meta.streak}</span>
              <span className="font-mono text-[10px] text-text-muted uppercase tracking-widest">day streak</span>
            </div>
          </div>
        </div>
      </header>

      {/* Filters */}
      <nav className="flex items-center gap-3 py-5 border-b border-border flex-wrap">
        <span className="font-mono text-[10px] text-text-muted">type:</span>
        {(["build", "fix", "launch", "update"] as EventType[]).map((t) => {
          const m = TYPE_META[t];
          const isActive = activeType === t;
          return (
            <button
              key={t}
              onClick={() => setFilter("type", isActive ? null : t)}
              className="font-mono text-[11px] px-2.5 py-1 border rounded-sm transition-all duration-150"
              style={{
                borderColor: isActive ? m.color : undefined,
                color: isActive ? m.color : undefined,
                backgroundColor: isActive ? `${m.color}14` : undefined,
              }}
            >
              {m.icon} {t}
            </button>
          );
        })}

        {repos.length > 0 && (
          <>
            <span className="font-mono text-[10px] text-text-muted ml-2">repo:</span>
            <select
              className="font-mono text-[11px] px-2.5 py-1 border border-border bg-surface/30 text-text-secondary rounded-sm outline-none hover:border-accent/40 transition-colors"
              value={activeRepo || ""}
              onChange={(e) => setFilter("repo", e.target.value || null)}
            >
              <option value="">all</option>
              {repos.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </>
        )}

        {hasFilters && (
          <button
            onClick={clearFilters}
            className="ml-auto font-mono text-[11px] px-2.5 py-1 border border-border text-text-muted rounded-sm hover:border-red-400/60 hover:text-red-400 transition-all"
          >
            × clear
          </button>
        )}
      </nav>

      {/* Timeline */}
      <main className="pt-8 flex flex-col gap-10">
        {grouped.length === 0 ? (
          <div className="flex flex-col items-center gap-4 py-20 text-text-muted font-mono text-sm">
            <span>no events found</span>
            {hasFilters && (
              <button onClick={clearFilters} className="text-accent underline text-xs">
                clear filters
              </button>
            )}
          </div>
        ) : (
          grouped.map(([date, dayEvents]) => (
            <div key={date}>
              {/* Date row */}
              <div className="flex items-center gap-3 mb-4">
                <span className="font-display text-sm font-bold text-text-secondary whitespace-nowrap">
                  {formatDate(date)}
                </span>
                <span className="flex-1 h-px bg-border" />
                <span className="font-mono text-[10px] text-text-muted whitespace-nowrap">
                  {dayEvents.length} event{dayEvents.length !== 1 ? "s" : ""}
                </span>
              </div>

              {/* Events */}
              <div className="flex flex-col gap-0.5">
                {dayEvents.map((ev) => {
                  const m = TYPE_META[ev.type] || TYPE_META.update;
                  return (
                    <div
                      key={ev.id}
                      className="flex items-start gap-4 px-4 py-3.5 border border-border bg-surface/30 rounded-sm hover:border-border/80 hover:bg-surface/60 transition-all duration-150 group"
                    >
                      <span
                        className="text-base shrink-0 mt-0.5 group-hover:scale-110 transition-transform duration-150"
                        style={{ color: m.color }}
                      >
                        {m.icon}
                      </span>

                      <div className="flex-1 min-w-0">
                        <p className="font-mono text-sm text-text-primary font-medium truncate">
                          {ev.title}
                        </p>
                        <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                          <button
                            onClick={() => setFilter("repo", activeRepo === ev.repo ? null : ev.repo)}
                            className="font-mono text-[10px] text-text-muted border border-border px-1.5 py-0.5 rounded-sm hover:border-border/80 hover:text-text-secondary transition-all"
                          >
                            {ev.repo}
                          </button>
                          <span
                            className="font-mono text-[10px] opacity-70"
                            style={{ color: m.color }}
                          >
                            {ev.type}
                          </span>
                        </div>
                      </div>

                      {ev.commit_url && (
                        <a
                          href={ev.commit_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-text-muted hover:text-accent transition-colors shrink-0 self-center px-1"
                          title="View commit"
                        >
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
      </main>

      {/* Footer */}
      <footer className="mt-16 pt-6 border-t border-border">
        <span className="font-mono text-[11px] text-text-muted tracking-wide">
          synced from github · auto-updates every 5 min ·{" "}
          <a
            href={`https://github.com/${username}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-accent transition-colors"
          >
            @{username}
          </a>
        </span>
      </footer>
    </div>
  );
}



