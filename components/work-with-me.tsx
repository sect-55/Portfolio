"use client";

import React, { useEffect, useState } from "react";
import { Subheading } from "./subheading";

type ContributionDay = {
  date: string;
  contributionCount: number;
  contributionLevel: string;
};

type Week = {
  contributionDays: ContributionDay[];
};

type GithubCache = { weeks: Week[]; total: number } | null;
let githubCache: GithubCache = null;

const CELL = "size-[18px] rounded-[4px]";
const GAP = "gap-[4px]";

const LEVEL_COLORS: Record<string, string> = {
  NONE: "bg-white border border-neutral-300 dark:bg-neutral-900 dark:border-neutral-700",
  FIRST_QUARTILE: "bg-neutral-300 dark:bg-neutral-700",
  SECOND_QUARTILE: "bg-neutral-400 dark:bg-neutral-500",
  THIRD_QUARTILE: "bg-neutral-500 dark:bg-neutral-400",
  FOURTH_QUARTILE: "bg-neutral-600 dark:bg-neutral-200",
};

const LEGEND = [
  "NONE",
  "FIRST_QUARTILE",
  "SECOND_QUARTILE",
  "THIRD_QUARTILE",
  "FOURTH_QUARTILE",
];

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

function getMonthLabels(weeks: Week[]) {
  const labels: { label: string; col: number }[] = [];
  let lastMonth = -1;
  weeks.forEach((week, i) => {
    const firstDay = week.contributionDays[0];
    if (!firstDay) return;
    const month = new Date(firstDay.date).getMonth();
    if (month !== lastMonth) {
      labels.push({ label: MONTHS[month], col: i });
      lastMonth = month;
    }
  });
  return labels;
}

export const WorkWithMe = () => {
  const [weeks, setWeeks] = useState<Week[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (githubCache) {
      setWeeks(githubCache.weeks);
      setTotal(githubCache.total);
      setLoading(false);
      return;
    }
    fetch("/api/github-contributions")
      .then((r) => r.json())
      .then((data) => {
        if (data.error) {
          setError(typeof data.error === "string" ? data.error : JSON.stringify(data.error));
        } else {
          const weeks = data.weeks ?? [];
          const total = data.totalContributions ?? 0;
          githubCache = { weeks, total };
          setWeeks(weeks);
          setTotal(total);
        }
        setLoading(false);
      })
      .catch((e) => {
        setError(e.message);
        setLoading(false);
      });
  }, []);

  const monthLabels = getMonthLabels(weeks);

  return (
    <section>
      <Subheading>GitHub</Subheading>
      <div className="mt-6 overflow-x-auto">
        {loading ? (
          <div className="flex flex-col gap-1">
            <div className="h-6" />
            <div className={`flex ${GAP}`}>
              {Array.from({ length: 18 }).map((_, wi) => (
                <div key={wi} className={`flex flex-col ${GAP}`}>
                  {Array.from({ length: 7 }).map((_, di) => (
                    <div
                      key={di}
                      className={`${CELL} bg-neutral-700/60 animate-pulse`}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
        ) : error ? (
          <p className="text-sm text-red-500">{error}</p>
        ) : (
          <div className="flex flex-col">
            <p className="text-foreground text-base font-medium mb-3">Heatmap</p>
            <div className="relative h-6 mb-1">
              {monthLabels.map((m) => (
                <span
                  key={m.label + m.col}
                  className="absolute text-sm text-foreground/40"
                  style={{ left: m.col * 22 }}
                >
                  {m.label}
                </span>
              ))}
            </div>
            <div className={`flex ${GAP}`}>
              {weeks.map((week, wi) => (
                <div key={wi} className={`flex flex-col ${GAP}`}>
                  {week.contributionDays.map((day) => (
                    <div
                      key={day.date}
                      title={`${day.date}: ${day.contributionCount} contributions`}
                      className={`${CELL} ${LEVEL_COLORS[day.contributionLevel] ?? LEVEL_COLORS.NONE}`}
                    />
                  ))}
                </div>
              ))}
            </div>
            <div className="mt-4 flex items-center justify-end gap-2 text-sm text-foreground/40">
              <span className="font-medium">{total} this year</span>
              <span>·</span>
              <span>Less</span>
              <div className={`flex ${GAP}`}>
                {LEGEND.map((level) => (
                  <div
                    key={level}
                    className={`${CELL} ${LEVEL_COLORS[level]}`}
                  />
                ))}
              </div>
              <span>More</span>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
