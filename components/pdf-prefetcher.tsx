"use client";

import { useEffect } from "react";
import { prefetchPdf } from "@/lib/pdf-cache";

export function PdfPrefetcher() {
  useEffect(() => {
    prefetchPdf();
  }, []);
  return null;
}
