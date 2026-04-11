// Ported from time/github-timeline/backend/src/services/classifier.js

const RULES = [
  {
    patterns: [/\bfix(es|ed)?\b/i, /\bbug\b/i, /\bpatch\b/i, /\bhot\s*fix\b/i],
    type: "fix" as const,
    verb: "Fixed",
  },
  {
    patterns: [/\blaunch(ed)?\b/i, /\binit\b/i, /\binitial\b/i, /\bbootstrap\b/i, /\bscaffold\b/i],
    type: "launch" as const,
    verb: "Launched",
  },
  {
    patterns: [/\bfeat(ure)?\b/i, /\badd(ed|s)?\b/i, /\bimplement(ed|s)?\b/i, /\bbuild\b/i, /\bnew\b/i],
    type: "build" as const,
    verb: "Built",
  },
  {
    patterns: [/\brefactor\b/i, /\bclean\b/i, /\bimprove\b/i, /\boptimize\b/i, /\bperf\b/i],
    type: "update" as const,
    verb: "Improved",
  },
  {
    patterns: [/\bdocs?\b/i, /\breadme\b/i, /\bcomment\b/i],
    type: "update" as const,
    verb: "Documented",
  },
  {
    patterns: [/\btest(s|ing)?\b/i, /\bspec\b/i],
    type: "update" as const,
    verb: "Tested",
  },
  {
    patterns: [/\bchore\b/i, /\bupdate\b/i, /\bbump\b/i, /\brelease\b/i],
    type: "update" as const,
    verb: "Updated",
  },
];

export type EventType = "fix" | "launch" | "build" | "update";

function capitalise(str: string) {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function buildTitle(verb: string, msg: string): string {
  const stripped = msg
    .replace(/^[\w\-]+(\(.+?\))?!?:\s*/i, "")
    .replace(/\s+/g, " ")
    .trim();

  if (!stripped) return `${verb} something`;
  const clean = capitalise(stripped);
  return /^[A-Z]/.test(clean) ? clean : `${verb} ${clean.toLowerCase()}`;
}

export function classify(rawMessage: string): { type: EventType; title: string } {
  const msg = (rawMessage || "").trim();
  for (const rule of RULES) {
    if (rule.patterns.some((re) => re.test(msg))) {
      return { type: rule.type, title: buildTitle(rule.verb, msg) };
    }
  }
  return { type: "update", title: capitalise(msg) || "Made progress" };
}
