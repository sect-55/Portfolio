import React from "react";
import { Subheading } from "./subheading";
import {
  TypeScriptIcon,
  SQLIcon,
  NextjsIcon,
  ReactIcon,
  TailwindIcon,
  BunIcon,
  PostgreSQLIcon,
  PrismaIcon,
  RedisIcon,
  DockerIcon,
} from "./icons/general";
import { Box } from "./box";

export const Companies = () => {
  const stack = [
    {
      title: "TypeScript",
      icon: TypeScriptIcon,
      boxClassName: "bg-linear-to-b from-blue-400 to-blue-600 ring-offset-blue-500",
    },
    {
      title: "SQL",
      icon: SQLIcon,
      boxClassName: "bg-linear-to-b from-orange-400 to-orange-600 ring-offset-orange-500",
    },
    {
      title: "Next.js",
      icon: NextjsIcon,
      boxClassName: "bg-linear-to-b from-neutral-400 to-neutral-600 ring-offset-neutral-500",
    },
    {
      title: "React",
      icon: ReactIcon,
      boxClassName: "bg-linear-to-b from-cyan-400 to-cyan-600 ring-offset-cyan-500",
    },
    {
      title: "Tailwind CSS",
      icon: TailwindIcon,
      boxClassName: "bg-linear-to-b from-sky-400 to-sky-600 ring-offset-sky-500",
    },
    {
      title: "Bun",
      icon: BunIcon,
      boxClassName: "bg-linear-to-b from-yellow-400 to-yellow-600 ring-offset-yellow-500",
    },
    {
      title: "PostgreSQL",
      icon: PostgreSQLIcon,
      boxClassName: "bg-linear-to-b from-indigo-400 to-indigo-600 ring-offset-indigo-500",
    },
    {
      title: "Prisma",
      icon: PrismaIcon,
      boxClassName: "bg-linear-to-b from-slate-400 to-slate-600 ring-offset-slate-500",
    },
    {
      title: "Redis",
      icon: RedisIcon,
      boxClassName: "bg-linear-to-b from-red-400 to-red-600 ring-offset-red-500",
    },
    {
      title: "Docker",
      icon: DockerIcon,
      boxClassName: "bg-linear-to-b from-blue-500 to-blue-700 ring-offset-blue-600",
    },
  ];

  return (
    <section>
      <Subheading>Skills</Subheading>
      <div className="mt-6 grid grid-cols-2 gap-6 md:grid-cols-5">
        {stack.map(({ title, icon: Icon, boxClassName }) => (
          <div key={title} className="flex flex-col items-center gap-3">
            <Box className={boxClassName}>
              <Icon className="size-4 text-white drop-shadow-xl drop-shadow-black/40" />
            </Box>
            <p className="text-foreground text-sm font-medium">{title}</p>
          </div>
        ))}
      </div>
    </section>
  );
};
