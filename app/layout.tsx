import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { SITE_CONFIG } from "@/lib/data";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-mono",
  display: "swap",
});


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
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="bg-bg text-text-primary font-body min-h-screen flex flex-col antialiased">
        {/* Global background — grid + ambient glow */}
        <div
          className="fixed inset-0 opacity-[0.03] pointer-events-none z-0"
          style={{
            backgroundImage:
              "linear-gradient(#00E676 1px, transparent 1px), linear-gradient(90deg, #00E676 1px, transparent 1px)",
            backgroundSize: "80px 80px",
          }}
        />
        <div className="fixed top-1/4 right-1/4 w-[300px] h-[300px] md:w-[600px] md:h-[600px] rounded-full bg-[#00E676]/5 blur-[120px] pointer-events-none z-0" />

        <Navbar />
        <main className="flex-1 relative z-10">{children}</main>

      </body>
    </html>
  );
}
