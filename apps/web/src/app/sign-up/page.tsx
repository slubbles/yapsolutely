"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { signUpAction } from "@/app/_actions/auth";
import { Separator } from "@/components/ui/separator";

export default function SignUpPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ fullName?: string; email?: string; password?: string }>({});
  const [isLoading, setIsLoading] = useState(false);

  const validate = () => {
    const e: typeof errors = {};
    if (!fullName.trim()) e.fullName = "Name is required";
    if (!email.trim()) e.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = "Enter a valid email address";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setIsLoading(true);
    const formData = new FormData();
    formData.set("email", email);
    formData.set("name", fullName);
    if (password) formData.set("password", password);
    await signUpAction(formData);
  };

  return (
    <div className="min-h-screen bg-canvas flex">
      <div className="flex-1 flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-content-auth animate-fade-in" style={{ animationDelay: "0.05s" }}>
          <Link href="/" className="inline-block mb-14 group">
            <span className="font-display text-lg font-semibold tracking-[-0.02em] text-text-strong group-hover:opacity-70 transition-opacity">
              Yapsolutely
            </span>
          </Link>

          <h1 className="font-display text-[1.75rem] font-semibold tracking-[-0.03em] text-text-strong leading-[1.15] mb-2">
            Create your account
          </h1>
          <p className="font-body text-body-md text-text-subtle leading-relaxed mb-10">
            You&apos;ll set up your workspace after signing up.
          </p>

          <a
            href="/api/auth/google?intent=sign-up"
            className="flex items-center justify-center gap-3 w-full h-11 rounded-xl border border-border bg-background font-display font-medium text-body-md text-text-strong hover:bg-muted transition-colors mb-6"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18A10.96 10.96 0 0 0 1 12c0 1.77.42 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </a>

          <div className="relative mb-6">
            <Separator />
            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-canvas px-3 font-body text-label text-text-subtle">
              or
            </span>
          </div>

          <form className="space-y-4 mb-6" onSubmit={handleSubmit} noValidate>
            <div className="space-y-1.5">
              <Label className="font-body text-body-sm text-text-body">Full name</Label>
              <Input
                type="text"
                value={fullName}
                onChange={(e) => { setFullName(e.target.value); if (errors.fullName) setErrors(prev => ({ ...prev, fullName: undefined })); }}
                placeholder="Jane Smith"
                className={`h-11 rounded-xl ${errors.fullName ? "border-destructive ring-1 ring-destructive/20" : ""}`}
              />
              {errors.fullName && <p className="font-body text-label text-destructive animate-slide-down">{errors.fullName}</p>}
            </div>
            <div className="space-y-1.5">
              <Label className="font-body text-body-sm text-text-body">Email</Label>
              <Input
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); if (errors.email) setErrors(prev => ({ ...prev, email: undefined })); }}
                placeholder="you@company.com"
                className={`h-11 rounded-xl ${errors.email ? "border-destructive ring-1 ring-destructive/20" : ""}`}
              />
              {errors.email && <p className="font-body text-label text-destructive animate-slide-down">{errors.email}</p>}
            </div>
            <div className="space-y-1.5">
              <Label className="font-body text-body-sm text-text-body">Password</Label>
              <Input
                type="password"
                value={password}
                onChange={(e) => { setPassword(e.target.value); if (errors.password) setErrors(prev => ({ ...prev, password: undefined })); }}
                placeholder="At least 8 characters"
                className={`h-11 rounded-xl ${errors.password ? "border-destructive ring-1 ring-destructive/20" : ""}`}
              />
              {errors.password && <p className="font-body text-label text-destructive animate-slide-down">{errors.password}</p>}
              <p className="font-body text-[0.65rem] text-text-subtle">Optional — leave blank for passwordless sign-up</p>
            </div>
            <Button
              type="submit"
              size="lg"
              disabled={isLoading}
              className="w-full font-display font-medium tracking-[-0.01em] text-body-md h-11 rounded-xl transition-all duration-200"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="w-3.5 h-3.5 border-2 border-background/30 border-t-background rounded-full animate-spin" />
                  Creating account…
                </span>
              ) : "Create account with email"}
            </Button>
          </form>

          <p className="font-body text-body-sm text-text-subtle text-center">
            Already have an account?{" "}
            <Link href="/sign-in" className="text-text-strong font-medium hover:underline underline-offset-4 transition-colors">Sign in</Link>
          </p>
        </div>
      </div>

      <div className="hidden lg:flex flex-1 items-center justify-center bg-surface-dark p-16">
        <div className="max-w-sm animate-fade-in" style={{ animationDelay: "0.2s" }}>
          <p className="font-display text-[1.5rem] font-semibold tracking-[-0.025em] text-surface-dark-foreground leading-[1.25] mb-4">
            Your voice operations workspace, ready in minutes.
          </p>
          <p className="font-body text-body-md text-surface-dark-foreground/40 leading-relaxed">
            Create agents, assign numbers, and start handling calls — all from one dashboard.
          </p>
        </div>
      </div>
    </div>
  );
}
