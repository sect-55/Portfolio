"use client";

import React from "react";
import { Subheading } from "./subheading";
import { LinkPreview } from "./link-preview";

const workItems = [
  {
    href: "https://d-url.vercel.app/",
    title: "DecURL",
    description:
      "A decentralized, censorship-resistant URL shortener with immutable short links stored on-chain (Sepolia/Polygon) and IPFS-backed via Pinata.",
    tags: ["Next.js", "Solidity", "Ethers.js"],
  },
];

export const Work = () => {
  return (
    <div>
      <Subheading>Projects</Subheading>
      <div className="mt-4 flex flex-col gap-6">
        {workItems.map((item) => (
          <div
            key={item.title}
            className="flex flex-col gap-2 cursor-pointer"
            onClick={() => window.open(item.href, "_blank")}
          >
            <span onClick={(e) => e.stopPropagation()}>
              <LinkPreview url={item.href}>
                <span className="text-foreground text-base font-medium">{item.title}</span>
              </LinkPreview>
            </span>
            <p className="text-foreground/70 text-base text-pretty">{item.description}</p>
            {item.tags && (
              <div className="flex flex-wrap gap-2">
                {item.tags.map((tag) => (
                  <span key={tag} className="text-base text-foreground/60">
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
