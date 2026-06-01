import { Suspense } from "react";
import { Header } from "@/components/layout/header";
import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { DashboardMobileNav } from "@/components/dashboard/dashboard-mobile-nav";
import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <div className="flex flex-1 min-h-0 min-w-0 flex-col lg:flex-row">
        <Suspense fallback={null}>
          <DashboardMobileNav role="recruiter" />
        </Suspense>
        <Suspense fallback={<Skeleton className="hidden lg:block w-64 h-full shrink-0" />}>
          <DashboardSidebar role="recruiter" />
        </Suspense>
        <main className="flex-1 min-w-0 overflow-x-clip overflow-y-auto p-4 sm:p-6 lg:p-8 pb-24 lg:pb-8 with-compare-bar">
          {children}
        </main>
      </div>
    </>
  );
}
