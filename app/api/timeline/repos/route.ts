import { NextResponse } from "next/server";
import { classify } from "@/lib/classifier";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface GithubEvent {
  id: string;
  type: string;
  created_at: string;
  repo?: { name?: string };
  payload?: { ref_type?: string; commits?: { sha: string; message: string; url: string }[] };
}

async function fetchAll(username: string, token?: string) {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
  const events: GithubEvent[] = [];
  const isDev = process.env.NODE_ENV === "development";
  for (let page = 1; page <= 10; page++) {
    const res = await fetch(
      `https://api.github.com/users/${username}/events?per_page=100&page=${page}`,
      {
        headers,
        cache: isDev ? "no-store" : "force-cache",
        ...(isDev ? {} : { next: { revalidate: 300 } }),
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

export async function GET() {
  const username = process.env.GITHUB_USERNAME || "sect-55";
  const token = process.env.GITHUB_TOKEN || undefined;
  
  try {
    const events = await fetchAll(username, token);
    const repos = new Set<string>();

    for (const ev of events) {
      const repo = ev.repo?.name?.split("/")[1] || ev.repo?.name;
      if (!repo) continue;
      if (ev.type === "CreateEvent" && ev.payload?.ref_type === "repository") repos.add(repo);
      if (ev.type === "PushEvent") {
        for (const c of ev.payload?.commits || []) {
          classify(c.message?.split("\n")[0] || "");
          repos.add(repo);
        }
      }
    }

    return NextResponse.json(Array.from(repos).sort());
  } catch {
    return NextResponse.json([]);
  }
}
