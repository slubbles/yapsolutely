"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

const STORAGE_KEY = "yapsolutely_agents_onboarding_dismissed";

const steps = [
  {
    title: "Create the first agent",
    body: "Define the role, opening line, prompt, and voice so the product has a real operator-ready starting point.",
  },
  {
    title: "Assign a number",
    body: "Map inbound traffic to that agent so the runtime can resolve calls cleanly instead of improvising with chaos.",
  },
  {
    title: "Review the result",
    body: "Use transcripts, statuses, and runtime actions to prove the call path actually worked after hang-up.",
  },
];

type AgentsOnboardingOverlayProps = {
  forceVisible?: boolean;
};

export function AgentsOnboardingOverlay({ forceVisible = false }: AgentsOnboardingOverlayProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [visible, setVisible] = useState(() => {
    if (typeof window === "undefined") {
      return forceVisible;
    }

    try {
      const dismissed = window.localStorage.getItem(STORAGE_KEY);
      return forceVisible || !dismissed;
    } catch {
      return true;
    }
  });

  function clearOnboardingParam() {
    if (!searchParams?.has("onboarding")) {
      return;
    }

    const nextParams = new URLSearchParams(searchParams.toString());
    nextParams.delete("onboarding");

    const nextUrl = nextParams.size > 0 ? `${pathname}?${nextParams.toString()}` : pathname;
    router.replace(nextUrl);
  }

  function dismiss() {
    try {
      window.localStorage.setItem(STORAGE_KEY, "1");
    } catch {
      // no-op
    }

    clearOnboardingParam();
    setVisible(false);
  }

  if (!visible) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[color:rgba(17,19,23,0.42)] px-4 py-6 backdrop-blur-sm sm:px-6">
      <div className="relative max-h-[calc(100vh-3rem)] w-full max-w-5xl overflow-auto rounded-[32px] border border-[var(--border-soft)] bg-[var(--surface-panel)] p-6 shadow-[0_32px_80px_rgba(16,24,40,0.2)] sm:p-7 lg:p-8">
        <div className="pointer-events-none absolute right-[-40px] top-[-56px] h-40 w-40 rounded-full bg-[color:rgba(238,189,142,0.16)] blur-2xl" />
        <div className="pointer-events-none absolute bottom-[-70px] left-[-40px] h-44 w-44 rounded-full bg-[color:rgba(32,36,43,0.06)] blur-2xl" />

        <div className="relative flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-3xl">
            <div className="inline-flex rounded-full bg-[var(--surface-subtle)] px-3 py-1 text-[0.66rem] font-semibold uppercase tracking-[0.18em] text-[var(--text-subtle)]">
              First-run guide
            </div>
            <h2 className="mt-4 font-display text-[1.8rem] font-semibold tracking-[-0.05em] text-[var(--text-strong)] sm:text-[2.2rem]">
              Start with one clean voice workflow.
            </h2>
            <p className="mt-3 max-w-2xl text-[0.92rem] leading-7 text-[var(--text-body)]">
              This workspace is happiest when the first path is obvious: create an agent, assign a number, then review the call proof. No scavenger hunt required.
            </p>
          </div>

          <button
            type="button"
            onClick={dismiss}
            className="self-start rounded-[14px] border border-[var(--border-soft)] bg-[var(--surface-subtle)] px-3 py-2 text-[0.76rem] font-medium text-[var(--text-body)] transition hover:text-[var(--text-strong)]"
          >
            Dismiss
          </button>
        </div>

        <div className="relative mt-6 grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
            {steps.map((step, index) => (
              <div
                key={step.title}
                className="rounded-[22px] border border-[var(--border-soft)] bg-[var(--surface-subtle)]/72 p-4"
              >
                <div className="text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-[var(--text-subtle)]">
                  Step {index + 1}
                </div>
                <h3 className="mt-3 text-[0.98rem] font-semibold text-[var(--text-strong)]">{step.title}</h3>
                <p className="mt-2 text-[0.8rem] leading-6 text-[var(--text-body)]">{step.body}</p>
              </div>
            ))}
          </div>

          <div className="rounded-[26px] bg-[var(--surface-dark)] p-5 text-[var(--surface-dark-foreground)] shadow-[var(--shadow-md)]">
            <div className="text-[0.64rem] font-semibold uppercase tracking-[0.18em] text-[color:rgba(229,226,225,0.56)]">
              Golden path
            </div>
            <h3 className="mt-4 font-display text-[1.35rem] font-semibold tracking-[-0.04em] text-[var(--surface-dark-foreground)]">
              The first live demo should feel boring in the best possible way.
            </h3>
            <p className="mt-3 text-[0.86rem] leading-7 text-[color:rgba(229,226,225,0.72)]">
              One agent, one number, one clean transcript trail. That is enough to prove the product works before the fancier toys enter the room.
            </p>

            <div className="mt-6 space-y-3">
              <Link
                href="/agents/new"
                onClick={clearOnboardingParam}
                className="inline-flex w-full items-center justify-center rounded-[18px] bg-white px-4 py-3 text-sm font-medium text-[var(--surface-dark)] transition hover:bg-[color:rgba(255,255,255,0.92)]"
              >
                Create first agent
              </Link>
              <Link
                href="/numbers"
                onClick={clearOnboardingParam}
                className="inline-flex w-full items-center justify-center rounded-[18px] border border-white/12 bg-white/8 px-4 py-3 text-sm font-medium text-white transition hover:bg-white/12"
              >
                Review number routing
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
