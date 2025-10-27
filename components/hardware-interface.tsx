"use client"

import type React from "react"
import { useState, useEffect, type Dispatch, type SetStateAction } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Cigarette, CheckCircle2, MapPin, Loader2 } from "lucide-react"

// (인터페이스와 헬퍼 함수는 동일)
interface ApiDevice {
  id: string; 
  device_id: string; 
  location: string;
  current_level: number; 
  fill_percentage: number; 
  status: "active" | "maintenance" | "offline" | string;
}
const getStatusText = (status: string) => {
  switch (status) {
    case "active": return "정상";
    case "maintenance": return "점검중";
    case "offline": return "오프라인";
    default: return "알 수 없음";
  }
}

// 1. 👇 API 응답으로 state를 업데이트하는 공통 함수
interface SimulationData {
  current_level: number;
  fill_percentage: number;
  status: string;
}
function updateStateFromApi(
  data: SimulationData, 
  setCount: Dispatch<SetStateAction<number>>, 
  setCapacity: Dispatch<SetStateAction<number>>
) {
  if (data) {
    setCount(data.current_level);
    setCapacity(data.fill_percentage);
  }
}


export function HardwareInterface() {
  
  const [devices, setDevices] = useState<ApiDevice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string | null>(null)
  
  const [count, setCount] = useState(0)
  const [capacity, setCapacity] = useState(0)

  const [showThankYou, setShowThankYou] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false) // 👈 API 호출 시 로딩 state로 사용

  // (useEffect, handleDeviceChange는 동일)
  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(`http://smart-smoke-env.eba-nnpifr7u.ap-northeast-2.elasticbeanstalk.com/devices`, {
          cache: 'no-store'
        });
        const response = await res.json();
        const apiData: ApiDevice[] = response.data;
        
        setDevices(apiData);

        if (apiData.length > 0) {
          const firstDevice = apiData[0];
          setSelectedDeviceId(firstDevice.device_id);
          setCount(firstDevice.current_level);
          setCapacity(firstDevice.fill_percentage);
        }
      } catch (error) {
        console.error("Failed to fetch devices:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  const selectedDevice = devices.find((d) => d.device_id === selectedDeviceId);

  const handleDeviceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const deviceId = e.target.value
    setSelectedDeviceId(deviceId)
    const device = devices.find((d) => d.device_id === deviceId)
    if (device) {
      setCount(device.current_level);
      setCapacity(device.fill_percentage);
      setShowThankYou(false)
    }
  }

  // --- 2. 👇 시뮬레이션 핸들러 3개 API 연동 ---

  const API_BASE_URL = "http://smart-smoke-env.eba-nnpifr7u.ap-northeast-2.elasticbeanstalk.com";

  /**
   * (수정) 꽁초 투입 시뮬레이션: POST .../simulate/drop
   */
  const handleDisposal = async () => {
    if (capacity >= 100 || isAnimating || !selectedDeviceId) return

    setIsAnimating(true)
    setShowThankYou(true)

    try {
      const res = await fetch(`${API_BASE_URL}/devices/${selectedDeviceId}/simulate/drop`, {
        method: 'POST'
      });
      const response = await res.json();
      if (response.success && response.data) {
        // API 응답으로 state 업데이트
        updateStateFromApi(response.data, setCount, setCapacity);
      }
    } catch (error) {
      console.error("Failed to simulate drop:", error);
    } finally {
      // 2초 뒤 "감사합니다" 메시지 숨기고 버튼 활성화
      setTimeout(() => {
        setShowThankYou(false)
        setIsAnimating(false)
      }, 2000)
    }
  }

  /**
   * (신규) 초기화 시뮬레이션: POST .../simulate/reset
   */
  const handleReset = async () => {
    if (isAnimating || !selectedDeviceId) return;
    setIsAnimating(true);
    try {
      const res = await fetch(`${API_BASE_URL}/devices/${selectedDeviceId}/simulate/reset`, {
        method: 'POST'
      });
      const response = await res.json();
      if (response.success && response.data) {
        updateStateFromApi(response.data, setCount, setCapacity);
      }
    } catch (error) {
      console.error("Failed to simulate reset:", error);
    } finally {
      setIsAnimating(false);
    }
  }

  /**
   * (신규) 포화 상태 시뮬레이션: POST .../simulate/full
   */
  const handleSetFull = async () => {
    if (isAnimating || !selectedDeviceId) return;
    setIsAnimating(true);
    try {
      const res = await fetch(`${API_BASE_URL}/devices/${selectedDeviceId}/simulate/full`, {
        method: 'POST'
      });
      const response = await res.json();
      if (response.success && response.data) {
        updateStateFromApi(response.data, setCount, setCapacity);
      }
    } catch (error) {
      console.error("Failed to simulate full:", error);
    } finally {
      setIsAnimating(false);
    }
  }

  const isFull = capacity >= 95

  if (isLoading || !selectedDevice) {
    // (로딩 UI 동일)
    return (
      <div className="flex h-[600px] w-full items-center justify-center space-y-4">
        <Loader2 className="h-8 w-8 animate-spin text-blue-400" />
        <p className="text-lg text-muted-foreground">시뮬레이터 데이터를 불러오는 중입니다...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* ... (헤더, Dropdown 동일) ... */}
      <div>
        <h1 className="text-3xl font-bold">하드웨어 인터페이스</h1>
        <p className="text-muted-foreground mt-2">실제 스마트 스모크 빈의 LED 디스플레이 시뮬레이션</p>
      </div>

      <Card className="p-6 bg-blue-500/10 border-blue-500/20">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-blue-400" />
            <label htmlFor="device-select" className="text-sm font-medium text-blue-400">
              시뮬레이션할 장비 선택
            </label>
          </div>
          <select
            id="device-select"
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


      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ... (LED 디스플레이 UI 동일) ... */}
        <Card className="p-6 bg-zinc-900 border-zinc-800">
          <div className="mb-4 pb-4 border-b border-zinc-800">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-muted-foreground">장비 ID</div>
                <div className="text-lg font-bold">{selectedDevice.device_id}</div>
              </div>
              <div className="text-right">
                <div className="text-sm text-muted-foreground">위치</div>
                <div className="text-lg font-semibold">{selectedDevice.location}</div>
              </div>
            </div>
          </div>

          <div className="aspect-[4/3] bg-black rounded-lg border-4 border-zinc-700 flex flex-col items-center justify-between relative overflow-hidden p-8">
            {!showThankYou && !isFull && (
              <>
                <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4 animate-in fade-in duration-300">
                  <div className="text-xl text-green-400/70">총 투입 개수</div>
                  <div className="text-8xl font-bold text-green-400 tabular-nums">{count}</div>
                </div>

                <div className="w-full space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-cyan-400/70">적재율</span>
                    <span className="text-cyan-400 font-semibold">{capacity}%</span>
                  </div>
                  <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-500 ${capacity > 80 ? "bg-orange-400" : "bg-cyan-400"}`}
                      style={{ width: `${capacity}%` }}
                    />
                  </div>
                </div>
              </>
            )}

            {showThankYou && !isFull && (
              <div className="flex-1 flex flex-col items-center justify-center text-center space-y-6 animate-in zoom-in duration-300">
                <CheckCircle2 className="h-24 w-24 text-green-400 animate-pulse" />
                <div className="text-4xl font-bold text-green-400">감사합니다!</div>
                <div className="text-xl text-green-400/80">깨끗한 환경을 만들어주셔서 감사합니다</div>
              </div>
            )}

            {isFull && (
              <div className="flex-1 flex flex-col items-center justify-center text-center space-y-6 animate-in fade-in duration-300">
                <div className="text-3xl font-bold text-orange-400">곧 비워집니다</div>
                <div className="text-lg text-orange-400/80 px-8">주변 다른 수거함을 이용해주세요</div>
                <div className="text-sm text-orange-400/60 mt-4">가까운 수거함: 50m 앞</div>
              </div>
            )}
          </div>

          <div className="mt-6 text-center text-sm text-muted-foreground">LED 매트릭스 디스플레이 (실제 하드웨어)</div>
        </Card>


        {/* --- 3. 👇 버튼 onClick 및 disabled 수정 --- */}
        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">시뮬레이션 컨트롤</h3>

            <div className="space-y-4">
              <Button
                onClick={handleDisposal}
                disabled={isAnimating || isFull} // 'isFull'일 때도 비활성화
                className="w-full h-16 text-lg"
                size="lg"
              >
                {isAnimating && !showThankYou ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Cigarette className="mr-2 h-5 w-5" />}
                담배꽁초 투입
              </Button>

              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant="outline"
                  onClick={handleReset} // 👈 수정
                  disabled={isAnimating} // 👈 수정
                >
                  초기화
                </Button>
                <Button
                  variant="outline"
                  onClick={handleSetFull} // 👈 수정
                  disabled={isAnimating} // 👈 수정
                >
                  포화 상태
                </Button>
              </div>
            </div>
          </Card>

          {/* ... (현재 상태 카드 동일) ... */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">현재 상태</h3>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">총 투입 개수</span>
                <span className="text-lg font-bold">{count}개</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">적재율</span>
                <span className="text-lg font-bold">{capacity}%</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">상태</span>
                <span
                  className={`text-sm font-medium ${
                    isFull ? "text-orange-400" : capacity > 80 ? "text-yellow-400" : "text-green-400"
                  }`}
                >
                  {isFull ? "포화" : capacity > 80 ? "주의" : "정상"}
                </span>
              </div>

              <div className="pt-4 border-t border-border">
                <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-500 ${
                      isFull ? "bg-orange-400" : capacity > 80 ? "bg-yellow-400" : "bg-green-400"
                    }`}
                    style={{ width: `${capacity}%` }}
                  />
                </div>
              </div>
            </div>
          </Card>
          
        </div>
      </div>
    </div>
  )
}