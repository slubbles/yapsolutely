import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Skeleton } from "@/components/ui/skeleton";

export default function NumbersLoading() {
  return (
    <DashboardLayout>
      <div className="p-5 sm:p-6 lg:p-8 max-w-[1100px]">
        <div className="flex items-center justify-between mb-5">
          <div>
            <Skeleton className="h-5 w-24 mb-1" />
            <Skeleton className="h-3 w-52" />
          </div>
          <Skeleton className="h-7 w-24 rounded-lg" />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-surface-panel rounded-lg border border-border-soft/60 px-4 py-3">
              <Skeleton className="h-2.5 w-14 mb-1" />
              <Skeleton className="h-5 w-8" />
            </div>
          ))}
        </div>
        <div className="bg-surface-panel rounded-card border border-border-soft overflow-hidden">
          <div className="px-4 py-2 border-b border-border-soft/80">
            <Skeleton className="h-2.5 w-full" />
          </div>
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 px-4 py-2.5 border-b border-border-soft/50 last:border-0">
              <Skeleton className="h-3.5 w-28" />
              <Skeleton className="h-4 w-16 rounded" />
              <Skeleton className="h-3.5 w-24" />
              <Skeleton className="h-3.5 w-20 ml-auto" />
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
