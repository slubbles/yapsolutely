import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Skeleton } from "@/components/ui/skeleton";

export default function NewAgentLoading() {
  return (
    <DashboardLayout>
      <div className="p-5 sm:p-6 lg:p-8 max-w-[1000px]">
        <div className="mb-5">
          <Skeleton className="h-3 w-16 mb-3" />
          <Skeleton className="h-5 w-36 mb-1" />
          <Skeleton className="h-3.5 w-56" />
        </div>
        <div className="bg-surface-panel rounded-card border border-border-soft overflow-hidden">
          <div className="px-4 py-3 border-b border-border-soft/60">
            <Skeleton className="h-3.5 w-32" />
          </div>
          <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="border border-border-soft/60 rounded-lg p-4">
                <Skeleton className="h-4 w-28 mb-1.5" />
                <Skeleton className="h-3 w-full mb-1" />
                <Skeleton className="h-3 w-3/4" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
