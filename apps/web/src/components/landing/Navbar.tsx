"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import ThemeToggle from "@/components/theme-toggle";

const navLinks = [
  { label: "Pricing", href: "/pricing" },
  { label: "Docs", href: "/docs" },
  { label: "API", href: "/docs/api" },
  { label: "About", href: "/about" },
  { label: "Changelog", href: "/changelog" },
];

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-background/90 backdrop-blur-xl border-b border-border/40 shadow-surface-xs" : "bg-transparent"}`}>
      <div className="max-w-7xl mx-auto px-5 sm:px-6 h-[4.25rem] flex items-center justify-between">
        <div className="flex items-center gap-10">
          <Link href="/" className="font-display text-[1.25rem] font-semibold tracking-[-0.025em] text-foreground hover:opacity-80 transition-opacity">
            Yapsolutely
          </Link>
          <div className="hidden lg:flex items-center gap-7">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="font-body text-[0.95rem] text-text-subtle hover:text-foreground transition-colors link-slide"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
        <div className="hidden sm:flex items-center gap-3">
          <ThemeToggle />
          <Button variant="ghost" size="default" className="font-body text-[0.95rem] text-text-subtle" asChild>
            <Link href="/sign-in">Sign in</Link>
          </Button>
          <Button variant="hero" size="lg" className="rounded-full font-display text-[0.95rem] btn-press" asChild>
            <Link href="/sign-up">Get started</Link>
          </Button>
        </div>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="lg:hidden p-2 rounded-lg hover:bg-surface-subtle transition-colors"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
        >
          {mobileOpen ? <X className="w-5 h-5 text-foreground" /> : <Menu className="w-5 h-5 text-foreground" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="lg:hidden bg-background/95 backdrop-blur-xl border-b border-border/40 px-5 pb-5 pt-2 animate-slide-down">
          <div className="flex flex-col gap-3 mb-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="font-body text-[1rem] text-text-body py-1.5"
              >
                {link.label}
              </Link>
            ))}
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex items-center py-1.5">
              <ThemeToggle />
            </div>
            <Button variant="ghost" size="default" className="font-body text-[0.95rem] text-text-subtle justify-start" asChild>
              <Link href="/sign-in" onClick={() => setMobileOpen(false)}>Sign in</Link>
            </Button>
            <Button variant="hero" size="lg" className="rounded-full font-display text-[0.95rem]" asChild>
              <Link href="/sign-up" onClick={() => setMobileOpen(false)}>Get started</Link>
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
