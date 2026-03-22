"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/40">
      <div className="max-w-7xl mx-auto px-5 sm:px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-10">
          <span className="font-display text-lg font-semibold tracking-[-0.02em] text-foreground">
            Yapsolutely
          </span>
          <div className="hidden md:flex items-center gap-8">
            <a href="#product" className="font-body text-[0.8rem] text-text-subtle hover:text-foreground transition-colors">Product</a>
            <a href="#workflow" className="font-body text-[0.8rem] text-text-subtle hover:text-foreground transition-colors">How it works</a>
            <a href="#platform" className="font-body text-[0.8rem] text-text-subtle hover:text-foreground transition-colors">Platform</a>
            <a href="#pricing" className="font-body text-[0.8rem] text-text-subtle hover:text-foreground transition-colors">Pricing</a>
          </div>
        </div>
        <div className="hidden sm:flex items-center gap-3">
          <Button variant="ghost" size="sm" className="font-body text-text-subtle" asChild>
            <Link href="/sign-in">Sign in</Link>
          </Button>
          <Button variant="hero" size="default" className="rounded-full font-display" asChild>
            <Link href="/sign-up">Get started</Link>
          </Button>
        </div>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="sm:hidden p-2 rounded-lg hover:bg-surface-subtle transition-colors"
        >
          {mobileOpen ? <X className="w-5 h-5 text-foreground" /> : <Menu className="w-5 h-5 text-foreground" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="sm:hidden bg-background border-b border-border/40 px-5 pb-5 pt-2">
          <div className="flex flex-col gap-3 mb-4">
            <a href="#product" onClick={() => setMobileOpen(false)} className="font-body text-[0.85rem] text-text-body py-1">Product</a>
            <a href="#workflow" onClick={() => setMobileOpen(false)} className="font-body text-[0.85rem] text-text-body py-1">How it works</a>
            <a href="#platform" onClick={() => setMobileOpen(false)} className="font-body text-[0.85rem] text-text-body py-1">Platform</a>
            <a href="#pricing" onClick={() => setMobileOpen(false)} className="font-body text-[0.85rem] text-text-body py-1">Pricing</a>
          </div>
          <div className="flex flex-col gap-2">
            <Button variant="ghost" size="sm" className="font-body text-text-subtle justify-start" asChild>
              <Link href="/sign-in" onClick={() => setMobileOpen(false)}>Sign in</Link>
            </Button>
            <Button variant="hero" size="default" className="rounded-full font-display" asChild>
              <Link href="/sign-up" onClick={() => setMobileOpen(false)}>Get started</Link>
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
