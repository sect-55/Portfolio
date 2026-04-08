import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="text-center">
        <p className="font-mono text-xs text-accent tracking-[0.25em] uppercase mb-4">
          404
        </p>
        <h1 className="font-display text-7xl md:text-9xl font-semibold text-text-primary opacity-20 mb-6">
          Not found
        </h1>
        <p className="text-text-muted text-sm mb-10">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-accent border border-accent/30 px-6 py-3 rounded-sm hover:bg-accent-glow transition-all"
        >
          <ArrowLeft size={14} />
          Back to home
        </Link>
      </div>
    </div>
  );
}
