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
  const { isAuthenticated, setUser } = useApp();
  const router = useRouter();

  useEffect(() => {
    // Auto-login for demo purposes
    if (!isAuthenticated) {
      setUser({
        id: "1",
        name: "Luis",
        email: "luis@email.com",
        height: 175,
        weight: 70,
        age: 22,
        goal: "hipertrofia",
        experienceLevel: "intermediario",
      });
    }
  }, [isAuthenticated, setUser]);

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
