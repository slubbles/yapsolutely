import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Skeleton } from "@/components/ui/skeleton";

export default function AgentEditLoading() {
  return (
    <DashboardLayout>
      <div className="p-5 sm:p-8 max-w-[900px]">
        <div className="flex items-center gap-3 mb-6">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-8 w-48" />
        </div>
        <div className="space-y-5">
          <div className="bg-surface-panel rounded-card border border-border-soft p-6">
            <Skeleton className="h-5 w-24 mb-4" />
            <Skeleton className="h-10 w-full rounded-lg mb-4" />
            <Skeleton className="h-5 w-28 mb-4" />
            <Skeleton className="h-10 w-full rounded-lg" />
          </div>
          <div className="bg-surface-panel rounded-card border border-border-soft p-6">
            <Skeleton className="h-5 w-32 mb-4" />
            <Skeleton className="h-32 w-full rounded-lg" />
          </div>
          <div className="flex justify-end gap-3">
            <Skeleton className="h-9 w-20 rounded-lg" />
            <Skeleton className="h-9 w-28 rounded-lg" />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
