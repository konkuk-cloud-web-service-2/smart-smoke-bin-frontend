"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { UsageChart } from "@/components/usage-chart"
import { TrendingUp, Calendar, MapPin, Clock, Loader2 } from "lucide-react"

// --- 1. API 타입 정의 ---
interface ApiDevice {
  id: string; // 고유 UUID
  device_id: string; // "SB001"
  location: string;
  status: "active" | "maintenance" | "offline" | "full";
}

interface ApiTimePattern {
  label: string;
  drop_count: number;
}

interface ApiWeeklyUsage {
  growth_rate: number;
  trend: "increasing" | "decreasing" | "stable";
}

interface ApiInsight {
  id: number;
  title: string;
  description: string;
  // (나머지 필드는 렌더링에 필요 없으므로 생략)
}

// --- 차트용 타입 ---
interface ChartData {
  label: string;
  count: number;
}
interface LocationChartData {
  district_name: string;
  total_drops: number;
}

// --- 헬퍼 함수 ---
const getStatusText = (status: string) => {
  switch (status) {
    case "active": return "정상";
    case "maintenance": return "점검중";
    case "offline": return "오프라인";
    case "full": return "포화";
    default: return "알 수 없음";
  }
};

function ChartLoader() {
  return (
    <div className="flex h-[300px] w-full items-center justify-center rounded-lg bg-black/20">
      <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
    </div>
  );
}

