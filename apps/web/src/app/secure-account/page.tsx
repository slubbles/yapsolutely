"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { ArrowLeft, Shield, Lock, CheckCircle2 } from "lucide-react";

export default function SecureAccountPage() {
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState<{ email?: string }>({});
  const [isLoading, setIsLoading] = useState(false);

  const validate = () => {
    const e: typeof errors = {};
    if (!email.trim()) e.email = "Work email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = "Enter a valid email address";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setIsLoading(true);
    // TODO: wire to real email confirmation action
    // For now, redirect to verify-identity
    window.location.href = "/verify-identity";
  };

  return (
    <div className="min-h-screen bg-canvas flex">
      {/* Left: form panel */}
      <div className="flex-1 flex flex-col px-6 sm:px-10 py-8">
        <div className="flex items-center justify-between mb-auto">
          <Link href="/sign-up" className="inline-flex items-center gap-2 group">
            <ArrowLeft className="w-4 h-4 text-text-subtle group-hover:text-foreground transition-colors" />
            <span className="font-display text-sm font-semibold tracking-[-0.02em] text-text-strong group-hover:opacity-80 transition-opacity">
              Yapsolutely
            </span>
          </Link>
          <div className="flex items-center gap-1.5">
            <span className="w-6 h-1 rounded-full bg-foreground" />
            <span className="w-6 h-1 rounded-full bg-border" />
            <span className="w-6 h-1 rounded-full bg-border" />
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center">
          <div className="w-full max-w-content-auth animate-fade-in" style={{ animationDelay: "0.05s" }}>
            <div className="w-10 h-10 rounded-xl bg-surface-elevated border border-border-soft/30 flex items-center justify-center mb-6 shadow-surface-xs">
              <Shield className="w-5 h-5 text-text-body" />
            </div>

            <h1 className="font-display text-[1.5rem] sm:text-[1.75rem] font-semibold tracking-[-0.03em] text-text-strong leading-[1.15] mb-2">
              Secure your account
            </h1>
            <p className="font-body text-body-md text-text-subtle leading-relaxed mb-8">
              Confirm your work email to complete account setup. We&apos;ll send a verification code.
            </p>

            <form className="space-y-4 mb-6" onSubmit={handleSubmit} noValidate>
              <div className="space-y-1.5">
                <Label className="font-body text-body-sm text-text-body">Work email</Label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); if (errors.email) setErrors(prev => ({ ...prev, email: undefined })); }}
                  placeholder="you@company.com"
                  className={`h-11 rounded-xl ${errors.email ? "border-destructive ring-1 ring-destructive/20" : ""}`}
                  autoFocus
                />
                {errors.email && <p className="font-body text-label text-destructive animate-slide-down">{errors.email}</p>}
              </div>
              <Button
                type="submit"
                size="lg"
                disabled={isLoading}
                className="w-full font-display font-medium tracking-[-0.01em] text-body-md h-11 rounded-xl transition-all duration-200"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-3.5 h-3.5 border-2 border-primary-foreground/30 border-t-background rounded-full animate-spin" />
                    Sending code…
                  </span>
                ) : "Send verification code"}
              </Button>
            </form>

            <div className="space-y-3 mt-8 pt-6 border-t border-border-soft/30">
              {[
                { icon: Lock, text: "Your data is encrypted end-to-end" },
                { icon: CheckCircle2, text: "Email verification protects your workspace" },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-2.5">
                  <Icon className="w-3.5 h-3.5 text-text-subtle/50" />
                  <span className="font-body text-[0.72rem] text-text-subtle">{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-auto pt-6">
          <p className="font-body text-[0.65rem] text-text-subtle/50">© 2025 Yapsolutely, Inc.</p>
        </div>
      </div>

      {/* Right: trust panel */}
      <div className="hidden lg:flex flex-1 bg-surface-dark rounded-l-[2rem] p-12 xl:p-16 items-center justify-center relative overflow-hidden">
        <div className="max-w-md animate-fade-in" style={{ animationDelay: "0.2s" }}>
          <span className="font-body text-[0.6rem] text-surface-dark-foreground/20 uppercase tracking-[0.2em] block mb-6">Account security</span>
          <p className="font-display text-[1.75rem] font-semibold tracking-[-0.025em] text-surface-dark-foreground leading-[1.2] mb-6">
            We take security seriously so you can focus on building.
          </p>
          <p className="font-body text-body-md text-surface-dark-foreground/35 leading-relaxed mb-10">
            Email verification ensures only authorized team members access your voice operations workspace.
          </p>

          <div className="bg-surface-dark-foreground/5 rounded-2xl p-6">
            <div className="space-y-4">
              {[
                { step: "1", label: "Confirm email", status: "current" },
                { step: "2", label: "Verify identity", status: "upcoming" },
                { step: "3", label: "Set up workspace", status: "upcoming" },
              ].map((item) => (
                <div key={item.step} className="flex items-center gap-4">
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center font-mono text-xs ${item.status === "current" ? "bg-surface-dark-foreground/15 text-surface-dark-foreground/70" : "bg-surface-dark-foreground/5 text-surface-dark-foreground/20"}`}>
                    {item.step}
                  </div>
                  <span className={`font-body text-[0.82rem] ${item.status === "current" ? "text-surface-dark-foreground/60" : "text-surface-dark-foreground/25"}`}>
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
