"use client";

import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Subheading } from "./subheading";
import { cn } from "@/lib/utils";
import {
  IconBrandTypescript, IconBrandReact, IconBrandNextjs, IconBrandTailwind,
  IconBrandNodejs, IconBrandDocker, IconBrandVercel, IconBrandAmazon,
  IconDatabase, IconServer, IconTerminal, IconGitBranch, IconShield,
  IconCpu, IconNetwork, IconFlame, IconHexagon, IconBolt, IconWorld,
  IconBraces, IconActivity, IconTable, IconStack,
} from "@tabler/icons-react";

const categories = [
  {
    name: "Web3",
    span: false,
    skills: ["Solidity", "Ethers.js", "Solana", "IPFS", "EVM"],
    icon: <IconCpu size={24} />,
  },
  {
    name: "DevOps",
    span: false,
    skills: ["Docker", "CI/CD", "AWS"],
  },
  {
    name: "Web2",
    span: true,
    extra: "mb-4",
    skills: [
      "TypeScript", "React", "Next.js", "Tailwind CSS", "Redis","Prisma",
      "SQL","GraphQL","Bun","PostgreSQL", "WebSockets", "tRPC",
    ],
  },
];

const categoryIcons: Record<string, React.ReactNode> = {
  Web3: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-70">
      <path d="M10.5 20.5 3 12l7.5-8.5" /><path d="m13.5 3.5 7.5 8.5-7.5 8.5" />
    </svg>
  ),
  DevOps: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-70">
      <rect x="2" y="2" width="20" height="8" rx="2" /><rect x="2" y="14" width="20" height="8" rx="2" />
      <line x1="6" y1="6" x2="6.01" y2="6" /><line x1="6" y1="18" x2="6.01" y2="18" />
    </svg>
  ),
  Web2: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-70">
      <polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" />
    </svg>
  ),
};

type TablerIcon = React.ComponentType<{ size?: number; className?: string }>;

const skillIcons: Record<string, TablerIcon> = {
  TypeScript: IconBrandTypescript,
  React: IconBrandReact,
  "Next.js": IconBrandNextjs,
  "Tailwind CSS": IconBrandTailwind,
  Bun: IconBolt,
  "Node.js": IconBrandNodejs,
  PostgreSQL: IconDatabase,
  Prisma: IconStack,
  Redis: IconFlame,
  SQL: IconTable,
  GraphQL: IconBraces,
  WebSockets: IconActivity,
  tRPC: IconNetwork,
  Docker: IconBrandDocker,
  Linux: IconTerminal,
  "CI/CD": IconGitBranch,
  AWS: IconBrandAmazon,
  Vercel: IconBrandVercel,
  Netlify: IconWorld,
  Solidity: IconShield,
  "Ethers.js": IconHexagon,
  Solana: IconBolt,
  IPFS: IconNetwork,
  EVM: IconCpu,
};

function SkillTag({ skill }: { skill: string }) {
  const [hovered, setHovered] = useState(false);
  const leaveTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const Icon = skillIcons[skill];
  return (
    <motion.span
      className={cn(
        "relative inline-flex items-center py-0.5 pr-2 text-base cursor-default transition-colors duration-150",
        "pl-2",
        hovered ? "text-foreground" : "text-foreground/70"
      )}
      animate={{ paddingLeft: hovered && Icon ? 22 : 8 }}
      transition={{ type: "tween", duration: 0.18, ease: "easeOut" }}
      onPointerEnter={() => { clearTimeout(leaveTimer.current); setHovered(true); }}
      onPointerLeave={() => { leaveTimer.current = setTimeout(() => setHovered(false), 80); }}
    >
      <DotRect />
      <AnimatePresence>
        {hovered && Icon && (
          <motion.span
            initial={{ opacity: 0, scale: 0.4, x: -3 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.4, x: -3 }}
            transition={{ type: "spring", stiffness: 340, damping: 28 }}
            className="pointer-events-none absolute left-[4px] top-1/2 z-10 -translate-y-1/2 text-foreground"
          >
            <Icon size={13} />
          </motion.span>
        )}
      </AnimatePresence>
      {skill}
    </motion.span>
  );
}

function DotRect({ className }: { className?: string }) {
  return (
    <svg
      className={cn("pointer-events-none absolute inset-0 h-full w-full", className)}
      style={{ overflow: "visible" }}
      aria-hidden
    >
      <rect
        x="0" y="0" width="100%" height="100%"
        fill="none"
        strokeWidth="1"
        strokeDasharray="1 5"
        strokeLinecap="round"
        className="stroke-foreground/40"
      />
    </svg>
  );
}

export const Companies = () => {
  return (
    <section>
      <Subheading>Skills</Subheading>
      <div className="mt-6 grid grid-cols-1 gap-8 md:grid-cols-2">
        {categories.map((cat) => (
          <motion.div layout key={cat.name} className={cn("relative self-start w-fit p-4 pt-6", cat.span && "md:col-span-2 w-full", cat.extra)} transition={{ type: "tween", duration: 0.18, ease: "easeOut" }}>
            <DotRect />
            <div className="absolute -top-3 left-4 flex items-center gap-1.5 bg-background px-2 py-1 text-base font-medium text-foreground">
              <div className="relative flex items-center gap-1.5 px-0.5">
                <DotRect />
                {categoryIcons[cat.name]}
                {cat.name}
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {cat.skills.map((skill) => (
                <SkillTag key={skill} skill={skill} />
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};
