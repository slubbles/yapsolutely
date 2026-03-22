"use client";

import Link from "next/link";
import { useState } from "react";

const links = [
  { label: "Product", href: "#product" },
  { label: "How it works", href: "#workflow" },
  { label: "Platform", href: "#platform" },
  { label: "Pricing", href: "#pricing" },
];

export function LandingNavbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="fixed left-0 right-0 top-0 z-50 border-b border-black/5 bg-white/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-6">
        <div className="flex items-center gap-10">
          <Link href="/" className="font-display text-lg font-semibold tracking-[-0.02em] text-[var(--text-strong)]">
            Yapsolutely
          </Link>

          <div className="hidden items-center gap-8 md:flex">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="font-body text-[0.8rem] text-[var(--text-subtle)] transition-colors hover:text-[var(--text-strong)]"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>

        <div className="hidden items-center gap-3 sm:flex">
          <Link
            href="/sign-in"
            className="font-body rounded-full px-3 py-2 text-[0.8rem] text-[var(--text-subtle)] transition-colors hover:text-[var(--text-strong)]"
          >
            Sign in
          </Link>
          <Link
            href="/sign-in"
            className="font-display rounded-full bg-[var(--text-strong)] px-5 py-3 text-sm font-medium text-white transition hover:bg-[color:rgba(22,24,29,0.92)]"
          >
            Get started
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setMobileOpen((value) => !value)}
          className="rounded-lg p-2 text-[var(--text-strong)] transition-colors hover:bg-[var(--surface-subtle)] sm:hidden"
          aria-label={mobileOpen ? "Close navigation" : "Open navigation"}
        >
          {mobileOpen ? "✕" : "☰"}
        </button>
      </div>

      {mobileOpen ? (
        <div className="border-b border-black/5 bg-white px-5 pb-5 pt-2 sm:hidden">
          <div className="mb-4 flex flex-col gap-3">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="font-body py-1 text-[0.85rem] text-[var(--text-body)]"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="flex flex-col gap-2">
            <Link
              href="/sign-in"
              onClick={() => setMobileOpen(false)}
              className="font-body rounded-xl px-3 py-2.5 text-[0.82rem] text-[var(--text-subtle)] transition-colors hover:bg-[var(--surface-subtle)] hover:text-[var(--text-strong)]"
            >
              Sign in
            </Link>
            <Link
              href="/sign-in"
              onClick={() => setMobileOpen(false)}
              className="font-display rounded-full bg-[var(--text-strong)] px-5 py-3 text-center text-sm font-medium text-white transition hover:bg-[color:rgba(22,24,29,0.92)]"
            >
              Get started
            </Link>
          </div>
        </div>
      ) : null}
    </nav>
  );
}