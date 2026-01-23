import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { ChatWidgetProvider } from "@/components/chat-widget-provider";
import { personalInfo, about } from "@/data/portfolio";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});


export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL("https://nuralim.dev"),
  title: `Nuralim - Product & Technology Development Manager | ${about.metrics[0].value} Years Experience`,
  description:
    `Nuralim: Product & Technology Development Manager dengan ${about.metrics[0].value} tahun pengalaman membangun solusi software end-to-end. Spesialisasi dalam .NET, Backend Development, dan Technical Leadership di Indonesia.`,
  keywords: [
    "Nuralim",
    "Nuralim.dev",
    "Product & Technology Development Manager",
    "Software Engineer",
    "Product Manager",
    "Technology Lead",
    "Technical Lead",
    ".NET Developer",
    "Next.js Developer",
    "C# Developer",
    "Backend Developer",
    "Microservices Architecture",
    "Software Architect",
    "Team Lead",
    "Engineering Manager",
    "Indonesia",
    "Jakarta",
    "Portfolio",
  ],
  alternates: {
    canonical: "https://nuralim.dev",
  },
  authors: [{ name: "Nuralim", url: personalInfo.social.linkedin }],
  creator: "Nuralim",
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: "https://nuralim.dev",
    title: "Nuralim - Product & Technology Development Manager",
    description:
      `${about.metrics[0].value} tahun pengalaman membangun solusi software scalable dan memberdayakan tim engineering excellence.`,
    siteName: "Nuralim Portfolio",
    images: [
      {
        url: "https://nuralim.dev/og",
        width: 1200,
        height: 630,
        alt: "Nuralim - Product & Technology Development Manager",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Nuralim - Product & Technology Development Manager",
    description:
      `${about.metrics[0].value} tahun pengalaman dalam software engineering, product development, dan technical leadership.`,
    images: ["https://nuralim.dev/og"],
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
  verification: {
    google: "sFXAYSel4Ugp208zkp16wm48cKIgHYH9bEeiA9WEqq4",
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
          forcedTheme={undefined}
        >
          {children}
          <ChatWidgetProvider />
        </ThemeProvider>
      </body>
    </html>
  );
}
