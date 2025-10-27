// /app/dashboard/page.tsx (최종 버전)

"use client"; // 1. useState를 사용하므로 "use client" 필수

import { useState } from "react";
import { DashboardSidebar } from "@/components/dashboard-sidebar";
import { DashboardHeader } from "@/components/dashboard-header";
import { Overview } from "@/components/overview";
import { MapView } from "@/components/map-view";
import { Analytics } from "@/components/analytics";
import { HardwareInterface } from "@/components/hardware-interface";

export default function Dashboard() { 
  const [activeView, setActiveView] = useState<
    "overview" | "map" | "analytics" | "interface"
  >("overview");

  return (
    <div className="flex min-h-screen bg-background">
      <DashboardSidebar activeView={activeView} onViewChange={setActiveView} />

      <div className="flex-1 flex flex-col">
        <DashboardHeader />

        <main className="flex-1 p-6 overflow-auto">
          {/* 4. Overview의 children으로 DeviceTable 직접 렌더링 */}
          {activeView === "overview" && (
            <Overview/>
          )}
          {activeView === "map" && <MapView />}
          {activeView === "analytics" && <Analytics />}
          {activeView === "interface" && <HardwareInterface />}
        </main>
      </div>
    </div>
  );
}