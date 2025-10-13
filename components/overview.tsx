"use client"

import DailyList from "@/components/daily-list";
import { Card } from "@/components/ui/card"
import { TrendingDown, Trash2, Users, AlertTriangle } from "lucide-react"
import { KpiCards } from "@/components/kpi-card"
import { UsageChart } from "@/components/usage-chart"
import { DeviceTable } from "@/components/device-table"

export function Overview() {
  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <KpiCards />

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold">시간대별 사용 패턴</h3>
              <p className="text-sm text-muted-foreground">최근 7일 평균</p>
            </div>
            <UsageChart type="hourly" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold">지역별 수거량</h3>
              <p className="text-sm text-muted-foreground">이번 주</p>
            </div>
            <UsageChart type="location" />
          </div>
        </Card>
      </div>

      {/* Device Table */}
      <Card className="p-6">
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold">장비 목록</h3>
            <p className="text-sm text-muted-foreground">최근 업데이트된 장비</p>
          </div>
          <DeviceTable />
        </div>
      </Card>
    </div>
  )
}

<div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6">
  <div className="mb-4">
    <h3 className="text-lg font-semibold">내 데일리</h3>
    <p className="text-sm text-muted-foreground">최근 업로드</p>
  </div>
  <DailyList />
</div>