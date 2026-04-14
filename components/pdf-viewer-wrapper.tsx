"use client";

import dynamic from "next/dynamic";
import { motion } from "motion/react";
import { SPRING_CONFIG } from "@/lib/motion-config";

const PdfViewer = dynamic(
  () => import("@/components/pdf-viewer").then((m) => m.PdfViewer),
  { ssr: false }
);

export function PdfViewerWrapper({ url }: { url: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={SPRING_CONFIG}
      className="overflow-hidden rounded-lg bg-white dark:bg-neutral-900"
    >
      <PdfViewer url={url} />
    </motion.div>
  );
}
