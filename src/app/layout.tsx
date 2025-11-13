import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { ChatWidgetModern } from "@/components/chat-widget";
import { personalInfo } from "@/data/portfolio";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Nuralim - Product & Technology Development Manager",
  description:
    "Product & Technology Development Manager dengan 6+ tahun pengalaman membangun solusi software end-to-end di berbagai domain industri.",
  keywords: [
    "Nuralim",
    "Software Engineer",
    "Product Manager",
    "Technology Lead",
    ".NET Developer",
    "Backend Developer",
    "Indonesia",
  ],
  authors: [{ name: "Nuralim", url: personalInfo.social.linkedin }],
  creator: "Nuralim",
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: "https://nuralim.dev",
    title: "Nuralim - Product & Technology Development Manager",
    description:
      "Product & Technology Development Manager dengan 6+ tahun pengalaman membangun solusi software end-to-end di berbagai domain industri.",
    siteName: "Nuralim Portfolio",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Nuralim Portfolio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Nuralim - Product & Technology Development Manager",
    description:
      "Product & Technology Development Manager dengan 6+ tahun pengalaman membangun solusi software end-to-end.",
    images: ["/og-image.jpg"],
    creator: "@nuralim",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <ChatWidgetModern />
        </ThemeProvider>
      </body>
    </html>
  );
}
