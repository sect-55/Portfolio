import type { Metadata } from "next";
import Container from "@/components/container";
import { DottedSeparator } from "@/components/separator";
import { PdfViewerWrapper } from "@/components/pdf-viewer-wrapper";

export const metadata: Metadata = {
  title: "Resume",
  description: "My resume.",
  alternates: {
    canonical: "/resume",
  },
};

const PDF_URL =
  "https://raw.githubusercontent.com/sect-55/sect-55/main/sudharsanBackend.pdf";

export default async function ResumePage() {
  return (
    <>
      <Container className="min-h-screen">
        <div className="relative mt-6">
          <div className="overflow-hidden rounded-lg border border-neutral-200 bg-white dark:border-neutral-700 dark:bg-neutral-900">
            <PdfViewerWrapper url={PDF_URL} />
          </div>
          <a
            href="/api/resume-download"
            download="sudharsanBackend.pdf"
            className="group absolute bottom-4 right-4 z-10 flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-4 py-2 text-sm font-medium text-neutral-700 shadow-md transition-all hover:border-neutral-400 hover:shadow-lg dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-200 dark:hover:border-neutral-400"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="size-4 transition-transform duration-300 group-hover:translate-y-0.5"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            Download
          </a>
        </div>
      </Container>
      <Container>
        <DottedSeparator className="my-8" />
      </Container>
    </>
  );
}
