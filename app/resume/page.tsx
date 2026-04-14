import type { Metadata } from "next";
import Container from "@/components/container";
import { DottedSeparator } from "@/components/separator";
import { PdfViewerWrapper } from "@/components/pdf-viewer-wrapper";
import { PDF_URL } from "@/lib/pdf-cache";

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
          <div className="overflow-hidden rounded-lg border border-neutral-200 bg-white dark:border-neutral-700 dark:bg-neutral-900">
            <PdfViewerWrapper url={PDF_URL} />
          </div>
        </div>
      </Container>
      <Container>
        <DottedSeparator className="my-8" />
      </Container>
    </>
  );
}
