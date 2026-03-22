"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Sparkles, Check } from "lucide-react";

type Step = "role" | "agents" | "industry";

const ROLE_OPTIONS = [
  { value: "founder", label: "Founder / CEO", desc: "Building the product vision" },
  { value: "engineering", label: "Engineering", desc: "Technical implementation" },
  { value: "operations", label: "Operations", desc: "Managing day-to-day workflows" },
  { value: "sales", label: "Sales / Support", desc: "Customer-facing team" },
  { value: "other", label: "Other", desc: "Something else entirely" },
];

const AGENT_COUNT_OPTIONS = [
  { value: "1", label: "Just 1", desc: "Starting with a single agent" },
  { value: "2-5", label: "2–5 agents", desc: "Small team of voice agents" },
  { value: "6-20", label: "6–20 agents", desc: "Growing operation" },
  { value: "20+", label: "20+ agents", desc: "Enterprise scale" },
];

const INDUSTRY_OPTIONS = [
  { value: "healthcare", label: "Healthcare" },
  { value: "real-estate", label: "Real Estate" },
  { value: "legal", label: "Legal Services" },
  { value: "financial", label: "Financial Services" },
  { value: "saas", label: "SaaS / Technology" },
  { value: "retail", label: "Retail / E-commerce" },
  { value: "services", label: "Professional Services" },
  { value: "other", label: "Other" },
];

