import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const token = process.env.GITHUB_TOKEN;
  const username = process.env.NEXT_PUBLIC_GITHUB_USERNAME || "sect-55";

  if (!token) {
    return NextResponse.json(
      { error: "GITHUB_TOKEN not set in .env.local" },
      { status: 500 }
    );
  }

  const now = new Date();
  const from = new Date(now);
  from.setMonth(from.getMonth() - 3);

  const query = `
    query($username: String!, $from: DateTime!, $to: DateTime!) {
      user(login: $username) {
        contributionsCollection(from: $from, to: $to) {
          contributionCalendar {
            totalContributions
            weeks {
              contributionDays {
                date
                contributionCount
                contributionLevel
              }
            }
          }
        }
      }
    }
  `;

  try {
    const res = await fetch("https://api.github.com/graphql", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query,
        variables: {
          username,
          from: from.toISOString(),
          to: now.toISOString(),
        },
      }),
    });

    const data = await res.json();

    if (!res.ok || data.errors) {
      console.error("GitHub API error:", JSON.stringify(data));
      return NextResponse.json(
        { error: data.errors || data.message || "GitHub API error" },
        { status: 500 }
      );
    }

    const calendar =
      data?.data?.user?.contributionsCollection?.contributionCalendar;

    return NextResponse.json({
      totalContributions: calendar?.totalContributions ?? 0,
      weeks: calendar?.weeks ?? [],
    });
  } catch (err) {
    console.error("Fetch failed:", err);
    return NextResponse.json({ error: "Fetch failed" }, { status: 500 });
  }
}
