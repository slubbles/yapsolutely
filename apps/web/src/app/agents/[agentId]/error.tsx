"use client";

import { useEffect } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import Link from "next/link";

export default function AgentDetailError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("agent detail error:", error);
  }, [error]);

  return (
    <DashboardLayout>
      <div className="p-5 sm:p-8 max-w-[900px]">
        <div className="bg-surface-panel rounded-card border border-border-soft p-8 text-center">
          <AlertCircle className="w-10 h-10 text-text-subtle/40 mx-auto mb-4" />
          <h2 className="font-display text-lg font-semibold text-text-strong mb-2">
            Couldn&apos;t load agent
          </h2>
          <p className="font-body text-[1.02rem] text-text-subtle mb-6 max-w-md mx-auto">
            There was a problem loading this agent&apos;s details.
          </p>
          <div className="flex items-center justify-center gap-3">
            <Button onClick={reset} variant="outline" size="sm">
              Try again
            </Button>
            <Button asChild variant="ghost" size="sm">
              <Link href="/agents">Back to agents</Link>
            </Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
