"use client"

import { Card } from "@/components/ui/card"
import { TrendingDown, Trash2, Users, AlertTriangle } from "lucide-react"
import { KPICard } from "@/components/kpi-card"
import { UsageChart } from "@/components/usage-chart"
import { DeviceTable } from "@/components/device-table"

export function Overview() {
  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="민원 감소율"
          value="42.3%"
          change="+12.5%"
          trend="up"
          icon={TrendingDown}
          description="전월 대비"
        />
        <KPICard title="장비 사용률" value="87.2%" change="+5.3%" trend="up" icon={Users} description="평균 사용률" />
        <KPICard title="총 수거량" value="24,891" change="+1,234" trend="up" icon={Trash2} description="이번 달" />
        <KPICard
          title="장비 상태"
          value="48/52"
          change="4개 점검 필요"
          trend="warning"
          icon={AlertTriangle}
          description="정상 작동 중"
        />
      </div>

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
