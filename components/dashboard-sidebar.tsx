"use client"

import { LayoutDashboard, Map, BarChart3, Trash2, Monitor } from "lucide-react"
import { cn } from "@/lib/utils"

interface DashboardSidebarProps {
  activeView: "overview" | "map" | "analytics" | "interface"
  onViewChange: (view: "overview" | "map" | "analytics" | "interface") => void
}

const navigation = [
  { name: "개요", icon: LayoutDashboard, view: "overview" as const },
  { name: "지도 뷰", icon: Map, view: "map" as const },
  { name: "분석", icon: BarChart3, view: "analytics" as const },
  { name: "인터페이스", icon: Monitor, view: "interface" as const },
]

export function DashboardSidebar({ activeView, onViewChange }: DashboardSidebarProps) {
  return (
    <aside className="w-64 border-r border-border bg-sidebar">
      <div className="flex h-full flex-col">
        <div className="flex items-center gap-2 px-6 py-6 border-b border-border">
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
            <Trash2 className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-lg font-bold">SmokeBin</span>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-4">
          {navigation.map((item) => {
            const Icon = item.icon
            const isActive = item.view === activeView
            return (
              <button
                key={item.name}
                onClick={() => onViewChange(item.view)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors",
                  isActive
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent/50",
                )}
              >
                <Icon className="h-5 w-5" />
                {item.name}
              </button>
            )
          })}
        </nav>
      </div>
    </aside>
  )
}
