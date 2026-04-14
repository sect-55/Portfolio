"use client";

import dynamic from "next/dynamic";

const PdfViewer = dynamic(
  () => import("@/components/pdf-viewer").then((m) => m.PdfViewer),
  { ssr: false }
);

export function PdfViewerWrapper({ url }: { url: string }) {
  return <PdfViewer url={url} />;
}
