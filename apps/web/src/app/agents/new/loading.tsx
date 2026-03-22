import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Skeleton } from "@/components/ui/skeleton";

export default function NewAgentLoading() {
  return (
    <DashboardLayout>
      <div className="p-5 sm:p-8 max-w-[900px]">
        <div className="flex items-center gap-3 mb-6">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-8 w-40" />
        </div>
        <div className="bg-surface-panel rounded-card border border-border-soft p-6">
          <Skeleton className="h-6 w-48 mb-6" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="border border-border-soft rounded-xl p-5">
                <Skeleton className="h-5 w-32 mb-2" />
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
