import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardLoading() {
  return (
    <DashboardLayout>
      <div className="p-5 sm:p-6 lg:p-8 max-w-[1100px]">
        <div className="mb-5">
          <Skeleton className="h-5 w-28 mb-1.5" />
          <Skeleton className="h-3.5 w-52" />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-surface-panel rounded-lg border border-border-soft/60 px-4 py-3">
              <Skeleton className="h-2.5 w-16 mb-1" />
              <Skeleton className="h-5 w-10 mb-0.5" />
              <Skeleton className="h-2.5 w-12" />
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
          <div className="xl:col-span-2">
            <div className="bg-surface-panel rounded-card border border-border-soft overflow-hidden">
              <div className="px-4 py-3 border-b border-border-soft/60">
                <Skeleton className="h-3.5 w-24" />
              </div>
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="px-4 py-2.5 border-b border-border-soft/30 last:border-0 flex items-center gap-2.5">
                  <Skeleton className="w-3 h-3 rounded-full" />
                  <div className="flex-1">
                    <Skeleton className="h-3.5 w-24 mb-1" />
                    <Skeleton className="h-2.5 w-36" />
                  </div>
                  <Skeleton className="h-3.5 w-12" />
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-4">
            <div className="bg-surface-panel rounded-card border border-border-soft overflow-hidden">
              <div className="px-4 py-3 border-b border-border-soft/60">
                <Skeleton className="h-3.5 w-24" />
              </div>
              <div className="px-4 py-2 space-y-2">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="flex items-center justify-between py-1.5">
                    <Skeleton className="h-3 w-16" />
                    <Skeleton className="h-3 w-6" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
