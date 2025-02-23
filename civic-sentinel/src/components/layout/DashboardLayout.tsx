
import { MainSidebar } from "@/components/sidebar/MainSidebar";
import { useState, useEffect } from "react";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="flex min-h-screen">
      <MainSidebar className="w-64 hidden md:flex" />
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
