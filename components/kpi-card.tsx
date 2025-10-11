import { Card } from "@/components/ui/card"
import type { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface KPICardProps {
  title: string
  value: string
  change: string
  trend: "up" | "down" | "warning"
  icon: LucideIcon
  description: string
}

export function KPICard({ title, value, change, trend, icon: Icon, description }: KPICardProps) {
  return (
    <Card className="p-6">
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="text-3xl font-bold">{value}</p>
          <div className="flex items-center gap-2">
            <span
              className={cn(
                "text-sm font-medium",
                trend === "up" && "text-accent",
                trend === "down" && "text-destructive",
                trend === "warning" && "text-destructive",
              )}
            >
              {change}
            </span>
            <span className="text-xs text-muted-foreground">{description}</span>
          </div>
        </div>
        <div
          className={cn(
            "h-12 w-12 rounded-lg flex items-center justify-center",
            trend === "up" && "bg-accent/10",
            trend === "down" && "bg-destructive/10",
            trend === "warning" && "bg-destructive/10",
          )}
        >
          <Icon
            className={cn(
              "h-6 w-6",
              trend === "up" && "text-accent",
              trend === "down" && "text-destructive",
              trend === "warning" && "text-destructive",
            )}
          />
        </div>
      </div>
    </Card>
  )
}
