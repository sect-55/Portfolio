import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface ContributionDay {
  date: string;
  contributionCount: number;
}

interface ContributionWeek {
  contributionDays: ContributionDay[];
}

export async function GET() {
  const username = process.env.GITHUB_USERNAME || "sect-55";
  const token = process.env.GITHUB_TOKEN || undefined;

  if (!token) {
    return NextResponse.json({ weeks: [], total: 0 }, { status: 200 });
  }

  const query = `
    query($login: String!) {
      user(login: $login) {
        contributionsCollection {
          contributionCalendar {
            totalContributions
            weeks {
              contributionDays {
                date
                contributionCount
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
      body: JSON.stringify({ query, variables: { login: username } }),
      cache: "no-store",
    });

    const json = await res.json();
    const calendar = json?.data?.user?.contributionsCollection?.contributionCalendar;

    if (!calendar) {
      return NextResponse.json({ weeks: [], total: 0 });
    }

    const weeks: ContributionDay[][] = (calendar.weeks as ContributionWeek[]).map(
      (w) => w.contributionDays
    );

    const response = NextResponse.json({
      weeks,
      total: calendar.totalContributions as number,
    });
    response.headers.set("Cache-Control", "public, s-maxage=300, stale-while-revalidate=60");
    return response;
  } catch {
    return NextResponse.json({ weeks: [], total: 0 });
  }
}
