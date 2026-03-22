"use client";

import { useEffect } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

export default function SettingsError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("settings error:", error);
  }, [error]);

  return (
    <DashboardLayout>
      <div className="p-5 sm:p-8 max-w-[900px]">
        <div className="bg-surface-panel rounded-card border border-border-soft p-8 text-center">
          <AlertCircle className="w-10 h-10 text-text-subtle/40 mx-auto mb-4" />
          <h2 className="font-display text-lg font-semibold text-text-strong mb-2">
            Something went wrong
          </h2>
          <p className="font-body text-[1.02rem] text-text-subtle mb-6 max-w-md mx-auto">
            We couldn&apos;t load settings. This is usually a temporary issue.
          </p>
          <Button onClick={reset} variant="outline" size="sm">
            Try again
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
}
