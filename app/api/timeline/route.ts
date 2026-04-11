import { NextResponse } from "next/server";
import { classify, EventType } from "@/lib/classifier";

export const runtime = "nodejs";
export const revalidate = 300; // cache for 5 minutes

export interface TimelineEvent {
  id: string;
  title: string;
  repo: string;
  commit_url: string | null;
  date: string;
  type: EventType;
}

interface GithubCommit {
  sha: string;
  message: string;
  url: string;
}

interface GithubEvent {
  id: string;
  type: string;
  created_at: string;
  repo?: { name?: string };
  payload?: {
    ref_type?: string;
    commits?: GithubCommit[];
  };
}

async function fetchUserEvents(username: string, token?: string): Promise<GithubEvent[]> {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const events: GithubEvent[] = [];
  const isDev = process.env.NODE_ENV === "development";

  // Cap at 3 pages (300 events) — sufficient for display, much faster
  for (let page = 1; page <= 3; page++) {
    const res = await fetch(
      `https://api.github.com/users/${username}/events?per_page=100&page=${page}`,
      {
        headers,
        next: { revalidate: isDev ? 0 : 300 },
      }
    );
    if (!res.ok) break;
    const data: GithubEvent[] = await res.json();
    if (!Array.isArray(data) || data.length === 0) break;
    events.push(...data);
    if (data.length < 100) break;
  }

  return events;
}

function extractEvents(events: GithubEvent[]): TimelineEvent[] {
  const rows: TimelineEvent[] = [];

  for (const ev of events) {
    const repoName = ev.repo?.name?.split("/")[1] || ev.repo?.name || "unknown";
    const date = (ev.created_at || "").slice(0, 10);

    if (ev.type === "CreateEvent" && ev.payload?.ref_type === "repository") {
      rows.push({
        id: ev.id,
        title: `Launched ${repoName}`,
        repo: repoName,
        commit_url: `https://github.com/${ev.repo?.name}`,
        date,
        type: "launch",
      });
      continue;
    }

    if (ev.type === "PushEvent") {
      const commits = ev.payload?.commits || [];
      const repoUrl = `https://github.com/${ev.repo?.name}`;

      if (commits.length > 0) {
        // Authenticated — full commit details available
        for (const commit of commits) {
          const msg = commit.message?.split("\n")[0] || "";
          const { title, type } = classify(msg);
          rows.push({
            id: `${ev.id}-${commit.sha}`,
            title,
            repo: repoName,
            commit_url: commit.url
              ? commit.url
                  .replace("api.github.com/repos", "github.com")
                  .replace("/commits/", "/commit/")
              : null,
            date,
            type,
          });
        }
      } else {
        // Public / unauthenticated — no commits in payload, use head sha
        const head: string | undefined = (ev.payload as Record<string, unknown>)?.head as string | undefined;
        const size: number = ((ev.payload as Record<string, unknown>)?.size as number) || 1;
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

export async function GET(req: Request) {
  const username = process.env.GITHUB_USERNAME || "sect-55";
  const token = process.env.GITHUB_TOKEN || undefined;

  const { searchParams } = new URL(req.url);
  const typeFilter = searchParams.get("type") || null;
  const repoFilter = searchParams.get("repo") || null;
  const limit = Math.min(parseInt(searchParams.get("limit") || "100"), 300);

  // Guard against literal "undefined" string from buggy callers
  const safeType = typeFilter && typeFilter !== "undefined" ? typeFilter : null;
  const safeRepo = repoFilter && repoFilter !== "undefined" ? repoFilter : null;

  try {
    const raw = await fetchUserEvents(username, token);
    const allEvents = extractEvents(raw);

    // Compute streak once from full unfiltered set
    const allDates = Array.from(new Set(allEvents.map((e) => e.date))).sort((a, b) => b.localeCompare(a));
    let streak = 0;
    let prev: Date | null = null;
    for (const d of allDates) {
      const cur = new Date(d + "T00:00:00Z");
      if (!prev) { streak = 1; prev = cur; continue; }
      const diff = (prev.getTime() - cur.getTime()) / 86400000;
      if (diff === 1) { streak++; prev = cur; }
      else break;
    }

    // Filter after streak is computed
    let events = allEvents;
    if (safeType) events = events.filter((e) => e.type === safeType);
    if (safeRepo) events = events.filter((e) => e.repo === safeRepo);

    const response = NextResponse.json({
      data: events.slice(0, limit),
      meta: { total: events.length, streak },
    });

    // Allow CDN/browser to cache for 5 min in prod
    if (process.env.NODE_ENV !== "development") {
      response.headers.set("Cache-Control", "public, s-maxage=300, stale-while-revalidate=60");
    }

    return response;
  } catch {
    return NextResponse.json({ data: [], meta: { total: 0, streak: 0 } });
  }
}
