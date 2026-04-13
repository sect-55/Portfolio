import React from "react";
import Link from "next/link";
import { Subheading } from "./subheading";

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
          <Link
            key={item.title}
            href={item.href}
            target="_blank"
            className="flex flex-col gap-2"
          >
            <p className="text-foreground text-base font-medium hover:underline">{item.title}</p>
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
          </Link>
        ))}
      </div>
    </div>
  );
};
