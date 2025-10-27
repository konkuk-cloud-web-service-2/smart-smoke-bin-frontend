"use client"

import { Card } from "@/components/ui/card"
import { TrendingDown, Trash2, Users, AlertTriangle, Loader2 } from "lucide-react"
import { KPICard } from "@/components/kpi-card"
import { UsageChart } from "@/components/usage-chart"
import { useState, useEffect } from "react" // 1. useState, useEffect 임포트
import { DeviceTable } from "./device-table"

// 2. API 응답 데이터의 타입을 정의합니다 (타입스크립트용)
// 1. 차트 데이터에 대한 정확한 타입을 먼저 정의합니다.
interface TimePattern {
  time_slot: number;
  count: number;
  label: string;
}

interface RegionalCollection {
  district_name: string;
  total_drops: number;
}


interface DashboardData {
  time_pattern: TimePattern[]; 
  regional_collection: RegionalCollection[]; 
  metrics: {
    complaint_reduction_rate: {
      current: number;
      change: number;
    };
    device_utilization_rate: {
      current: number;
      change: number;
    };
    total_collection_volume: number;
    device_status: {
      active: number;
      total: number;
    };
  };
}

export function Overview() {

  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {

        const res = await fetch(`https://u0r3k4is4k.execute-api.ap-northeast-2.amazonaws.com/Prod/dashboard/overview`, {
          cache: 'no-store'
        });
        const response = await res.json();
        setData(response.data);
      } catch (error) {
        console.error("Failed to fetch overview data:", error);
      } finally {
        setIsLoading(false); 
      }
    }
    fetchData();
  }, []); 


  if (isLoading || !data) {
    return (
      <div className="flex min-h-[400px] w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }


  return (
    <div className="space-y-6">

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="민원 감소율"
          value={`${data.metrics.complaint_reduction_rate.current}%`}
          change={`${data.metrics.complaint_reduction_rate.change > 0 ? '+' : ''}${data.metrics.complaint_reduction_rate.change}%`}
          trend={data.metrics.complaint_reduction_rate.change > 0 ? "up" : "down"}
          icon={TrendingDown}
          description="전월 대비"
        />
        <KPICard
          title="장비 사용률"
          value={`${data.metrics.device_utilization_rate.current}%`}
          change={`${data.metrics.device_utilization_rate.change > 0 ? '+' : ''}${data.metrics.device_utilization_rate.change}%`}
          trend={data.metrics.device_utilization_rate.change > 0 ? "up" : "down"}
          icon={Users}
          description="평균 사용률"
        />
        <KPICard
          title="총 수거량"
          value={data.metrics.total_collection_volume.toLocaleString()}
          change={"+8.4%"}
          trend="up"
          icon={Trash2}
          description="이번 달"
        />
        <KPICard
          title="장비 상태"
          value={`${data.metrics.device_status.active}/${data.metrics.device_status.total}`}
          change={`${data.metrics.device_status.total - data.metrics.device_status.active}개 점검 필요`}
          trend="warning"
          icon={AlertTriangle}
          description="정상 작동 중"
        />
      </div>


      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold">시간대별 사용 패턴</h3>
              <p className="text-sm text-muted-foreground">최근 7일 평균</p>
            </div>

            <UsageChart type="hourly" data={data.time_pattern} />
          </div>
        </Card>

        <Card className="p-6">
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold">지역별 수거량</h3>
              <p className="text-sm text-muted-foreground">이번 주</p>
            </div>

            <UsageChart type="location" data={data.regional_collection} />
          </div>
        </Card>
      </div>


      <Card className="p-6">
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold">장비 목록</h3>
            <p className="text-sm text-muted-foreground">최근 업데이트된 장비</p>
          </div>
          <DeviceTable/>
        </div>
      </Card>
    </div>
  )
}