// Shared GitHub timeline data fetching logic
// Used directly in app/timeline/page.tsx (no HTTP self-calls)

import { classify, EventType } from "@/lib/classifier";

export interface TimelineEvent {
  id: string;
  title: string;
  repo: string;
  commit_url: string | null;
  date: string;
  type: EventType;
}

export interface TimelineMeta {
  total: number;
  streak: number;
}

interface GithubEvent {
  id: string;
  type: string;
  created_at: string;
  repo?: { name?: string };
  payload?: Record<string, unknown>;
}

async function fetchGitHubEvents(username: string, token?: string): Promise<GithubEvent[]> {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const events: GithubEvent[] = [];

  for (let page = 1; page <= 10; page++) {
    const res = await fetch(
      `https://api.github.com/users/${username}/events?per_page=100&page=${page}`,
      { headers, cache: "no-store" }
    );
    if (!res.ok) break;
    const data: GithubEvent[] = await res.json();
    if (!Array.isArray(data) || data.length === 0) break;
    events.push(...data);
    if (data.length < 100) break;
  }

  return events;
}

function extractEvents(raw: GithubEvent[]): TimelineEvent[] {
  const rows: TimelineEvent[] = [];

  for (const ev of raw) {
    const repoName = ev.repo?.name?.split("/")[1] || ev.repo?.name || "unknown";
    const date = (ev.created_at || "").slice(0, 10);
    const repoUrl = `https://github.com/${ev.repo?.name}`;

    if (ev.type === "CreateEvent" && ev.payload?.ref_type === "repository") {
      rows.push({ id: ev.id, title: `Launched ${repoName}`, repo: repoName, commit_url: repoUrl, date, type: "launch" });
      continue;
    }

    if (ev.type === "PushEvent") {
      const commits = (ev.payload?.commits as Array<{ sha: string; message: string; url: string }>) || [];
      const head = ev.payload?.head as string | undefined;
      const size = (ev.payload?.size as number) || 1;

      if (commits.length > 0) {
        for (const commit of commits) {
          const msg = commit.message?.split("\n")[0] || "";
          const { title, type } = classify(msg);
          rows.push({
            id: `${ev.id}-${commit.sha}`,
            title,
            repo: repoName,
            commit_url: commit.url
              ? commit.url.replace("api.github.com/repos", "github.com").replace("/commits/", "/commit/")
              : null,
            date,
            type,
          });
        }
      } else {
        const label = size > 1 ? `${size} commits` : "a commit";
        rows.push({
          id: `${ev.id}-${head || "push"}`,
          title: `Pushed ${label} to ${repoName}`,
          repo: repoName,
          commit_url: head ? `${repoUrl}/commit/${head}` : repoUrl,
          date,
          type: "build",
        });
      }
    }
  }

  return rows;
}

function calcStreak(events: TimelineEvent[]): number {
  const dates = Array.from(new Set(events.map((e) => e.date))).sort((a, b) => b.localeCompare(a));
  let streak = 0;
  let prev: Date | null = null;
  for (const d of dates) {
    const cur = new Date(d + "T00:00:00Z");
    if (!prev) { streak = 1; prev = cur; continue; }
    const diff = (prev.getTime() - cur.getTime()) / 86400000;
    if (diff === 1) { streak++; prev = cur; }
    else break;
  }
  return streak;
}

export async function getTimeline(opts: { type?: string; repo?: string } = {}): Promise<{
  data: TimelineEvent[];
  meta: TimelineMeta;
  repos: string[];
}> {
  const username = process.env.GITHUB_USERNAME || "sect-55";
  const token = process.env.GITHUB_TOKEN || undefined;

  try {
    const raw = await fetchGitHubEvents(username, token);
    const allEvents = extractEvents(raw);
    const repos = Array.from(new Set(allEvents.map((e) => e.repo))).sort();
    const streak = calcStreak(allEvents);

    let filtered = allEvents;
    if (opts.type && opts.type !== "undefined") filtered = filtered.filter((e) => e.type === opts.type);
    if (opts.repo && opts.repo !== "undefined") filtered = filtered.filter((e) => e.repo === opts.repo);

    return {
      data: filtered,
      meta: { total: filtered.length, streak },
      repos,
    };
  } catch {
    return { data: [], meta: { total: 0, streak: 0 }, repos: [] };
  }
}



