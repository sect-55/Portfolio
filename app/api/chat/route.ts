import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { ASSISTANT_SYSTEM_PROMPT } from "@/lib/assistant-context";
import type { ChatMessage } from "@/lib/chat-types";

export const runtime = "edge";

const apiKey = process.env.ANTHROPIC_API_KEY?.trim();

function localFallbackReply(userInput: string): string {
  const q = userInput.toLowerCase();

  if (
    q.includes("college") ||
    q.includes("education") ||
    q.includes("b.tech") ||
    q.includes("diploma") ||
    q.includes("apollo")
  ) {
    return [
      "Education details:",
      "- B.Tech in Computer Science & Engineering — Apollo Engineering College (2022-2024)",
      "- Diploma in Computer Science & Engineering — Apollo Polytechnic College (2019-2022)",
    ].join("\n");
  }

  if (
    q.includes("available") ||
    q.includes("looking for") ||
    q.includes("open to") ||
    q.includes("role")
  ) {
    return "Yes — Sudharsan is actively open to full-time backend/systems roles in fast-paced, real-world building environments.";
  }

  if (q.includes("stack") || q.includes("skills") || q.includes("backend")) {
    return "Primary stack: TypeScript, Next.js, Node.js/Express, PostgreSQL, MongoDB, Redis, Prisma, Docker, Tailwind, Bun.";
  }

  if (q.includes("project") || q.includes("github")) {
    return [
      "Key projects:",
      "- Portfolio: https://github.com/sect-55/Portfolio",
      "- URL Shortener (MERN): https://github.com/sect-55/URL-shortner",
    ].join("\n");
  }

  if (q.includes("contact") || q.includes("email")) {
    return "You can reach Sudharsan at sudharsan24@zohomail.in or via the contact form on this site.";
  }

  return "I can help with Sudharsan's profile, skills, projects, availability, and education. Try asking about his backend stack, projects, or college details.";
}

export async function POST(req: NextRequest) {
  let lastUserMessage = "";
  
  try {
    console.log("Chat API called");
    
    const { messages }: { messages: ChatMessage[] } = await req.json();
    console.log("Received messages:", messages.length);

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      console.log("Invalid messages format");
      return NextResponse.json(
        { error: "Messages array is required" },
        { status: 400 }
      );
    }

    lastUserMessage = [...messages]
      .reverse()
      .find((m) => m.role === "user")?.content || "";

    if (!lastUserMessage) {
      console.log("No user message found");
      return NextResponse.json({ message: "Ask me anything about Sudharsan." });
    }

    if (!apiKey) {
      console.log("API key not found, using fallback. Key exists:", !!process.env.ANTHROPIC_API_KEY);
      return NextResponse.json({ message: localFallbackReply(lastUserMessage) });
    }

    console.log("Calling Anthropic API...");
    const client = new Anthropic({ apiKey });

    const response = await client.messages.create({
      model: "claude-3-7-sonnet-latest",
      max_tokens: 400,
      system: ASSISTANT_SYSTEM_PROMPT,
      messages: messages.map((m) => ({ role: m.role, content: m.content })),
    });

    const first = response.content[0];
    const text = first?.type === "text" ? first.text : "";
    console.log("API response received, length:", text.length);
    
    return NextResponse.json({
      message: text || localFallbackReply(lastUserMessage),
    });
  } catch (error) {
    console.error("Chat API error:", error);
    console.error("Error details:", {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });
    
    // Graceful fallback so chat still works even if provider fails.
    return NextResponse.json({
      message: localFallbackReply(lastUserMessage || "Something went wrong"),
    });
  }
}
