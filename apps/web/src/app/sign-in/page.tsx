"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { signInAction } from "@/app/_actions/auth";
import { ArrowLeft, Phone, Shield, BarChart3, Eye, EyeOff } from "lucide-react";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const validate = () => {
    const e: typeof errors = {};
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
    if (password) formData.set("password", password);
    await signInAction(formData);
  };

  return (
    <div className="min-h-screen bg-canvas flex">
      {/* Left: form panel */}
      <div className="flex-1 flex flex-col px-6 sm:px-10 py-8">
        <div className="flex items-center justify-between mb-auto">
          <Link href="/" className="inline-flex items-center gap-2 group">
            <ArrowLeft className="w-4 h-4 text-text-subtle group-hover:text-foreground transition-colors" />
            <span className="font-display text-sm font-semibold tracking-[-0.02em] text-text-strong group-hover:opacity-80 transition-opacity">
              Yapsolutely
            </span>
          </Link>
        </div>

        <div className="flex-1 flex items-center justify-center">
          <div className="w-full max-w-content-auth animate-fade-in" style={{ animationDelay: "0.05s" }}>
            <h1 className="font-display text-[1.5rem] sm:text-[1.75rem] font-semibold tracking-[-0.03em] text-text-strong leading-[1.15] mb-2">
              Welcome back
            </h1>
            <p className="font-body text-body-md text-text-subtle leading-relaxed mb-8">
              Sign in to your voice operations workspace.
            </p>

            <a
              href="/api/auth/google?intent=sign-in"
              className="flex items-center justify-center gap-3 w-full h-11 rounded-xl border border-border bg-surface-panel font-display font-medium text-body-md text-text-strong hover:bg-muted transition-colors mb-6 shadow-surface-xs"
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
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); if (errors.password) setErrors(prev => ({ ...prev, password: undefined })); }}
                    placeholder="Enter your password"
                    className="h-11 rounded-xl pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-text-subtle hover:text-foreground transition-colors"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <p className="font-body text-[0.65rem] text-text-subtle">Leave blank for passwordless sign-in</p>
              </div>
              <Button
                type="submit"
                size="lg"
                disabled={isLoading}
                className="w-full font-display font-medium tracking-[-0.01em] text-body-md h-11 rounded-xl transition-all duration-200 btn-press"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-3.5 h-3.5 border-2 border-primary-foreground/30 border-t-background rounded-full animate-spin" />
                    Signing in…
                  </span>
                ) : "Sign in with email"}
              </Button>
            </form>

            <p className="font-body text-body-sm text-text-subtle text-center">
              Don&apos;t have an account?{" "}
              <Link href="/sign-up" className="text-text-strong font-medium hover:underline underline-offset-4 transition-colors">Create one</Link>
            </p>

            <p className="font-body text-[0.68rem] text-text-subtle/60 text-center mt-4 leading-[1.6]">
              By signing in you agree to our{" "}
              <Link href="/terms" className="underline underline-offset-2 hover:text-text-subtle transition-colors">Terms of Service</Link>{" "}
              and{" "}
              <Link href="/privacy" className="underline underline-offset-2 hover:text-text-subtle transition-colors">Privacy Policy</Link>.
            </p>
          </div>
        </div>

        <div className="mt-auto pt-6">
          <p className="font-body text-[0.65rem] text-text-subtle/50">© 2025 Yapsolutely, Inc.</p>
        </div>
      </div>

      {/* Right: product context panel */}
      <div className="hidden lg:flex flex-1 bg-surface-dark rounded-l-[2rem] p-12 xl:p-16 items-center justify-center relative overflow-hidden">
        <div className="max-w-md animate-fade-in" style={{ animationDelay: "0.2s" }}>
          <span className="font-body text-[0.6rem] text-surface-dark-foreground/20 uppercase tracking-[0.2em] block mb-6">Voice operations platform</span>
          <p className="font-display text-[1.75rem] font-semibold tracking-[-0.025em] text-surface-dark-foreground leading-[1.2] mb-6">
            Build, deploy, and monitor voice agents from one workspace.
          </p>
          <p className="font-body text-body-md text-surface-dark-foreground/35 leading-relaxed mb-10">
            Assign real phone numbers, configure routing rules, and review every conversation with full transcripts.
          </p>

          {/* Feature pills */}
          <div className="flex flex-wrap gap-2.5">
            {[
              { icon: Phone, label: "Dedicated numbers" },
              { icon: Shield, label: "Full transcripts" },
              { icon: BarChart3, label: "Call analytics" },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-surface-dark-foreground/5">
                <Icon className="w-3.5 h-3.5 text-surface-dark-foreground/25" />
                <span className="font-body text-[0.72rem] text-surface-dark-foreground/40">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
