"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/components/dashboard/sidebar";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { useApp } from "@/context/app-context";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated } = useApp();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/entrar");
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <div className="ml-64">
        <DashboardHeader />
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
