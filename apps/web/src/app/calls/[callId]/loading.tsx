import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Skeleton } from "@/components/ui/skeleton";

export default function CallDetailLoading() {
  return (
    <DashboardLayout>
      <div className="p-5 sm:p-6 lg:p-8 max-w-[1100px]">
        <div className="mb-5">
          <Skeleton className="h-3 w-12 mb-3" />
          <div className="flex items-center gap-2.5 mb-1">
            <Skeleton className="h-5 w-36" />
            <Skeleton className="h-4 w-16 rounded" />
          </div>
          <Skeleton className="h-3.5 w-48" />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-surface-panel rounded-lg border border-border-soft/60 px-4 py-3">
              <Skeleton className="h-2.5 w-14 mb-1" />
              <Skeleton className="h-5 w-12" />
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-5">
          <div className="xl:col-span-8">
            <div className="bg-surface-panel rounded-card border border-border-soft overflow-hidden">
              <div className="px-4 py-3 border-b border-border-soft/60">
                <Skeleton className="h-3.5 w-24" />
              </div>
              <div className="p-4 space-y-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="flex gap-2">
                    <Skeleton className="w-5 h-3 shrink-0" />
                    <div className="flex-1">
                      <Skeleton className="h-2.5 w-12 mb-1.5" />
                      <Skeleton className="h-3.5 w-full" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="xl:col-span-4">
            <div className="bg-surface-panel rounded-card border border-border-soft overflow-hidden">
              <div className="px-4 py-3 border-b border-border-soft/60">
                <Skeleton className="h-3.5 w-20" />
              </div>
              <div className="p-4">
                <Skeleton className="h-16 w-full" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
