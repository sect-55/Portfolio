"use client";

import React, { useEffect, useState } from "react";

type ContributionDay = {
  date: string;
  contributionCount: number;
  contributionLevel: string;
};

type Week = {
  contributionDays: ContributionDay[];
};

type GithubCache = { weeks: Week[] } | null;
let githubCache: GithubCache = null;

const CELL = "size-[18px] rounded-[4px] relative overflow-hidden";
const GAP = "gap-[4px]";

const LEVEL_COLORS: Record<string, string> = {
  NONE: "bg-neutral-200/25 ring-1 ring-white/25 dark:bg-white/5 dark:ring-white/10",
  FIRST_QUARTILE: "bg-neutral-300/45 ring-1 ring-white/20 dark:bg-neutral-700/45 dark:ring-white/10",
  SECOND_QUARTILE: "bg-neutral-400/55 ring-1 ring-white/20 dark:bg-neutral-500/55 dark:ring-white/10",
  THIRD_QUARTILE: "bg-neutral-500/65 ring-1 ring-white/20 dark:bg-neutral-400/65 dark:ring-white/10",
  FOURTH_QUARTILE: "bg-neutral-700/75 ring-1 ring-white/25 dark:bg-neutral-100/75 dark:ring-white/20",
};

const LEVEL_TEXT: Record<string, string> = {
  FIRST_QUARTILE: "text-neutral-800 dark:text-white",
  SECOND_QUARTILE: "text-neutral-800 dark:text-white",
  THIRD_QUARTILE: "text-white dark:text-neutral-800",
  FOURTH_QUARTILE: "text-white dark:text-neutral-900",
};

function HeatCell({ day }: { day: ContributionDay }) {
  const [hovered, setHovered] = useState(false);
  const textColor = LEVEL_TEXT[day.contributionLevel] ?? "text-white";

  return (
    <div
      className={`${CELL} ${LEVEL_COLORS[day.contributionLevel] ?? LEVEL_COLORS.NONE} cursor-default shadow-sm shadow-black/10 backdrop-blur-md transition-transform duration-150 ${hovered && day.contributionCount > 0 ? "scale-125 z-10 relative" : ""}`}
      title={day.date}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <span className={`pointer-events-none absolute inset-0 flex items-center justify-center text-[11px] font-black leading-none transition-opacity duration-150 ${hovered && day.contributionCount > 0 ? "opacity-100" : "opacity-0"} ${textColor}`}>
        {day.contributionCount}
      </span>
    </div>
  );
}

export function GithubContributionsHeatmap() {
  const [weeks, setWeeks] = useState<Week[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (githubCache) {
      setWeeks(githubCache.weeks);
      setLoading(false);
      return;
    }

    fetch("/api/github-contributions")
      .then((r) => r.json())
      .then((data) => {
        if (data.error) {
          setHasError(true);
        } else {
          const weeks = data.weeks ?? [];
          githubCache = { weeks };
          setWeeks(weeks);
        }
        setLoading(false);
      })
      .catch(() => {
        setHasError(true);
        setLoading(false);
      });
  }, []);

  if (hasError) return null;

  return (
    <div className="overflow-x-auto no-scrollbar">
      {loading ? (
        <div className={`flex ${GAP}`}>
          {Array.from({ length: 18 }).map((_, wi) => (
            <div key={wi} className={`flex flex-col ${GAP}`}>
              {Array.from({ length: 7 }).map((_, di) => (
                <div
                  key={di}
                  className={`${CELL} animate-pulse bg-white/25 dark:bg-white/10`}
                />
              ))}
            </div>
          ))}
        </div>
      ) : (
        <div className={`flex ${GAP}`}>
          {weeks.map((week, wi) => (
            <div key={wi} className={`flex flex-col ${GAP}`}>
              {week.contributionDays.map((day) => (
                <HeatCell key={day.date} day={day} />
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
