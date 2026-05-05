import React from "react";
import Link from "next/link";
import { LinkPreview } from "./link-preview";
import { DottedUnderline } from "./dotted-underline";
import { InfoTooltip } from "./info-tooltip";

export const Header = () => {
  return (
    <div>
      <div className="text-foreground pt-4 text-base">
        I build the invisible layer that keeps software alive under pressure
        — auth, rate limiting, caching, the stuff nobody talks about until it
        breaks at the worst possible moment. Concurrency, latency, failure
        aren&apos;t problems to me, they&apos;re honestly what gets me out of bed.
        <InfoTooltip text="for the non-devs: I make sure apps don't fall apart when everyone shows up at once." />
      </div>
      <div className="text-foreground pt-4 text-base">
        I overshare everything on{" "}
        <LinkPreview url="https://x.com/sect_55">
          X / Twitter
        </LinkPreview>
        , occasionally say something useful on{" "}
        <LinkPreview url="https://www.linkedin.com/in/sect55/">
          LinkedIn
        </LinkPreview>
        {" "}— and if you&apos;re curious about the work — my{" "}
        <Link
          href="/resume"
          className="group text-primary relative inline-block"
        >
          <span className="relative inline-block" style={{ paddingBottom: "0.05rem" }}>
            Resume
            <DottedUnderline />
          </span>
        </Link>{" "}
        and{" "}
        what{" "}
        <Link
          href="/inspiration"
          className="group text-primary relative inline-block"
        >
          <span className="relative inline-block" style={{ paddingBottom: "0.05rem" }}>
            inspires
            <DottedUnderline />
          </span>
        </Link>{" "}
        me{" "}
        tell the full story.
      </div>
    </div>
  );
};
