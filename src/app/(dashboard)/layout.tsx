import { Suspense } from "react";
import { Header } from "@/components/layout/header";
import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <div className="flex flex-1 min-h-0">
        <Suspense fallback={<Skeleton className="hidden lg:block w-64 h-full" />}>
          <DashboardSidebar role="recruiter" />
        </Suspense>
        <main className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </>
  );
}
