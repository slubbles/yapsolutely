"use client";

import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";

export default function FlowBuilderError({ reset }: { error: Error; reset: () => void }) {
  return (
    <DashboardLayout>
      <div className="flex items-center justify-center h-[calc(100vh-3.5rem)]">
        <div className="text-center">
          <h2 className="font-display text-lg font-semibold text-text-strong mb-2">Failed to load flow builder</h2>
          <p className="font-body text-sm text-text-subtle mb-4">Something went wrong loading this page.</p>
          <Button onClick={reset} variant="outline" size="sm">Try again</Button>
        </div>
      </div>
    </DashboardLayout>
  );
}
