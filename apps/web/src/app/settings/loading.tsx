import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Skeleton } from "@/components/ui/skeleton";

export default function SettingsLoading() {
  return (
    <DashboardLayout>
      <div className="p-5 sm:p-6 lg:p-8 max-w-[800px]">
        <div className="mb-5">
          <Skeleton className="h-5 w-24 mb-1.5" />
          <Skeleton className="h-3 w-56" />
        </div>
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-surface-panel rounded-card border border-border-soft overflow-hidden">
              <div className="px-4 py-3 border-b border-border-soft/60">
                <Skeleton className="h-3.5 w-32 mb-1" />
                <Skeleton className="h-2.5 w-48" />
              </div>
              <div className="px-4 py-2 space-y-1">
                {Array.from({ length: 3 }).map((_, j) => (
                  <div key={j} className="flex items-center justify-between py-2">
                    <Skeleton className="h-3 w-32" />
                    <Skeleton className="h-4 w-4 rounded-full" />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
