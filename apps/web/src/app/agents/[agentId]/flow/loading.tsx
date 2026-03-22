import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Skeleton } from "@/components/ui/skeleton";

export default function FlowBuilderLoading() {
  return (
    <DashboardLayout>
      <div className="p-5 sm:p-8 max-w-[1200px]">
        <div className="mb-8">
          <Skeleton className="h-3 w-28 mb-4" />
          <Skeleton className="h-7 w-48 mb-2" />
          <Skeleton className="h-4 w-96" />
        </div>
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-5">
          <div className="xl:col-span-1 order-2 xl:order-1">
            <div className="bg-surface-panel rounded-card border border-border-soft p-4 space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </div>
          </div>
          <div className="xl:col-span-3 order-1 xl:order-2">
            <Skeleton className="h-64 w-full rounded-card" />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
