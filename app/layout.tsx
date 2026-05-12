import type { Metadata } from "next";
import { Geist, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Nav } from "@/components/layout/nav";
import { Footer } from "@/components/layout/footer";

const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

const siteUrl = "https://jstalin.dev";

export const metadata: Metadata = {
  title: "Jose Stalin Andrade Cartuche — Data Architect & AI Architect",
  description:
    "Portfolio of Jose Stalin Andrade Cartuche — Data Architect, AI Architect, and Data Solution Architect. Building scalable data platforms and AI-powered solutions.",
  metadataBase: new URL(siteUrl),
  openGraph: {
    type: "website",
    url: siteUrl,
    title: "Jose Stalin Andrade Cartuche — Data Architect & AI Architect",
    description:
      "Portfolio of Jose Stalin Andrade Cartuche — Data Architect, AI Architect, and Data Solution Architect.",
    siteName: "JStalin.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "JStalin. — Data Architect & AI Architect",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Jose Stalin Andrade Cartuche — Data Architect & AI Architect",
    description:
      "Portfolio of Jose Stalin Andrade Cartuche — Data Architect, AI Architect, and Data Solution Architect.",
    images: ["/og-image.png"],
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
    <html
      lang="en"
      className={`${geist.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-midnight text-bone font-sans">
        <Nav />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
