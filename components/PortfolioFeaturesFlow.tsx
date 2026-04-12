"use client";

import { useState, RefObject } from "react";
import { createPortal } from "react-dom";

interface PortfolioFeaturesFlowProps {
  targetRef?: RefObject<HTMLDivElement | null>;
  onHoverChange?: (hovered: boolean) => void;
}

export default function PortfolioFeaturesFlow({ targetRef, onHoverChange }: PortfolioFeaturesFlowProps) {
  const [open, setOpen] = useState(false);
  const [clicked, setClicked] = useState(false);
  const handleMouseEnter = () => {
    if (!clicked) {
      setOpen(true);
      onHoverChange?.(true);
    }
  };

  const handleMouseLeave = () => {
    if (!clicked) {
      setOpen(false);
      onHoverChange?.(false);
    }
  };

  const handleClick = () => {
    const newClicked = !clicked;
    setClicked(newClicked);
    setOpen(newClicked);
    onHoverChange?.(newClicked);
  };

  const features = [
    { name: "GitHub", method: "timeline()", color: "#fbbf24" },
    { name: "SSE", method: "stream()", color: "#a78bfa" },
    { name: "Classifier", method: "parse()", color: "#34d399" },
    { name: "Optimizer", method: "minify()", color: "#fb923c" },
    { name: "Vercel", method: "deploy()", color: "#f472b6" },
    { name: "EdgeRuntime", method: "cache()", color: "#22d3ee" },
  ]; 

  return (
    <div className="relative">
      {/* Compact badge - matches Request Flow colors */}
      <div
        className={`flex items-center gap-2 px-2.5 py-1.5 bg-zinc-900/50 border rounded-full cursor-pointer transition-colors ${clicked ? "border-zinc-500" : "border-zinc-800 hover:border-zinc-600"}`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
      >
        <span
          className="inline-block w-1.5 h-1.5 rounded-full animate-pulse"
          style={{
            backgroundColor: "#00E676",
          }}
        />
        <span className="font-mono text-[10px] text-zinc-400 tracking-widest uppercase">
          Features
        </span>
      </div>

      {/* Expanded tree panel - portalled into the request flow container */}
      {open && targetRef?.current && createPortal(
        <div
          className="absolute inset-0 z-10 w-full h-full bg-zinc-900/95 border border-zinc-700 rounded-lg shadow-2xl overflow-hidden flex flex-col"
          style={{
            animation:"featuresIn 0.2s cubic-bezier(0.16,1,0.3,1) forwards",
            opacity:0,
            transformOrigin:"top left",
          }}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <div className="p-2 font-mono text-[11px] sm:text-sm">
            <div className="text-zinc-500 mb-2">// Portfolio Features Flow</div>

            <div className="text-zinc-300 mb-1" style={{animation:"fadeUp 0.25s ease forwards",animationDelay:"0s",opacity:0}}>
              <span className="text-blue-400">Portfolio</span>
              <span className="text-zinc-500">.</span>
              <span className="text-green-400">features</span>
              <span className="text-zinc-500">()</span>
            </div>

            <div className="space-y-1">
              {[
                { cls: "text-zinc-500", content: "│" },
                { cls: "text-zinc-500", content: "├─→" },
                { cls: "text-zinc-300 ml-2 sm:ml-4", content: <><span style={{color:features[0].color}}>{features[0].name}</span><span className="text-zinc-500">.</span><span className="text-green-400">{features[0].method.replace("()","")}</span><span className="text-zinc-500">()</span></> },
                { cls: "text-zinc-500 ml-2 sm:ml-4", content: "│" },
                { cls: "text-zinc-500 ml-2 sm:ml-4", content: "├─→" },
                { cls: "text-zinc-300 ml-4 sm:ml-8", content: <><span style={{color:features[1].color}}>{features[1].name}</span><span className="text-zinc-500">.</span><span className="text-green-400">{features[1].method.replace("()","")}</span><span className="text-zinc-500">()</span></> },
                { cls: "text-zinc-500 ml-4 sm:ml-8", content: "│" },
                { cls: "text-zinc-500 ml-4 sm:ml-8", content: "├─→" },
                { cls: "text-zinc-300 ml-6 sm:ml-12", content: <><span style={{color:features[2].color}}>{features[2].name}</span><span className="text-zinc-500">.</span><span className="text-green-400">{features[2].method.replace("()","")}</span><span className="text-zinc-500">()</span></> },
                { cls: "text-zinc-500 ml-6 sm:ml-12", content: "│" },
                { cls: "text-zinc-500 ml-6 sm:ml-12", content: "├─→" },
                { cls: "text-zinc-300 ml-8 sm:ml-16", content: <><span style={{color:features[3].color}}>{features[3].name}</span><span className="text-zinc-500">.</span><span className="text-green-400">{features[3].method.replace("()","")}</span><span className="text-zinc-500">()</span></> },
                { cls: "text-zinc-500 ml-8 sm:ml-16", content: "│" },
                { cls: "text-zinc-500 ml-8 sm:ml-16", content: "├─→" },
                { cls: "text-zinc-300 ml-10 sm:ml-20", content: <><span style={{color:features[4].color}}>{features[4].name}</span><span className="text-zinc-500">.</span><span className="text-green-400">{features[4].method.replace("()","")}</span><span className="text-zinc-500">()</span></> },
                { cls: "text-zinc-500 ml-10 sm:ml-20", content: "│" },
                { cls: "text-zinc-500 ml-10 sm:ml-20", content: "└─→" },
                { cls: "text-zinc-300 ml-12 sm:ml-24", content: <><span style={{color:features[5].color}}>{features[5].name}</span><span className="text-zinc-500">.</span><span className="text-green-400">{features[5].method.replace("()","")}</span><span className="text-zinc-500">()</span></> },
              ].map((row, i) => (
                <div key={i} className={row.cls} style={{animation:"fadeUp 0.25s ease forwards",animationDelay:`${0.05 + i * 0.07}s`,opacity:0}}>{row.content}</div>
              ))}
            </div>
          </div>
        </div>
      , targetRef.current)}
    </div>
  );
}
