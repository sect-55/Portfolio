"use client";

import { useState } from "react";

export default function HeroText({ fullName }: { fullName: string }) {
  const [nameHovered, setNameHovered] = useState(false);

  return (
    <>
      <p
        className={`font-mono text-xs tracking-[0.25em] uppercase mb-4 transition-colors duration-200 ${
          nameHovered ? "text-white" : "text-[#00E676]"
        }`}
      >
        Hello, I&apos;m
      </p>
      <h1
        className={`font-display text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-semibold leading-[0.95] tracking-tight mb-4 transition-colors duration-200 cursor-default ${
          nameHovered ? "text-[#00E676]" : "text-text-primary"
        }`}
        onMouseEnter={() => setNameHovered(true)}
        onMouseLeave={() => setNameHovered(false)}
      >
        {fullName}
      </h1>
    </>
  );
}
