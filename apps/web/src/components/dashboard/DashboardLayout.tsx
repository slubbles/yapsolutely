"use client";

import AppNavRail from "./AppNavRail";
import SectionContextPane from "./SectionContextPane";
import { useUser } from "@/components/user-context";

interface DashboardLayoutProps {
  children: React.ReactNode;
  user?: { name?: string | null; email?: string | null; plan?: string | null };
}

const DashboardLayout = ({ children, user: userProp }: DashboardLayoutProps) => {
  const contextUser = useUser();
  const user = userProp ?? contextUser;

  return (
    <div className="flex min-h-screen bg-canvas">
      <AppNavRail user={user ?? undefined} />
      <SectionContextPane />
      <main className="flex-1 min-w-0 overflow-auto pt-14 md:pt-0">
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;
