"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Check } from "lucide-react";

const steps = [
  { title: "Name your workspace", description: "This is where your team will manage agents and calls." },
  { title: "What will you use Yapsolutely for?", description: "Helps us tailor your workspace." },
  { title: "You're ready", description: "Your workspace is set up. Start by creating your first agent." },
];

const useCases = [
  "Inbound sales",
  "Customer support",
  "Appointment booking",
  "Front desk",
  "Lead qualification",
  "Other",
];

interface OnboardingModalProps {
  onComplete: () => void;
}

const OnboardingModal = ({ onComplete }: OnboardingModalProps) => {
  const [step, setStep] = useState(0);
  const [workspace, setWorkspace] = useState("");
  const [selectedUseCase, setSelectedUseCase] = useState("");
  const [transitioning, setTransitioning] = useState(false);
  const current = steps[step];

  const animateStep = (nextStep: number) => {
    setTransitioning(true);
    setTimeout(() => {
      setStep(nextStep);
      setTransitioning(false);
    }, 150);
  };

  const next = () => {
    if (step < steps.length - 1) {
      animateStep(step + 1);
    } else {
      onComplete();
    }
  };

  const back = () => {
    if (step > 0) animateStep(step - 1);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center animate-fade-in">
      <div className="absolute inset-0 bg-foreground/40 backdrop-blur-sm" />
      <div className="relative w-full max-w-content-form mx-4 bg-surface-panel rounded-2xl shadow-surface-xl border border-border-soft overflow-hidden animate-scale-in">
        {/* Progress bar */}
        <div className="flex gap-1.5 px-8 pt-8">
          {steps.map((_, i) => (
            <div
              key={i}
              className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                i <= step ? "bg-foreground" : "bg-border-soft"
              }`}
            />
          ))}
        </div>

        {/* Content */}
        <div
          className={`px-8 pt-8 pb-2 transition-all duration-150 ${
            transitioning ? "opacity-0 translate-y-1" : "opacity-100 translate-y-0"
          }`}
        >
          <h2 className="font-display text-[1.4rem] font-semibold tracking-[-0.025em] text-text-strong leading-[1.2] mb-1.5">
            {current.title}
          </h2>
          <p className="font-body text-body-md text-text-subtle leading-relaxed mb-7">
            {current.description}
          </p>

          {step === 0 && (
            <div className="space-y-1.5">
              <Label className="font-body text-body-sm text-text-body">Workspace name</Label>
              <Input
                value={workspace}
                onChange={(e) => setWorkspace(e.target.value)}
                placeholder="Acme Inc."
                className="h-11 rounded-xl"
                autoFocus
              />
            </div>
          )}

          {step === 1 && (
            <div className="grid grid-cols-2 gap-2">
              {useCases.map((uc) => (
                <button
                  key={uc}
                  onClick={() => setSelectedUseCase(uc)}
                  className={`h-11 rounded-xl border font-body text-body-sm transition-all duration-150 ${
                    selectedUseCase === uc
                      ? "border-foreground bg-foreground text-primary-foreground"
                      : "border-border-soft bg-surface-panel text-text-body hover:border-foreground/20 hover:bg-surface-subtle/40"
                  }`}
                >
                  {uc}
                </button>
              ))}
            </div>
          )}

          {step === 2 && (
            <div className="bg-surface-subtle rounded-xl p-5 border border-border-soft">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-400/10 flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-4 h-4 text-emerald-600" />
                </div>
                <p className="font-body text-body-md text-text-body leading-relaxed">
                  <span className="font-medium text-text-strong">{workspace || "Your workspace"}</span> is ready. Head to Agents to create your first voice agent and assign a number.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-8 pt-6 pb-8">
          <div>
            {step > 0 ? (
              <button
                onClick={back}
                className="font-body text-body-sm text-text-subtle hover:text-text-strong transition-colors"
              >
                Back
              </button>
            ) : (
              <button
                onClick={() => onComplete()}
                className="font-body text-body-sm text-text-subtle hover:text-text-strong transition-colors"
              >
                Skip setup
              </button>
            )}
          </div>
          <Button
            onClick={next}
            size="default"
            className="font-display font-medium tracking-[-0.01em] text-body-md h-10 rounded-xl px-6"
          >
            {step === steps.length - 1 ? "Go to Agents" : "Continue"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OnboardingModal;
