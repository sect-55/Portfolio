import { Suspense } from "react";
import Timeline from "@/components/Timeline";
import { getTimeline } from "@/lib/github-timeline";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Timeline",
  description: "A live feed of my GitHub activity — commits, launches, fixes.",
};

export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: { type?: string; repo?: string };
}

export default async function TimelinePage({ searchParams }: PageProps) {
  const type = searchParams?.type && searchParams.type !== "undefined" ? searchParams.type : undefined;
  const repo = searchParams?.repo && searchParams.repo !== "undefined" ? searchParams.repo : undefined;

  const { data, meta, repos } = await getTimeline({ type, repo });

  const username = process.env.GITHUB_USERNAME || "sect-55";

  return (
    <Suspense fallback={null}>
      <Timeline
        events={data}
        meta={meta}
        repos={repos}
        username={username}
        activeType={type || null}
        activeRepo={repo || null}
      />
    </Suspense>
  );
}



