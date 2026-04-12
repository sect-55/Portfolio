  import type { Project, BlogPost, Skill, Experience } from "@/types";

export const SITE_CONFIG = {
  name: "SECT",
  fullName: "Sudharsan",
  title: "Backend and Systems",
  tagline: "Knack of building developer platforms with frontend and backend operations.",
  email: "sudharsan24@zohomail.in",
  github: "https://github.com/sect-55",
  linkedin: "https://www.linkedin.com/in/sect55/",
  twitter: "https://x.com/sect_55",
  resumeUrl: "https://github.com/sect-55/sect-55/blob/2924af97a98bcf4afd0781b5ad62c6e3803c51c7/sudharsanBackend.pdf?raw=1",
  profileImage: "/img.jpg",
  location: "India",
};

export const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "About Me", href: "/about" },
  { label: "Resume", href: "/resume" },
  { label: "Projects", href: "/projects" },
  { label: "Contact", href: "/contact" },
];

export const SKILLS: Skill[] = [
  // Languages
  { name: "TypeScript", level: 88, category: "language" },
  { name: "SQL", level: 82, category: "language" },
  // Frameworks
  { name: "Next.js", level: 90, category: "framework" },
  { name: "React", level: 88, category: "framework" },
  { name: "Tailwind CSS", level: 90, category: "framework" },
  { name: "Bun", level: 78, category: "framework" },
  // Platforms
  { name: "PostgreSQL", level: 86, category: "platform" },
  { name: "Prisma", level: 84, category: "platform" },
  { name: "Redis", level: 82, category: "platform" },
  { name: "Docker", level: 86, category: "platform" },
  // Cloud
  { name: "Linux (Arch)", level: 78, category: "cloud" },
  // Tools
  { name: "Git", level: 95, category: "tool" },
  { name: "React", level: 84, category: "tool" },
  { name: "CI/CD", level: 82, category: "tool" },
];

export const EXPERIENCES: Experience[] = [
  {
    company: "Actively searching",
    role: "Fullstack Engineer",
    period: "",
    current: true,
    statusLabel: "Soon",
    description: [],
    tech: ["Next.js", "TypeScript", "PostgreSQL", "Redis", "Docker", "React"],
  },
  {
    company: "Tower Research Capital",
    role: "Quant Engineer",
    period: "",
    current: true,
    statusLabel: "Dream (One day)",
    description: [
      "Employed by my own expectations — unrealistic deadlines, zero mercy",
      "Building production systems that work perfectly... until tested properly",
      "Learning concurrency, latency, and distributed systems by repeatedly breaking things I barely understand",
      "Fixing bugs, reintroducing them differently, and calling it progress",
    ],
    tech: ["C++", "RTOS", "Networking", "Python", "System Design"],
  },
];

