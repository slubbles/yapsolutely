import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Skeleton } from "@/components/ui/skeleton";

export default function AgentDetailLoading() {
  return (
    <DashboardLayout>
      <div className="p-5 sm:p-6 lg:p-8 max-w-[1100px]">
        <Skeleton className="h-3 w-16 mb-3" />
        <div className="flex items-start justify-between gap-4 mb-3">
          <div>
            <div className="flex items-center gap-2.5 mb-1">
              <Skeleton className="h-5 w-36" />
              <Skeleton className="h-4 w-14 rounded" />
            </div>
            <Skeleton className="h-3.5 w-48" />
          </div>
          <div className="flex items-center gap-1.5">
            <Skeleton className="h-7 w-16 rounded-md" />
            <Skeleton className="h-7 w-16 rounded-md" />
          </div>
        </div>
        <Skeleton className="h-8 w-64 rounded-lg mb-5" />
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-surface-panel rounded-lg border border-border-soft/60 px-4 py-3">
              <Skeleton className="h-2.5 w-16 mb-1" />
              <Skeleton className="h-5 w-10" />
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
