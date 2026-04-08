import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { SITE_CONFIG } from "@/lib/data";

export const metadata: Metadata = {
  title: {
    default: `${SITE_CONFIG.name} — ${SITE_CONFIG.title}`,
    template: `%s | ${SITE_CONFIG.name}`,
  },
  description: SITE_CONFIG.tagline,
  keywords: [
    "platform engineer",
    "senior software engineer",
    "developer platform",
    "kafka",
    "java",
    "big data",
    "distributed systems",
  ],
  authors: [{ name: SITE_CONFIG.fullName }],
  openGraph: {
    type: "website",
    locale: "en_US",
    title: `${SITE_CONFIG.name} — ${SITE_CONFIG.title}`,
    description: SITE_CONFIG.tagline,
    siteName: SITE_CONFIG.name,
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_CONFIG.name} — ${SITE_CONFIG.title}`,
    description: SITE_CONFIG.tagline,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-bg text-text-primary font-body min-h-screen flex flex-col antialiased">
        <Navbar />
        <main className="flex-1">{children}</main>
      </body>
    </html>
  );
}
