"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Menu, X, ChevronDown, Bot, Phone, FileText, BarChart3, Workflow, Sparkles } from "lucide-react";
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
  { label: "Changelog", href: "/changelog" },
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

  /* Close dropdown on outside click */
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
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-background/90 backdrop-blur-xl border-b border-border/40 shadow-surface-xs" : "bg-transparent"}`}>
      <div className="max-w-7xl mx-auto px-5 sm:px-6 h-[4.25rem] flex items-center justify-between">
        <div className="flex items-center gap-10">
          <Link href="/" className="font-display text-[1.25rem] font-semibold tracking-[-0.025em] text-foreground hover:opacity-80 transition-opacity">
            Yapsolutely
          </Link>
          <div className="hidden lg:flex items-center gap-7">
            {/* Product dropdown */}
            <div ref={dropdownRef} className="relative">
              <button
                onClick={() => setProductOpen(!productOpen)}
                className="font-body text-[0.95rem] text-text-subtle hover:text-foreground transition-colors link-slide flex items-center gap-1"
              >
                Product
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${productOpen ? "rotate-180" : ""}`} />
              </button>

              {productOpen && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-[420px] bg-background/95 backdrop-blur-xl border border-border/40 rounded-2xl shadow-lg p-3 animate-slide-down">
                  <div className="grid grid-cols-2 gap-1">
                    {productLinks.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setProductOpen(false)}
                        className="flex items-start gap-3 rounded-xl p-3 hover:bg-surface-subtle/60 transition-colors group"
                      >
                        <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center shrink-0 mt-0.5">
                          <link.icon className="w-4 h-4 text-text-body" />
                        </div>
                        <div>
                          <span className="font-display text-[0.85rem] font-medium text-foreground block leading-tight group-hover:text-foreground">
                            {link.label}
                          </span>
                          <span className="font-body text-[0.72rem] text-text-subtle leading-snug">
                            {link.description}
                          </span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

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
          <div className="flex flex-col gap-1 mb-4">
            {/* Mobile Product accordion */}
            <button
              onClick={() => setMobileProductOpen(!mobileProductOpen)}
              className="font-body text-[1rem] text-text-body py-2 flex items-center justify-between"
            >
              Product
              <ChevronDown className={`w-4 h-4 text-text-subtle transition-transform duration-200 ${mobileProductOpen ? "rotate-180" : ""}`} />
            </button>
            {mobileProductOpen && (
              <div className="pl-3 pb-2 space-y-0.5">
                {productLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => { setMobileOpen(false); setMobileProductOpen(false); }}
                    className="flex items-center gap-3 rounded-lg py-2 px-2 hover:bg-surface-subtle/60 transition-colors"
                  >
                    <link.icon className="w-4 h-4 text-text-subtle shrink-0" />
                    <div>
                      <span className="font-body text-[0.88rem] text-text-body block leading-tight">{link.label}</span>
                      <span className="font-body text-[0.68rem] text-text-subtle">{link.description}</span>
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
                className="font-body text-[1rem] text-text-body py-2"
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
