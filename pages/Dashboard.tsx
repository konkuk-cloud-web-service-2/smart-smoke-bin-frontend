"use client";

import { KpiCards } from "@/components/kpi-card";
import { UsageChart } from "@/components/usage-chart";
import { MapView } from "@/components/map-view";
import { DeviceTable } from "@/components/device-table";

export default function Dashboard() {
  return (
    <div className="space-y-6 p-6">
      {/* 헤더 */}
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">스마트 스모크 빈 대시보드</h1>
          <p className="text-sm text-muted-foreground">
            실시간 상태, 분석 지표, 지도 현황을 한 곳에서 확인하세요
          </p>
        </div>
      </div>

      {/* KPI 카드 (실데이터 연동 준비됨) */}
      <KpiCards />

      {/* 분석 차트 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl border border-zinc-800 bg-zinc-900/40">
          <div className="mb-4">
            <h3 className="text-lg font-semibold">시간대별 사용 패턴</h3>
            <p className="text-sm text-muted-foreground">최근 7일 평균 데이터</p>
          </div>
          <UsageChart type="hourly" />
        </div>

        <div className="p-6 rounded-2xl border border-zinc-800 bg-zinc-900/40">
          <div className="mb-4">
            <h3 className="text-lg font-semibold">지역별 수거량</h3>
            <p className="text-sm text-muted-foreground">이번 주 누적 데이터</p>
          </div>
          <UsageChart type="location" />
        </div>
      </div>

      {/* 실시간 지도 */}
      <div className="p-6 rounded-2xl border border-zinc-800 bg-zinc-900/40">
        <div className="mb-4">
          <h3 className="text-lg font-semibold">실시간 지도</h3>
          <p className="text-sm text-muted-foreground">
            각 장비의 위치와 상태를 확인하세요
          </p>
        </div>
        <MapView />
      </div>

      {/* 장비 목록 */}
      <div className="p-6 rounded-2xl border border-zinc-800 bg-zinc-900/40">
        <div className="mb-4">
          <h3 className="text-lg font-semibold">장비 목록</h3>
          <p className="text-sm text-muted-foreground">
            적재율과 상태, 최근 업데이트 시간을 확인하세요
          </p>
        </div>
        <DeviceTable />
      </div>
    </div>
  );
}
