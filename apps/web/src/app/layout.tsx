import type { Metadata } from "next";
import localFont from "next/font/local";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { UserProvider } from "@/components/user-context";
import ThemeProvider from "@/components/theme-provider";
import { getSession } from "@/lib/auth";
import "./globals.css";

const generalSans = localFont({
  src: [
    {
      path: "./fonts/general-sans-400.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/general-sans-500.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "./fonts/general-sans-600.woff2",
      weight: "600",
      style: "normal",
    },
    {
      path: "./fonts/general-sans-700.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-general-sans",
  display: "swap",
});

const satoshi = localFont({
  src: [
    {
      path: "./fonts/satoshi-400.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/satoshi-500.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "./fonts/satoshi-700.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-satoshi",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Yapsolutely | AI Voice Agent Platform",
    template: "%s | Yapsolutely",
  },
  description:
    "Build, deploy, and manage AI voice agents for inbound phone calls. Configure agents, assign numbers, view transcripts, and test conversations, all from one dashboard.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://yapsolutely.com"),
  openGraph: {
    title: "Yapsolutely | AI Voice Agent Platform",
    description:
      "Build, deploy, and manage AI voice agents for inbound phone calls. Configure agents, assign numbers, view transcripts, and test conversations, all from one dashboard.",
    siteName: "Yapsolutely",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Yapsolutely | AI Voice Agent Platform",
    description:
      "Build, deploy, and manage AI voice agents for inbound phone calls.",
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getSession();
  return (
    <html
      lang="en"
      className={`${generalSans.variable} ${satoshi.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full bg-[var(--background)] text-[var(--foreground)]">
        <ThemeProvider>
          <UserProvider user={session}>
            <TooltipProvider delayDuration={300}>
              {children}
            </TooltipProvider>
          </UserProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
