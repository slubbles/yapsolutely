import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Skeleton } from "@/components/ui/skeleton";

export default function AgentEditLoading() {
  return (
    <DashboardLayout>
      <div className="p-5 sm:p-6 lg:p-8 max-w-[1000px]">
        <div className="mb-5">
          <Skeleton className="h-3 w-16 mb-3" />
          <Skeleton className="h-5 w-40 mb-1" />
          <Skeleton className="h-3.5 w-56" />
        </div>
        <div className="space-y-4">
          <div className="bg-surface-panel rounded-card border border-border-soft overflow-hidden">
            <div className="px-4 py-3 border-b border-border-soft/60">
              <Skeleton className="h-3.5 w-20" />
            </div>
            <div className="p-4 space-y-3">
              <Skeleton className="h-8 w-full rounded-md" />
              <Skeleton className="h-8 w-full rounded-md" />
            </div>
          </div>
          <div className="bg-surface-panel rounded-card border border-border-soft overflow-hidden">
            <div className="px-4 py-3 border-b border-border-soft/60">
              <Skeleton className="h-3.5 w-28" />
            </div>
            <div className="p-4">
              <Skeleton className="h-28 w-full rounded-md" />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Skeleton className="h-8 w-16 rounded-lg" />
            <Skeleton className="h-8 w-24 rounded-lg" />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