export const PROJECTS: Project[] = [
  {
    id: "decurl",
    title: "DecURL",
    description:
      "A decentralized, censorship-resistant URL shortener with immutable short links stored on-chain (Sepolia/Polygon) and IPFS-backed via Pinata.",
    longDescription:
      "DecURL lets users create permanent short links that nobody can edit or delete. URLs are pinned to IPFS through Pinata and their CIDs are recorded in a Solidity smart contract. The Next.js frontend handles link creation and a server-side API route resolves codes by reading the contract, fetching the CID from IPFS, and issuing a 302 redirect. Gas cost per link is ~$0.001 on Polygon mainnet.",
    tech: ["Next.js", "Solidity", "Ethers.js", "IPFS", "Pinata", "Hardhat"],
    github: "https://github.com/sect-55/D-url",
    live: "https://d-url.vercel.app",
    featured: true,
    year: 2026,
    category: "web3",
  },
  {
    id: "platform-hub",
    title: "Portfolio (this)",
    description:
      "A fullstack portfolio codebase focused on clean architecture, performance, and production-ready implementation.",
    longDescription:
      "This portfolio bundle is built as a practical fullstack system with a strong backend mindset. It includes a performant Next.js frontend, reusable TypeScript components, structured data, and deployment-ready patterns. The goal is to keep the experience concise while demonstrating real-world engineering context, maintainable code, and production-oriented tradeoffs.",
    tech: ["Next.js", "TypeScript", "PostgreSQL", "Redis", "Docker", "GitHub Actions"],
    github: "https://github.com/sect-55/Portfolio",
    featured: false,
    year: 2026,
    category: "frontend",
  },
  {
    id: "stream-engine",
    title: "Stream Engine",
    description:
      "High-throughput Kafka-based event streaming library with built-in schema registry, dead-letter queues, and monitoring.",
    longDescription:
      "Stream Engine is a Java library that wraps Kafka with opinionated defaults: schema validation via Avro, automatic dead-letter routing, circuit breakers, and a Prometheus metrics endpoint. Used internally to process 5M+ events/day.",
    tech: ["Java", "Kafka", "Avro", "Prometheus", "Docker"],
    github: "https://github.com/sect-55",
    featured: true,
    year: 2022,
    category: "backend",
  },
  {
    id: "spark-connector",
    title: "Custom Spark Connector",
    description:
      "Open-source Apache Spark connector enabling direct reads/writes to an internal data warehouse format.",
    longDescription:
      "Contributed a DataSource V2 API connector for Spark that enables efficient predicate push-down and column pruning when reading proprietary warehouse files. Reduced ETL job runtimes by ~35% for wide tables.",
    tech: ["Scala", "Java", "Apache Spark", "Hadoop"],
    github: "https://github.com/sect-55",
    featured: true,
    year: 2021,
    category: "platform",
  },
  {
    id: "fraud-sentinel",
    title: "Fraud Sentinel",
    description:
      "Real-time fraud detection system processing financial transactions using ML models served via low-latency APIs.",
    tech: ["Python", "FastAPI", "Kafka", "PostgreSQL", "scikit-learn"],
    github: "https://github.com/sect-55",
    featured: false,
    year: 2021,
    category: "backend",
  },
  {
    id: "devctl",
    title: "devctl CLI",
    description:
      "A developer productivity CLI tool for scaffolding microservices, connecting to internal tools, and automating local dev setup.",
    tech: ["Go", "Cobra", "Docker", "REST APIs"],
    github: "https://github.com/sect-55",
    featured: false,
    year: 2023,
    category: "devtools",
  },
  {
    id: "infra-dashboard",
    title: "Infra Dashboard",
    description:
      "A real-time infrastructure observability dashboard showing cluster health, cost breakdowns, and alert summaries.",
    tech: ["Next.js", "TypeScript", "Grafana API", "Prometheus", "Tailwind CSS"],
    github: "https://github.com/sect-55",
    live: "https://github.com/sect-55",
    featured: false,
    year: 2023,
    category: "frontend",
  },
];

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "building-developer-platforms",
    title: "What It Actually Takes to Build a Developer Platform",
    excerpt:
      "Developer platforms are not just fancy CI/CD pipelines. Here is what I learned building one from scratch — the hard parts nobody talks about.",
    content: `
## Introduction

Building a developer platform is one of the most complex engineering challenges you can take on. It's not just infrastructure — it's a product whose customers are your colleagues.

## The Golden Path Problem

Every platform team eventually discovers the tension between flexibility and the "golden path." Your golden path is the happy, well-lit route through infrastructure — the one you've optimised, documented, and secured. But developers have wildly different needs.

The mistake I made early on was making the golden path a golden cage. We automated everything our way and left no escape hatches. Engineers worked around us instead of with us.

**Lesson**: Build the golden path as a *default*, not a mandate. Make it trivially easy to follow and reasonably easy to deviate from.

## Self-Service is Not Optional

If an engineer has to file a ticket to get a database, you have not built a platform — you have built a fancy request form. True self-service means:

- Immediate provisioning (minutes, not hours)
- Safe guardrails without human approvals for standard requests
- Audit trails built in, not bolted on

## The API-First Contract

Everything your platform does should be doable via API. The UI is a nice-to-have; the API is the product. This lets teams automate, script, and integrate without waiting for you to build a button.

\`\`\`java
// Example: programmatic service registration
PlatformClient client = PlatformClient.builder()
    .baseUrl("https://platform.internal")
    .auth(TokenAuth.fromEnv())
    .build();

ServiceRegistration reg = ServiceRegistration.builder()
    .name("payments-service")
    .team("checkout")
    .tier(ServiceTier.CRITICAL)
    .build();

client.services().register(reg);
\`\`\`

## Observability from Day One

We added observability as an afterthought. That was a mistake. Bake in metrics, logs, and traces from the start — for both your users and for the platform itself.

## Closing Thoughts

A developer platform lives or dies by adoption. Adoption comes from trust. Trust comes from reliability, great DX, and never breaking the golden path without warning.

Build for your users, not for the architecture diagram.
    `,
    date: "2024-01-15",
    readTime: 7,
    tags: ["platform engineering", "devops", "developer experience"],
    published: true,
  },
  {
    slug: "kafka-patterns",
    title: "5 Kafka Patterns Every Backend Engineer Should Know",
    excerpt:
      "After three years building Kafka-based systems at scale, these are the patterns that saved us — and the antipatterns that burned us.",
    content: `
## Why Kafka Patterns Matter

Kafka is powerful, but power without patterns leads to chaos. After processing billions of events, here are the five patterns that changed how my team thinks about streaming.

## 1. The Outbox Pattern

Never publish to Kafka directly from a database transaction. Instead:

1. Write your domain event to an *outbox table* in the same transaction.
2. A CDC (Change Data Capture) process reads the outbox and publishes to Kafka.

This gives you atomic writes with guaranteed publishing — no dual-write nightmares.

## 2. Dead Letter Queues (DLQs)

Every consumer should have a DLQ. When a message fails after N retries, route it to a DLQ topic for manual inspection rather than crashing the consumer or silently dropping the event.

\`\`\`java
@KafkaListener(topics = "payments.processed")
public void handlePayment(PaymentEvent event) {
    try {
        process(event);
    } catch (NonRetryableException e) {
        dlqTemplate.send("payments.processed.DLQ", event);
    }
}
\`\`\`

## 3. Event Sourcing Lite

You do not need full event sourcing to benefit from append-only event logs. Store your events in Kafka with infinite retention for audit and replay — but keep a materialized view in a database for fast reads.

## 4. Schema Evolution with Avro

Use Avro + Schema Registry from day one. It enforces backward/forward compatibility and prevents the schema drift that kills long-lived consumers.

## 5. Consumer Group Management

Each independent consumer concern should be its own consumer group. Do not share consumer groups between different logical processes — partition lag from one slow consumer will silently starve others.

## Antipatterns to Avoid

- **Treating Kafka as a database**: It is a log, not a store.
- **Huge messages**: Keep payloads small; store large blobs elsewhere and reference them.
- **Single partition topics**: You lose all parallelism.

Kafka rewards engineers who understand its guarantees deeply. Read the docs; know your offsets.
    `,
    date: "2023-09-22",
    readTime: 9,
    tags: ["kafka", "backend", "distributed systems", "streaming"],
    published: true,
  },
  {
    slug: "big-data-lessons",
    title: "Lessons from 4 Years of Big Data Engineering",
    excerpt:
      "Petabyte pipelines teach you things that tutorials never mention. Here are the unglamorous truths about working with data at scale.",
    content: `
## The Romance vs. The Reality

Big data engineering sounds glamorous — until you are debugging a 6-hour Spark job that failed at hour 5 because of a single null value in a nested JSON field.

Here is what four years in the trenches taught me.

## Data Quality is Your First Problem

No amount of pipeline sophistication survives bad source data. Before you optimise, instrument your data quality:

- Null rates per column
- Cardinality over time
- Schema drift alerts

Build your pipelines to handle bad data gracefully, not to assume it away.

## Small Files Are the Enemy

In HDFS or S3, millions of small files are a performance disaster. Your namenode will thank you if you:

- Compact small files at the end of batch pipelines
- Tune Spark output to write files of 128MB–512MB
- Use partitioning schemes that match your query patterns

## Partitioning Strategy Matters More Than Hardware

I have seen 10x query speedups from fixing a partitioning scheme — more than doubling compute. Partition by the columns you filter on most. Date-based partitioning is almost always necessary; combine it with a high-cardinality dimension relevant to your access patterns.

## Idempotency is Non-Negotiable

Pipelines fail. You must be able to rerun any pipeline for any date range without duplicating data. Design for idempotency from the start:

- Overwrite target partitions, do not append
- Use deterministic job IDs
- Track watermarks in a metadata table

## Closing

Big data engineering is 20% clever algorithms and 80% operational hygiene. The boring stuff — schema management, data quality, idempotency, monitoring — is what separates production systems from expensive proof-of-concepts.
    `,
    date: "2023-04-10",
    readTime: 8,
    tags: ["big data", "spark", "data engineering", "hadoop"],
    published: true,
  },
];

export const ABOUT_HIGHLIGHTS = [
  {
    label: "Years of experience",
    value: "7+",
  },
  {
    label: "Systems built",
    value: "20+",
  },
  {
    label: "Engineers impacted",
    value: "200+",
  },
  {
    label: "Events / day processed",
    value: "5M+",
  },
];



