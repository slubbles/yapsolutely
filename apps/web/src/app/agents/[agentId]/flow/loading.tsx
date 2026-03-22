import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Skeleton } from "@/components/ui/skeleton";

export default function FlowBuilderLoading() {
  return (
    <DashboardLayout>
      <div className="p-5 sm:p-6 lg:p-8 max-w-[1100px]">
        <div className="mb-5">
          <Skeleton className="h-3 w-20 mb-3" />
          <Skeleton className="h-5 w-32 mb-1" />
          <Skeleton className="h-3.5 w-72" />
        </div>
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-4">
          <div className="xl:col-span-1 order-2 xl:order-1">
            <div className="bg-surface-panel rounded-card border border-border-soft overflow-hidden">
              <div className="px-4 py-3 border-b border-border-soft/60">
                <Skeleton className="h-3.5 w-20" />
              </div>
              <div className="p-3 space-y-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-9 w-full rounded-md" />
                ))}
              </div>
            </div>
          </div>
          <div className="xl:col-span-3 order-1 xl:order-2">
            <Skeleton className="h-56 w-full rounded-card" />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