export default function OnboardingPage() {
  const [step, setStep] = useState<Step>("role");
  const [role, setRole] = useState("");
  const [agentCount, setAgentCount] = useState("");
  const [industry, setIndustry] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleComplete = async () => {
    setIsLoading(true);
    // TODO: wire to real onboarding action that saves preferences
    window.location.href = "/dashboard";
  };

  const canProceed = () => {
    if (step === "role") return !!role;
    if (step === "agents") return !!agentCount;
    if (step === "industry") return !!industry;
    return false;
  };

  const handleNext = () => {
    if (step === "role") setStep("agents");
    else if (step === "agents") setStep("industry");
    else handleComplete();
  };

  const stepIndex = step === "role" ? 0 : step === "agents" ? 1 : 2;

  return (
    <div className="min-h-screen bg-canvas flex">
      {/* Left: survey panel */}
      <div className="flex-1 flex flex-col px-6 sm:px-10 py-8">
        <div className="flex items-center justify-between mb-auto">
          <Link href="/verify-identity" className="inline-flex items-center gap-2 group">
            <ArrowLeft className="w-4 h-4 text-text-subtle group-hover:text-foreground transition-colors" />
            <span className="font-display text-sm font-semibold tracking-[-0.02em] text-text-strong group-hover:opacity-80 transition-opacity">
              Yapsolutely
            </span>
          </Link>
          <div className="flex items-center gap-1.5">
            {[0, 1, 2].map((i) => (
              <span key={i} className={`w-6 h-1 rounded-full transition-colors ${i <= stepIndex ? "bg-foreground" : "bg-border"}`} />
            ))}
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center">
          <div className="w-full max-w-content-form animate-fade-in" key={step}>
            <div className="w-10 h-10 rounded-xl bg-surface-elevated border border-border-soft/30 flex items-center justify-center mb-6 shadow-surface-xs">
              <Sparkles className="w-5 h-5 text-text-body" />
            </div>

            {step === "role" && (
              <>
                <h1 className="font-display text-[1.5rem] sm:text-[1.75rem] font-semibold tracking-[-0.03em] text-text-strong leading-[1.15] mb-2">
                  What&apos;s your role?
                </h1>
                <p className="font-body text-body-md text-text-subtle leading-relaxed mb-8">
                  This helps us personalize your workspace experience.
                </p>
                <div className="space-y-2.5">
                  {ROLE_OPTIONS.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setRole(option.value)}
                      className={`w-full flex items-center gap-4 p-4 rounded-xl border transition-all duration-150 text-left ${
                        role === option.value
                          ? "border-foreground bg-surface-elevated shadow-surface-xs"
                          : "border-border-soft/40 bg-surface-panel hover:border-border hover:bg-surface-elevated"
                      }`}
                    >
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                        role === option.value ? "border-foreground bg-foreground" : "border-border"
                      }`}>
                        {role === option.value && <Check className="w-3 h-3 text-primary-foreground" />}
                      </div>
                      <div>
                        <div className="font-display text-body-md font-medium text-text-strong">{option.label}</div>
                        <div className="font-body text-[0.89rem] text-text-subtle">{option.desc}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </>
            )}

            {step === "agents" && (
              <>
                <h1 className="font-display text-[1.5rem] sm:text-[1.75rem] font-semibold tracking-[-0.03em] text-text-strong leading-[1.15] mb-2">
                  How many agents do you need?
                </h1>
                <p className="font-body text-body-md text-text-subtle leading-relaxed mb-8">
                  You can always add more later. This helps us set up defaults.
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {AGENT_COUNT_OPTIONS.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setAgentCount(option.value)}
                      className={`flex flex-col p-5 rounded-xl border transition-all duration-150 text-left ${
                        agentCount === option.value
                          ? "border-foreground bg-surface-elevated shadow-surface-xs"
                          : "border-border-soft/40 bg-surface-panel hover:border-border hover:bg-surface-elevated"
                      }`}
                    >
                      <div className="font-display text-lg font-semibold text-text-strong mb-1">{option.label}</div>
                      <div className="font-body text-[0.89rem] text-text-subtle">{option.desc}</div>
                    </button>
                  ))}
                </div>
              </>
            )}

            {step === "industry" && (
              <>
                <h1 className="font-display text-[1.5rem] sm:text-[1.75rem] font-semibold tracking-[-0.03em] text-text-strong leading-[1.15] mb-2">
                  What industry are you in?
                </h1>
                <p className="font-body text-body-md text-text-subtle leading-relaxed mb-8">
                  We&apos;ll suggest agent templates and configurations that fit your business.
                </p>
                <div className="grid grid-cols-2 gap-2.5">
                  {INDUSTRY_OPTIONS.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setIndustry(option.value)}
                      className={`flex items-center gap-3 p-4 rounded-xl border transition-all duration-150 text-left ${
                        industry === option.value
                          ? "border-foreground bg-surface-elevated shadow-surface-xs"
                          : "border-border-soft/40 bg-surface-panel hover:border-border hover:bg-surface-elevated"
                      }`}
                    >
                      <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors ${
                        industry === option.value ? "border-foreground bg-foreground" : "border-border"
                      }`}>
                        {industry === option.value && <Check className="w-2.5 h-2.5 text-primary-foreground" />}
                      </div>
                      <span className="font-display text-body-md font-medium text-text-strong">{option.label}</span>
                    </button>
                  ))}
                </div>
              </>
            )}

            <div className="flex items-center gap-3 mt-8">
              {step !== "role" && (
                <Button
                  variant="ghost"
                  size="lg"
                  onClick={() => setStep(step === "industry" ? "agents" : "role")}
                  className="font-body text-text-subtle"
                >
                  Back
                </Button>
              )}
              <Button
                size="lg"
                disabled={!canProceed() || isLoading}
                onClick={handleNext}
                className="flex-1 font-display font-medium tracking-[-0.01em] text-body-md h-11 rounded-xl transition-all duration-200"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-3.5 h-3.5 border-2 border-primary-foreground/30 border-t-background rounded-full animate-spin" />
                    Setting up…
                  </span>
                ) : step === "industry" ? (
                  "Enter workspace"
                ) : (
                  <span className="flex items-center gap-1.5">
                    Continue
                    <ArrowRight className="w-4 h-4" />
                  </span>
                )}
              </Button>
            </div>

            <div className="mt-6 text-center">
              <button
                onClick={handleComplete}
                className="font-body text-[0.89rem] text-text-subtle/60 hover:text-text-subtle transition-colors"
              >
                Skip for now
              </button>
            </div>
          </div>
        </div>

        <div className="mt-auto pt-6">
          <p className="font-body text-[0.82rem] text-text-subtle/50">© 2025 Yapsolutely, Inc.</p>
        </div>
      </div>

      {/* Right: context panel */}
      <div className="hidden lg:flex flex-1 bg-surface-dark rounded-l-[2rem] p-12 xl:p-16 items-center justify-center relative overflow-hidden">
        <div className="max-w-md animate-fade-in" style={{ animationDelay: "0.2s" }}>
          <span className="font-body text-[0.77rem] text-surface-dark-foreground/20 uppercase tracking-[0.2em] block mb-6">Workspace setup</span>
          <p className="font-display text-[1.75rem] font-semibold tracking-[-0.025em] text-surface-dark-foreground leading-[1.2] mb-6">
            A few questions to personalize your experience.
          </p>
          <p className="font-body text-body-md text-surface-dark-foreground/35 leading-relaxed mb-10">
            Your answers help us suggest the right agent templates, voice settings, and integrations for your use case.
          </p>

          <div className="bg-surface-dark-foreground/5 rounded-2xl p-6">
            <div className="space-y-4">
              {[
                { step: "1", label: "Confirm email", status: "done" },
                { step: "2", label: "Verify identity", status: "done" },
                { step: "3", label: "Set up workspace", status: "current" },
              ].map((item) => (
                <div key={item.step} className="flex items-center gap-4">
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center font-mono text-xs ${
                    item.status === "done" ? "bg-emerald-400/15 text-emerald-400/70" :
                    "bg-surface-dark-foreground/15 text-surface-dark-foreground/70"
                  }`}>
                    {item.status === "done" ? "✓" : item.step}
                  </div>
                  <span className={`font-body text-[1.02rem] ${
                    item.status === "done" ? "text-surface-dark-foreground/40 line-through" :
                    "text-surface-dark-foreground/60"
                  }`}>
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
