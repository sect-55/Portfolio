import type { Metadata } from "next";
import { InspirationContent } from "@/components/inspiration-content";

export const metadata: Metadata = {
  title: "Favorites",
  description:
    "People and accounts that I follow and look up to.",
  alternates: {
    canonical: "/inspiration",
  },
};

export default async function InspirationPage() {
  return (
    <InspirationContent />
  );
}
