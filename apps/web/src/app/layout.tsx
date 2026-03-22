import type { Metadata } from "next";
import localFont from "next/font/local";
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
  title: "Yapsolutely",
  description:
    "Retell-inspired AI voice agent platform for inbound calls, agents, and transcripts.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${generalSans.variable} ${satoshi.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-[var(--background)] text-[var(--foreground)]">
        {children}
      </body>
    </html>
  );
}
