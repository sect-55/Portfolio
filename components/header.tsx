"use client";

import React, { useState, useCallback, useEffect } from "react";
import Link from "next/link";
import { LinkPreview } from "./link-preview";
import { DottedUnderline } from "./dotted-underline";
import { InfoTooltip } from "./info-tooltip";
import { PdfViewerWrapper } from "./pdf-viewer-wrapper";
import { GithubContributionsHeatmap } from "./github-contributions-heatmap";
import { PDF_URL } from "@/lib/pdf-cache";
import { AnimatePresence, motion } from "motion/react";
import { InspirationContent } from "./inspiration-content";
import { BackIconButton } from "@/components/back-icon-button";

export const Header = () => {
  const [resumeOpen, setResumeOpen] = useState(false);
  const [contributionsOpen, setContributionsOpen] = useState(false);
  const [inspirationOpen, setInspirationOpen] = useState(false);

  const openResume = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setResumeOpen(true);
  }, []);

  const openContributions = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setContributionsOpen(true);
  }, []);

  const openInspiration = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setInspirationOpen(true);
  }, []);

  const closeResume = useCallback(() => {
    setResumeOpen(false);
  }, []);

  const closeContributions = useCallback(() => {
    setContributionsOpen(false);
  }, []);

  const closeInspiration = useCallback(() => {
    setInspirationOpen(false);
  }, []);

  // Lock body scroll when modal open
  useEffect(() => {
    if (resumeOpen || contributionsOpen || inspirationOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [resumeOpen, contributionsOpen, inspirationOpen]);

  // Close on Escape
  useEffect(() => {
    if (!resumeOpen && !contributionsOpen && !inspirationOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeResume();
        closeContributions();
        closeInspiration();
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [
    resumeOpen,
    contributionsOpen,
    inspirationOpen,
    closeResume,
    closeContributions,
    closeInspiration,
  ]);

  return (
    <>
      <div>
        <div className="text-foreground/80 pt-4 text-base">
          I build the invisible layer that keeps software alive under pressure
          — auth, rate limiting, caching, the stuff nobody talks about until it
          breaks at the worst possible moment. Concurrency, latency, failure
          aren&apos;t problems to me, they&apos;re honestly what gets me out of bed.
          <InfoTooltip text="for the non-devs: I make sure apps don't fall apart when everyone shows up at once." />
        </div>
        <div className="text-foreground/80 pt-4 text-base">
          I overshare everything on{" "}
          <LinkPreview url="https://x.com/sect_55">
            X / Twitter
          </LinkPreview>
          , occasionally say something useful on{" "}
          <LinkPreview url="https://www.linkedin.com/in/sect55/">
            LinkedIn
          </LinkPreview>
          {" "}— and if you&apos;re curious about the work — my{" "}
          <button
            type="button"
            onClick={openResume}
            className="group text-primary relative inline-block cursor-pointer"
          >
            <span className="relative inline-block" style={{ paddingBottom: "0.05rem" }}>
              Resume
              <DottedUnderline />
            </span>
          </button>{" "}
          and{" "}
          what{" "}
          <button
            type="button"
            onClick={openInspiration}
            className="group text-primary relative inline-block cursor-pointer"
          >
            <span
              className="relative inline-block"
              style={{ paddingBottom: "0.05rem" }}
            >
              inspires
              <DottedUnderline />
            </span>
          </button>{" "}
          me{" "}
          tell the full story. My GitHub{" "}
          <button
            type="button"
            onClick={openContributions}
            className="group text-primary relative inline-block cursor-pointer"
          >
            <span className="relative inline-block" style={{ paddingBottom: "0.05rem" }}>
              Contributions
              <DottedUnderline />
            </span>
          </button>
        </div>
      </div>

      {/* Resume Modal */}
      <AnimatePresence>
        {resumeOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-8"
            style={{
              backdropFilter: "blur(18px)",
              WebkitBackdropFilter: "blur(18px)",
              backgroundColor: "rgba(10,10,10,0.20)",
            }}
            onClick={(e) => {
              if (e.target === e.currentTarget) closeResume();
            }}
            onContextMenu={(e) => {
              e.preventDefault();
              closeResume();
            }}
          >
            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 30, scale: 0.97 }}
              transition={{ type: "spring", damping: 28, stiffness: 300 }}
              className="relative w-full max-w-4xl max-h-[90vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="absolute top-3 left-3 z-10">
                <BackIconButton onClick={closeResume} ariaLabel="Back" />
              </div>
              {/* Download button */}
              <a
                href="/api/resume-download"
                download="sudharsanBackend.pdf"
                className="absolute top-3 right-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-neutral-100/70 text-neutral-600 backdrop-blur-xl transition-colors hover:bg-neutral-200 hover:text-neutral-800 dark:bg-neutral-900/40 dark:text-neutral-200 dark:hover:bg-neutral-800/60 cursor-pointer"
                aria-label="Download resume"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M21 15V19C21 20.1 20.1 21 19 21H5C3.9 21 3 20.1 3 19V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <polyline points="7,10 12,15 17,10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <line x1="12" y1="15" x2="12" y2="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </a>

              {/* PDF Content */}
              <div className="overflow-y-auto no-scrollbar max-h-[90vh]">
                <PdfViewerWrapper url={PDF_URL} />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* GitHub Contributions Modal */}
      <AnimatePresence>
        {contributionsOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.16, ease: "easeOut" }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-8"
            style={{ backdropFilter: "blur(18px)", WebkitBackdropFilter: "blur(18px)" }}
            onClick={(e) => {
              if (e.target === e.currentTarget) closeContributions();
            }}
            onContextMenu={(e) => {
              e.preventDefault();
              closeContributions();
            }}
          >
            <motion.div
              initial={{ opacity: 0, y: 18, scale: 0.92 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.96 }}
              transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-4xl max-h-[90vh] overflow-visible px-2 py-6 sm:p-8"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="absolute top-3 left-3 z-10">
                <BackIconButton onClick={closeContributions} ariaLabel="Back" />
              </div>
              <div className="flex max-h-[78vh] items-center justify-center overflow-x-auto overflow-y-visible no-scrollbar">
                <GithubContributionsHeatmap />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Inspiration Modal */}
      <AnimatePresence>
        {inspirationOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-8"
            style={{
              backdropFilter: "blur(18px)",
              WebkitBackdropFilter: "blur(18px)",
              backgroundColor: "rgba(10,10,10,0.20)",
            }}
            onClick={(e) => {
              if (e.target === e.currentTarget) closeInspiration();
            }}
            onContextMenu={(e) => {
              e.preventDefault();
              closeInspiration();
            }}
          >
            <motion.div
              initial={{ opacity: 0, y: 18, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.98 }}
              transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-4xl max-h-[90vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="absolute top-3 left-3 z-10">
                <BackIconButton onClick={closeInspiration} ariaLabel="Back" />
              </div>
              <div className="max-h-[90vh] overflow-y-auto no-scrollbar px-2 py-6 sm:p-8">
                <InspirationContent mode="modal" />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