// --- 컴포넌트 시작 ---
export function Analytics() {
  // 2. State 정의
  // 장치 목록 (Dropdown)
  const [devices, setDevices] = useState<ApiDevice[]>([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string | null>(null);
  const [isListLoading, setIsListLoading] = useState(true);

  // KPI 카드 데이터
  const [weeklyUsage, setWeeklyUsage] = useState<ApiWeeklyUsage | null>(null);
  const [dailyAverage, setDailyAverage] = useState<number | null>(null);
  const [peakHour, setPeakHour] = useState<string>("N/A");
  const [isKpiLoading, setIsKpiLoading] = useState(true);

  // 차트 데이터
  const [hourlyData, setHourlyData] = useState<ChartData[]>([]);
  const [regionalData, setRegionalData] = useState<LocationChartData[]>([]);
  const [isHourlyLoading, setIsHourlyLoading] = useState(true);
  const [isRegionalLoading, setIsRegionalLoading] = useState(true);
  
  // 인사이트 데이터
  const [insights, setInsights] = useState<ApiInsight[]>([]);
  const [isInsightsLoading, setIsInsightsLoading] = useState(true);


  // 3. useEffect 1: 최초 1회 로드 (Dropdown, 지역 차트, 고정 인사이트)
  useEffect(() => {
    async function fetchInitialData() {
      try {
        // 3-1. 장치 목록 (Dropdown)
        const devicesRes = await fetch(`https://u0r3k4is4k.execute-api.ap-northeast-2.amazonaws.com/Prod/devices`, { cache: 'no-store' });
        const devicesResponse = await devicesRes.json();
        const apiData: ApiDevice[] = devicesResponse.data;
        setDevices(apiData);
        if (apiData.length > 0) {
          setSelectedDeviceId(apiData[0].device_id); // 첫 번째 장치를 기본값으로
        }
      } catch (error) {
        console.error("Failed to fetch devices:", error);
      } finally {
        setIsListLoading(false);
      }
      
      try {
        // 3-2. 지역별 차트
        setIsRegionalLoading(true);
        const regionalRes = await fetch(`https://u0r3k4is4k.execute-api.ap-northeast-2.amazonaws.com/Prod/analytics/regional`, { cache: 'no-store' });
        const regionalResponse = await regionalRes.json();
        setRegionalData(regionalResponse.data.regional_stats);
      } catch (error) {
        console.error("Failed to fetch regional data:", error);
      } finally {
        setIsRegionalLoading(false);
      }

      try {
        // 3-3. 고정 인사이트
        setIsInsightsLoading(true);
        const insightsRes = await fetch(`https://u0r3k4is4k.execute-api.ap-northeast-2.amazonaws.com/Prod/analytics/insights`, { cache: 'no-store' });
        const insightsResponse = await insightsRes.json();
        setInsights(insightsResponse.data.insights);
      } catch (error) {
        console.error("Failed to fetch insights data:", error);
      } finally {
        setIsInsightsLoading(false);
      }
    }
    fetchInitialData();
  }, []);

  // 4. useEffect 2: selectedDeviceId가 바뀔 때마다 (KPI 3개 + 시간대별 차트)
  // 4. useEffect 2: selectedDeviceId가 바뀔 때마다 (KPI 3개 + 시간대별 차트)
 // 4. useEffect 2: selectedDeviceId가 바뀔 때마다 (API 1개만 호출하도록 수정)
  useEffect(() => {
    if (!selectedDeviceId) return; 

    async function fetchDeviceSpecificData() {
      setIsHourlyLoading(true);
      setIsKpiLoading(true);
      try {
        // 1. 👇 API 1개만 호출 (weekly, daily API 삭제)
        const res = await fetch(`https://u0r3k4is4k.execute-api.ap-northeast-2.amazonaws.com/Prod/devices/${selectedDeviceId}/usage-logs`);

        if (!res.ok) {
          throw new Error(`Failed to fetch usage logs: ${res.statusText}`);
        }

        const response = await res.json();
        
        if (response.data) {
          const data = response.logs;
          
          // 2. 👇 시간대별 차트: "data.time_pattern" -> "data.logs"로 수정
          const logs: ApiTimePattern[] | undefined = data.logs; 
          
          if (logs && logs.length > 0) {
            const mappedData = logs.map(d => ({
              label: d.label, // (API의 label: "00:00")
              count: d.drop_count
            }));
            setHourlyData(mappedData);
          } else {
            setHourlyData([]);
          }

          // 3. 👇 KPI 카드 데이터: 이 API 응답에서 바로 설정
          setWeeklyUsage(data.weekly_usage || null);
          setDailyAverage(data.daily_average || null);
          setPeakHour(data.peak_time_slot || "N/A"); // (API의 peak_time_slot: "12:00")
          
        } else {
          // API가 { success: false } 등을 반환한 경우
          setHourlyData([]);
          setWeeklyUsage(null);
          setDailyAverage(null);
          setPeakHour("N/A");
        }

      } catch (error) {
        console.error("Failed to parse device specific data:", error);
      } finally {
        setIsHourlyLoading(false);
        setIsKpiLoading(false);
      }
    }
    fetchDeviceSpecificData();
  }, [selectedDeviceId]); // 👈 selectedDeviceId가 변경되면 이 effect가 다시 실행됩니다.

  // (이하 코드는 동일)
  const selectedDevice = devices.find((d) => d.device_id === selectedDeviceId);

  const handleDeviceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedDeviceId(e.target.value)
  }

  // 페이지 전체 로딩 UI
  if (isListLoading || !selectedDevice) {
    return (
      <div className="flex h-[600px] w-full items-center justify-center space-y-4">
        <Loader2 className="h-8 w-8 animate-spin text-blue-400" />
        <p className="text-lg text-muted-foreground">분석 데이터를 불러오는 중입니다...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">데이터 분석</h2>
        <p className="text-muted-foreground">개별 장비의 사용 패턴과 트렌드를 분석합니다</p>
      </div>

      {/* Dropdown (API 데이터 사용) */}
      <Card className="p-6 bg-blue-500/10 border-blue-500/20">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-blue-400" />
            <label htmlFor="analytics-device-select" className="text-sm font-medium text-blue-400">
              분석할 장비 선택
            </label>
          </div>
          <select
            id="analytics-device-select"
            value={selectedDeviceId??''}
            onChange={handleDeviceChange}
            className="w-full h-12 px-4 rounded-md bg-background border border-input text-base font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer"
          >
            {devices.map((device) => (
              <option key={device.id} value={device.device_id}>
                {device.device_id} - {device.location} ({getStatusText(device.status)})
              </option>
            ))}
          </select>
        </div>
      </Card>

      {/* 5. 👇 KPI 카드 (API 데이터 + 로딩 상태) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-chart-1/10 flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-chart-1" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">주간 증가율</p>
              {isKpiLoading ? <Loader2 className="h-5 w-5 animate-spin" /> :
                <p className="text-xl font-bold">
                  {weeklyUsage?.growth_rate ?? 0 > 0 ? '+' : ''}{weeklyUsage?.growth_rate?.toFixed(1) ?? 'N/A'}%
                </p>
              }
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
              {isKpiLoading ? <Loader2 className="h-5 w-5 animate-spin" /> :
                <p className="text-xl font-bold">{dailyAverage?.toFixed(1) ?? 'N/A'}개</p>
              }
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-chart-3/10 flex items-center justify-center">
              <MapPin className="h-5 w-5 text-chart-3" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">위치</p>
              <p className="text-xl font-bold">{selectedDevice.location}</p>
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
              {isKpiLoading ? <Loader2 className="h-5 w-5 animate-spin" /> :
                <p className="text-xl font-bold">{peakHour}</p>
              }
            </div>
          </div>
        </Card>
      </div>

      {/* 차트 API 연동 */}
      <div className="grid grid-cols-1 gap-6">
        <Card className="p-6">
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold">시간대별 사용 패턴</h3>
              <p className="text-sm text-muted-foreground">
                {selectedDevice.device_id} - {selectedDevice.location} (최근 7일 평균)
              </p>
            </div>
            {isHourlyLoading ? (
              <ChartLoader />
            ) : (
              <UsageChart type="hourly" data={hourlyData} />
            )}
          </div>
        </Card>

        <Card className="p-6">
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold">지역별 수거량 추이</h3>
              <p className="text-sm text-muted-foreground">관할 구역 전체 - 이번 주 누적 데이터</p>
            </div>
            {isRegionalLoading ? (
              <ChartLoader />
            ) : (
              <UsageChart type="location" data={regionalData} />
            )}
          </div>
        </Card>
      </div>

      {/* 6. 👇 인사이트 카드 (API 연동) */}
      <Card className="p-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">주요 인사이트</h3>
          {isInsightsLoading ? <Loader2 className="h-5 w-5 animate-spin" /> :
            <div className="space-y-3">
              {insights.map((insight, index) => (
                <div key={insight.id} className="flex items-start gap-3 p-4 bg-muted/30 rounded-lg">
                  <div className={`h-2 w-2 rounded-full bg-chart-${(index % 4) + 1} mt-2`} />
                  <div>
                    <p className="font-medium">{insight.title}</p>
                    <p className="text-sm text-muted-foreground">{insight.description}</p>
                  </div>
                </div>
              ))}
            </div>
          }
        </div>
      </Card>
    </div>
  )
}