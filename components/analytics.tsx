"use client"

import { Card } from "@/components/ui/card"
import { UsageChart } from "@/components/usage-chart"
import { TrendingUp, Calendar, MapPin, Clock } from "lucide-react"

export function Analytics() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">데이터 분석</h2>
        <p className="text-muted-foreground">사용 패턴과 트렌드를 분석하여 정책 효과를 측정합니다</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-chart-1/10 flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-chart-1" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">주간 증가율</p>
              <p className="text-xl font-bold">+18.2%</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-chart-2/10 flex items-center justify-center">
              <Calendar className="h-5 w-5 text-chart-2" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">일평균 수거</p>
              <p className="text-xl font-bold">829개</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-chart-3/10 flex items-center justify-center">
              <MapPin className="h-5 w-5 text-chart-3" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">활성 지역</p>
              <p className="text-xl font-bold">25개구</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-chart-4/10 flex items-center justify-center">
              <Clock className="h-5 w-5 text-chart-4" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">피크 시간</p>
              <p className="text-xl font-bold">12-14시</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-6">
        <Card className="p-6">
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold">시간대별 사용 패턴</h3>
              <p className="text-sm text-muted-foreground">최근 7일 평균 데이터</p>
            </div>
            <UsageChart type="hourly" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold">지역별 수거량 분석</h3>
              <p className="text-sm text-muted-foreground">이번 주 누적 데이터</p>
            </div>
            <UsageChart type="location" />
          </div>
        </Card>
      </div>

      {/* Insights */}
      <Card className="p-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">주요 인사이트</h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-4 bg-muted/30 rounded-lg">
              <div className="h-2 w-2 rounded-full bg-chart-1 mt-2" />
              <div>
                <p className="font-medium">점심시간 사용량 급증</p>
                <p className="text-sm text-muted-foreground">12-14시 사이 평균 대비 2.3배 높은 사용률을 보입니다</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 bg-muted/30 rounded-lg">
              <div className="h-2 w-2 rounded-full bg-chart-2 mt-2" />
              <div>
                <p className="font-medium">강남구 추가 설치 필요</p>
                <p className="text-sm text-muted-foreground">강남구의 포화율이 다른 지역 대비 1.8배 높습니다</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 bg-muted/30 rounded-lg">
              <div className="h-2 w-2 rounded-full bg-chart-3 mt-2" />
              <div>
                <p className="font-medium">민원 감소 효과 확인</p>
                <p className="text-sm text-muted-foreground">스마트 빈 설치 후 해당 지역 민원이 42% 감소했습니다</p>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
