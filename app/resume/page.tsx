import type { Metadata } from "next";
import Container from "@/components/container";
import { DottedSeparator } from "@/components/separator";
import { PdfViewerWrapper } from "@/components/pdf-viewer-wrapper";
import { PDF_URL } from "@/lib/pdf-cache";
import { BackIconButton } from "@/components/back-icon-button";

export const metadata: Metadata = {
  title: "Resume",
  description: "My resume.",
  alternates: {
    canonical: "/resume",
  },
};

export default async function ResumePage() {
  return (
    <>
      <Container className="min-h-screen">
        <div className="mt-6">
          <div className="relative overflow-hidden rounded-2xl border border-white/25 bg-white/20 shadow-2xl shadow-black/10 backdrop-blur-2xl dark:border-white/10 dark:bg-neutral-900/20">
            <div className="pointer-events-none absolute inset-0 bg-linear-to-br from-white/35 via-white/10 to-transparent dark:from-white/12 dark:via-white/5" />
            <div className="absolute top-4 left-4 z-10">
              <BackIconButton
                onClick={() => {
                  const nav = () => (window.location.href = "/");
                  if (!document.startViewTransition) {
                    nav();
                    return;
                  }
                  document.startViewTransition(nav);
                }}
                ariaLabel="Back"
              />
            </div>
            <div className="relative p-1.5 sm:p-2">
              <PdfViewerWrapper url={PDF_URL} />
            </div>
          </div>
        </div>
      </Container>
      <Container>
        <DottedSeparator className="my-8" />
      </Container>
    </>
  );
}
