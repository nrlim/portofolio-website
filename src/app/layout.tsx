import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { ChatWidgetProvider } from "@/components/chat-widget-provider";

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
  title: {
    default: `Nuralim - Product & Technology Development Manager | Nuralim Dev`,
    template: `%s | Nuralim Dev`,
  },
  description:
    "Nuralim (nuralim.dev): Product & Technology Development Manager dengan 7+ tahun pengalaman membangun solusi software end-to-end. Spesialisasi dalam .NET, Next.js, Backend Development, dan Technical Leadership di Indonesia.",
  keywords: [
    "Nuralim",
    "Nuralim Dev",
    "nuralim.dev",
    "Nuralim Portfolio",
    "Product & Technology Development Manager",
    "Software Engineer Indonesia",
    "Product Manager Jakarta",
    "Technology Lead",
    "Technical Lead .NET",
    ".NET Developer Indonesia",
    "Next.js Developer Jakarta",
    "C# Developer",
    "Backend Developer",
    "Microservices Architecture",
    "Software Architect",
    "Engineering Manager Indonesia",
  ],
  alternates: {
    canonical: "https://nuralim.dev",
  },
  authors: [{ name: "Nuralim", url: "https://nuralim.dev" }],
  creator: "Nuralim",
  publisher: "Nuralim",
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: "https://nuralim.dev",
    title: "Nuralim - Product & Technology Development Manager | Nuralim Dev",
    description:
      "Expert dalam membangun scalable software dan memberdayakan tim engineering excellence. 7+ tahun pengalaman profesional di berbagai industri.",
    siteName: "Nuralim Portfolio",
  },
  twitter: {
    card: "summary_large_image",
    title: "Nuralim - Product & Technology Development Manager | Nuralim Dev",
    description:
      "7+ tahun pengalaman dalam software engineering, product development, dan technical leadership.",
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
  icons: {
    icon: "/personal-logo-bnw.png",
    apple: "/personal-logo-bnw.png",
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
