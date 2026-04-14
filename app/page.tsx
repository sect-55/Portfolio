import type { Metadata } from "next";
import Container from "@/components/container";
import { Header } from "@/components/header";
import { Work } from "@/components/work";
import { DottedSeparator } from "@/components/separator";
import { Companies } from "@/components/companies";
import { WorkWithMe } from "@/components/work-with-me";
import { PdfPrefetcher } from "@/components/pdf-prefetcher";

export const metadata: Metadata = {
  title: "Home",
  description: "Backend engineer focused on authentication, rate limiting, caching, and containerized services.",
  alternates: {
    canonical: "/",
  },
};

export default async function Home() {
  return (
    <Container>
      <PdfPrefetcher />
      <Header />
      <DottedSeparator className="my-6" />
      <Work />
      <DottedSeparator className="my-6" />
      <Companies />
      <DottedSeparator className="my-6" />
      <WorkWithMe />
      <DottedSeparator className="my-6" />
    </Container>
  );
}
