"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Menu, X, ChevronDown, Bot, Phone, FileText, BarChart3, Workflow, Sparkles, ArrowRight } from "lucide-react";
import ThemeToggle from "@/components/theme-toggle";

const productLinks = [
  { label: "Voice Agents", href: "/features/voice-agents", description: "AI-powered phone agents", icon: Bot },
  { label: "Phone Numbers", href: "/features/phone-numbers", description: "Provision and assign numbers", icon: Phone },
  { label: "Transcripts", href: "/features/transcripts", description: "Full call transcription", icon: FileText },
  { label: "Call Analytics", href: "/features/call-analytics", description: "Logs and performance data", icon: BarChart3 },
  { label: "Flow Builder", href: "/features/flow-builder", description: "Visual conversation design", icon: Workflow },
  { label: "AI Prompts", href: "/features/ai-prompts", description: "Auto-generated instructions", icon: Sparkles },
];

const navLinks = [
  { label: "Pricing", href: "/pricing" },
  { label: "Docs", href: "/docs" },
  { label: "About", href: "/about" },
  { label: "Support", href: "/support" },
];

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [productOpen, setProductOpen] = useState(false);
  const [mobileProductOpen, setMobileProductOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setProductOpen(false);
      }
    };
    if (productOpen) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [productOpen]);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-background/80 backdrop-blur-2xl border-b border-border/30 shadow-[0_1px_3px_rgba(0,0,0,0.04)]"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-6">
        <div className="h-16 flex items-center justify-between">
          {/* Logo + nav */}
          <div className="flex items-center gap-1">
            <Link
              href="/"
              className="font-display text-[1.2rem] font-bold tracking-[-0.03em] text-foreground hover:opacity-80 transition-opacity mr-8"
            >
              <span className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-lg bg-foreground flex items-center justify-center">
                  <span className="text-[0.8rem] font-black text-background">Y</span>
                </span>
                Yapsolutely
              </span>
            </Link>

            <div className="hidden lg:flex items-center">
              {/* Product dropdown */}
              <div ref={dropdownRef} className="relative">
                <button
                  onClick={() => setProductOpen(!productOpen)}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-lg font-body text-[0.88rem] transition-all duration-150 ${
                    productOpen
                      ? "text-foreground bg-surface-subtle/60"
                      : "text-text-subtle hover:text-foreground hover:bg-surface-subtle/40"
                  }`}
                >
                  Product
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${productOpen ? "rotate-180" : ""}`} />
                </button>

                {productOpen && (
                  <div className="absolute top-full left-0 mt-2 w-[440px] bg-background/95 backdrop-blur-2xl border border-border/40 rounded-2xl shadow-xl p-2 animate-slide-down">
                    <div className="grid grid-cols-2 gap-0.5">
                      {productLinks.map((link) => (
                        <Link
                          key={link.href}
                          href={link.href}
                          onClick={() => setProductOpen(false)}
                          className="flex items-start gap-3 rounded-xl p-3 hover:bg-surface-subtle/60 transition-colors group"
                        >
                          <div className="w-8 h-8 rounded-lg bg-foreground/[0.05] flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-foreground/[0.08] transition-colors">
                            <link.icon className="w-4 h-4 text-text-body" />
                          </div>
                          <div>
                            <span className="font-display text-[0.82rem] font-semibold text-foreground block leading-tight">
                              {link.label}
                            </span>
                            <span className="font-body text-[0.7rem] text-text-subtle leading-snug">
                              {link.description}
                            </span>
                          </div>
                        </Link>
                      ))}
                    </div>
                    <div className="border-t border-border/30 mt-1 pt-1 px-1">
                      <Link
                        href="/pricing"
                        onClick={() => setProductOpen(false)}
                        className="flex items-center justify-between rounded-lg px-3 py-2.5 hover:bg-surface-subtle/60 transition-colors group"
                      >
                        <span className="font-body text-[0.78rem] text-text-subtle group-hover:text-foreground transition-colors">View all features &amp; pricing</span>
                        <ArrowRight className="w-3.5 h-3.5 text-text-subtle/50 group-hover:text-foreground group-hover:translate-x-0.5 transition-all" />
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="px-3 py-1.5 rounded-lg font-body text-[0.88rem] text-text-subtle hover:text-foreground hover:bg-surface-subtle/40 transition-all duration-150"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Right side */}
          <div className="hidden sm:flex items-center gap-2">
            <ThemeToggle />
            <Link
              href="/sign-in"
              className="px-3 py-1.5 rounded-lg font-body text-[0.88rem] text-text-subtle hover:text-foreground hover:bg-surface-subtle/40 transition-all duration-150"
            >
              Sign in
            </Link>
            <Button
              size="default"
              className="rounded-full font-display text-[0.85rem] font-medium bg-foreground text-background hover:bg-foreground/90 px-5 h-9 btn-press shadow-sm"
              asChild
            >
              <Link href="/sign-up">
                Start building free
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Link>
            </Button>
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-2 rounded-lg hover:bg-surface-subtle/60 transition-colors"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
          >
            {mobileOpen ? <X className="w-5 h-5 text-foreground" /> : <Menu className="w-5 h-5 text-foreground" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden bg-background/95 backdrop-blur-2xl border-b border-border/30 px-5 pb-5 pt-2 animate-slide-down">
          <div className="flex flex-col gap-0.5 mb-4">
            <button
              onClick={() => setMobileProductOpen(!mobileProductOpen)}
              className="font-body text-[0.95rem] text-text-body py-2.5 px-2 rounded-lg hover:bg-surface-subtle/40 flex items-center justify-between transition-colors"
            >
              Product
              <ChevronDown className={`w-4 h-4 text-text-subtle transition-transform duration-200 ${mobileProductOpen ? "rotate-180" : ""}`} />
            </button>
            {mobileProductOpen && (
              <div className="pl-2 pb-1 space-y-0.5">
                {productLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => { setMobileOpen(false); setMobileProductOpen(false); }}
                    className="flex items-center gap-3 rounded-lg py-2.5 px-3 hover:bg-surface-subtle/60 transition-colors"
                  >
                    <link.icon className="w-4 h-4 text-text-subtle shrink-0" />
                    <div>
                      <span className="font-body text-[0.85rem] text-text-body block leading-tight">{link.label}</span>
                      <span className="font-body text-[0.65rem] text-text-subtle">{link.description}</span>
                    </div>
                  </Link>
                ))}
              </div>
            )}

            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="font-body text-[0.95rem] text-text-body py-2.5 px-2 rounded-lg hover:bg-surface-subtle/40 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="border-t border-border/30 pt-4 flex flex-col gap-2">
            <div className="flex items-center px-2 py-1.5">
              <ThemeToggle />
            </div>
            <Link
              href="/sign-in"
              onClick={() => setMobileOpen(false)}
              className="font-body text-[0.88rem] text-text-subtle py-2.5 px-2 rounded-lg hover:bg-surface-subtle/40 transition-colors"
            >
              Sign in
            </Link>
            <Button size="lg" className="rounded-full font-display text-[0.88rem] bg-foreground text-background hover:bg-foreground/90" asChild>
              <Link href="/sign-up" onClick={() => setMobileOpen(false)}>
                Start building free
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Link>
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
