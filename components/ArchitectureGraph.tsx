"use client";

import { useRef, useState } from "react";
import PortfolioFeaturesFlow from "@/components/PortfolioFeaturesFlow";

export default function ArchitectureGraph() {
  const requestFlowRef = useRef<HTMLDivElement>(null);
  const [featuresHovered, setFeaturesHovered] = useState(false);
  return (
    <div className="bg-[#0a0a0a] border border-zinc-800 rounded-xl p-3 w-full max-w-[calc(100vw-3rem)] sm:max-w-sm text-zinc-300 shadow-xl" style={{animation:"float 4s ease-in-out infinite"}}>
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs tracking-[0.3em] text-zinc-500 uppercase">
          System Architecture
        </p>
        <PortfolioFeaturesFlow targetRef={requestFlowRef} onHoverChange={setFeaturesHovered} />
      </div>

      {/* Performance Metrics */}
      <div className="border-t border-zinc-800 pt-2 mb-3">
        <div className="flex items-center justify-between text-sm mb-2">
          <span className="text-zinc-400">Average Response Time</span>
          <span className="text-white font-mono font-semibold text-base">~100ms</span>
        </div>
        <div className="flex items-center justify-between text-sm mt-2">
          <span className="text-zinc-400">Security</span>
          <span className="text-white font-mono text-base">TLS 1.3 Encrypted</span>
        </div>
      </div>

      {/* Tree-like Code Representation - hidden when Features hovered */}
      <div ref={requestFlowRef} className="relative mb-3">
        <div className={`bg-zinc-900/50 border border-zinc-800 rounded-lg p-2 font-mono text-[11px] sm:text-sm transition-opacity duration-200 ${featuresHovered ? "opacity-0" : "opacity-100"}`}>
          <div className="text-zinc-500 mb-1">// Complete Request Flow</div>
          <div className="space-y-1">
            {[
              { cls: "text-zinc-300", content: <><span className="text-blue-400">User</span><span className="text-zinc-500">.</span><span className="text-green-400">request</span><span className="text-zinc-500">()</span></> },
              { cls: "text-zinc-500 ml-2 sm:ml-4", content: "│" },
              { cls: "text-zinc-500 ml-2 sm:ml-4", content: "├─→" },
              { cls: "text-zinc-300 ml-4 sm:ml-8", content: <><span className="text-blue-400">EdgeNetwork</span><span className="text-zinc-500">.</span><span className="text-green-400">route</span><span className="text-zinc-500">()</span></> },
              { cls: "text-zinc-500 ml-6 sm:ml-12", content: "│" },
              { cls: "text-zinc-500 ml-6 sm:ml-12", content: "├─→" },
              { cls: "text-zinc-300 ml-8 sm:ml-16", content: <><span className="text-blue-400">NextJS</span><span className="text-zinc-500">.</span><span className="text-green-400">router</span><span className="text-zinc-500">()</span></> },
              { cls: "text-zinc-500 ml-10 sm:ml-20", content: "│" },
              { cls: "text-zinc-500 ml-10 sm:ml-20", content: "├─→" },
              { cls: "text-zinc-300 ml-12 sm:ml-24", content: <><span className="text-orange-400">API</span><span className="text-zinc-500">.</span><span className="text-green-400">validate</span><span className="text-zinc-500">()</span></> },
              { cls: "text-zinc-500 ml-14 sm:ml-28", content: "│" },
              { cls: "text-zinc-500 ml-14 sm:ml-28", content: "├─→" },
              { cls: "text-zinc-300 ml-16 sm:ml-32", content: <><span className="text-orange-400">Business</span><span className="text-zinc-500">.</span><span className="text-green-400">logic</span><span className="text-zinc-500">()</span></> },
              { cls: "text-zinc-500 ml-[4.5rem] sm:ml-36", content: "│" },
              { cls: "text-zinc-500 ml-[4.5rem] sm:ml-36", content: "├─→" },
              { cls: "text-zinc-300 ml-20 sm:ml-40", content: <><span className="text-red-400">Error</span><span className="text-zinc-500">.</span><span className="text-green-400">handle</span><span className="text-zinc-500">()</span></> },
              { cls: "text-zinc-500 ml-20 sm:ml-40", content: "│" },
              { cls: "text-zinc-500 ml-20 sm:ml-40", content: "└─→" },
              { cls: "text-zinc-300 ml-[5.5rem] sm:ml-44", content: <><span className="text-green-400">Response</span><span className="text-zinc-500">.</span><span className="text-green-400">send</span><span className="text-zinc-500">()</span></> },
            ].map((row, i) => (
              <div key={i} className={row.cls} style={{animation:"fadeUp 0.25s ease forwards",animationDelay:`${0.05 + i * 0.07}s`,opacity:0}}>{row.content}</div>
            ))}
          </div>
        </div>
      </div>

      {/* Tech Stack Pills */}
      <div className="flex flex-wrap items-center gap-2">
        {[
          "Vercel Edge",
          "Serverless",
          "API Routes"
        ].map((tech) => (
          <button
            key={tech}
            className="px-2 py-1 text-xs rounded-full bg-zinc-800/50 border border-zinc-700 text-zinc-400"
          >
            {tech}
          </button>
        ))}
      </div>
    </div>
  );
}
