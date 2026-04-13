"use client";

import { useState, useRef, useEffect } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

export const PdfViewer = ({ url }: { url: string }) => {
  const [numPages, setNumPages] = useState<number>(0);
  const [width, setWidth] = useState<number>(700);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        setWidth(containerRef.current.clientWidth);
      }
    };
    updateWidth();
    const observer = new ResizeObserver(updateWidth);
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className="w-full">
      <Document
        file={url}
        externalLinkTarget="_blank"
        onLoadSuccess={({ numPages }) => setNumPages(numPages)}
        loading={
          <div className="flex h-[60vh] items-center justify-center text-foreground/40 text-sm">
            Loading resume...
          </div>
        }
        error={
          <div className="flex h-[60vh] items-center justify-center text-red-500 text-sm">
            Failed to load PDF.
          </div>
        }
        className="flex flex-col items-center gap-0 overflow-hidden rounded-lg"
      >
        {Array.from({ length: numPages }, (_, i) => (
          <Page
            key={i}
            pageNumber={i + 1}
            width={width}
            renderTextLayer={true}
            renderAnnotationLayer={true}
            className="w-full dark:invert dark:hue-rotate-180"
          />
        ))}
      </Document>
    </div>
  );
};
