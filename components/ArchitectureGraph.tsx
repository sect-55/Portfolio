"use client";

export default function ArchitectureGraph() {
  return (
    <div className="bg-[#0a0a0a] border border-zinc-800 rounded-xl p-3 w-full max-w-sm text-zinc-300 shadow-xl overflow-hidden" style={{ height: '70vh', maxHeight: '70vh', overflow: 'hidden' }}>
      {/* Header */}
      <div className="mb-3">
        <p className="text-xs tracking-[0.3em] text-zinc-500 uppercase mb-1">
          System Architecture
        </p>
      </div>
      
      {/* Performance Metrics */}
      <div className="border-t border-zinc-800 pt-2 mb-3">
        <div className="flex items-center justify-between text-xs">
          <span className="text-zinc-400">
            Average Response Time
          </span>
          <span className="text-accent font-mono font-semibold">
            ~200ms
          </span>
        </div>
        <div className="flex items-center justify-between text-xs mt-2">
          <span className="text-zinc-400">
            Security
          </span>
          <span className="text-green-400 font-mono text-xs">
            TLS 1.3 Encrypted
          </span>
        </div>
      </div>

      {/* Tree-like Code Representation */}
      <div className="mb-3">
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-2 font-mono text-xs">
          <div className="text-zinc-500 mb-1">// Complete Request Flow</div>
          <div className="space-y-1">
            <div className="text-zinc-300">
              <span className="text-blue-400">User</span>
              <span className="text-zinc-500">.</span>
              <span className="text-green-400">request</span>
              <span className="text-zinc-500">()</span>
            </div>
            <div className="text-zinc-500 ml-4">│</div>
            <div className="text-zinc-500 ml-4">├─→</div>
            <div className="text-zinc-300 ml-8">
              <span className="text-blue-400">EdgeNetwork</span>
              <span className="text-zinc-500">.</span>
              <span className="text-green-400">route</span>
              <span className="text-zinc-500">()</span>
            </div>
            <div className="text-zinc-500 ml-12">│</div>
            <div className="text-zinc-500 ml-12">├─→</div>
            <div className="text-zinc-300 ml-16">
              <span className="text-blue-400">NextJS</span>
              <span className="text-zinc-500">.</span>
              <span className="text-green-400">router</span>
              <span className="text-zinc-500">()</span>
            </div>
            <div className="text-zinc-500 ml-20">│</div>
            <div className="text-zinc-500 ml-20">├─→</div>
            <div className="text-zinc-300 ml-24">
              <span className="text-orange-400">API</span>
              <span className="text-zinc-500">.</span>
              <span className="text-green-400">validate</span>
              <span className="text-zinc-500">()</span>
            </div>
            <div className="text-zinc-500 ml-28">│</div>
            <div className="text-zinc-500 ml-28">├─→</div>
            <div className="text-zinc-300 ml-32">
              <span className="text-orange-400">Business</span>
              <span className="text-zinc-500">.</span>
              <span className="text-green-400">logic</span>
              <span className="text-zinc-500">()</span>
            </div>
            <div className="text-zinc-500 ml-36">│</div>
            <div className="text-zinc-500 ml-36">├─→</div>
            <div className="text-zinc-300 ml-40">
              <span className="text-red-400">Error</span>
              <span className="text-zinc-500">.</span>
              <span className="text-green-400">handle</span>
              <span className="text-zinc-500">()</span>
            </div>
            <div className="text-zinc-500 ml-40">│</div>
            <div className="text-zinc-500 ml-40">└─→</div>
            <div className="text-zinc-300 ml-44">
              <span className="text-green-400">Response</span>
              <span className="text-zinc-500">.</span>
              <span className="text-green-400">send</span>
              <span className="text-zinc-500">()</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tech Stack Pills */}
      <div className="flex flex-wrap gap-1">
        {[
          "Vercel Edge",
          "Serverless",
          "API Routes"
        ].map((tech) => (
          <button
            key={tech}
            className="px-2 py-1 text-xs rounded-full bg-zinc-800/50 border border-zinc-700 text-zinc-400 hover:border-accent hover:text-accent hover:bg-accent/10 transition-all duration-200 cursor-pointer"
            onClick={() => console.log(`Clicked on ${tech}`)}
          >
            {tech}
          </button>
        ))}
      </div>

    </div>
  );
}
