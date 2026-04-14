import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Contact — Let's make something amazing",
  description: "Get in touch. Strategy, design, and development for startups and enterprises.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
