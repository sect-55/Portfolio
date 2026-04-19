import React from "react";
import { LinkPreview } from "./link-preview";

export const Header = () => {
  return (
    <div>
      <div className="text-foreground pt-4 text-base">
        I'm a software engineer at heart, tinkering with AI and code almost
        90% of the time.
      </div>
      <div className="text-foreground pt-4 text-base">
        I care about how systems behave under load—handling concurrency,
        latency, and failure—because that&apos;s where the real engineering begins.
      </div>
      <div className="text-foreground pt-4 text-base">
        Most of my work revolves around authentication, rate limiting, caching,
        and containerized services, with a focus on clean architecture and
        making things easier to work with for other developers.
      </div>
      <div className="text-foreground pt-4 text-base">
        I&apos;m mostly active on{" "}
        <LinkPreview url="https://x.com/sect_55">
          X / Twitter
        </LinkPreview>{" "}
        where I share everything.{" "}And{" "}
        <LinkPreview url="https://www.linkedin.com/in/sect55/">
          LinkedIn
        </LinkPreview>.
      </div>
    </div>
  );
};
