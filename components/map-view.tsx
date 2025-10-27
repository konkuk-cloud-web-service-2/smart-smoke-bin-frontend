"use client"

import { Card } from "@/components/ui/card"
import { useEffect, useRef, useState } from "react"

interface DeviceBin {
  device_id: string
  location: string
  status: "active" | "maintenance" | "offline" | "full"
  fill_percentage: number
  latitude: number
  longitude: number
}

// 더미 데이터
const DUMMY_BINS: DeviceBin[] = [
  {
    device_id: "SB001",
    location: "강남역 1번 출구",
    latitude: 37.4979,
    longitude: 127.0276,
    status: "active",
    fill_percentage: 45
  },
  {
    device_id: "SB002",
    location: "홍대입구역 2번 출구",
    latitude: 37.5563,
    longitude: 126.9226,
    status: "full",
    fill_percentage: 95
  },
  {
    device_id: "SB003",
    location: "명동역 3번 출구",
    latitude: 37.5636,
    longitude: 126.9826,
    status: "active",
    fill_percentage: 67
  },
  {
    device_id: "SB004",
    location: "잠실역 1번 출구",
    latitude: 37.5133,
    longitude: 127.1028,
    status: "offline",
    fill_percentage: 0
  },
  {
    device_id: "SB005",
    location: "신촌역 1번 출구",
    latitude: 37.5551,
    longitude: 126.9368,
    status: "active",
    fill_percentage: 32
  }
]

export function MapView() {
  const mapRef = useRef<HTMLDivElement>(null)
  const [map, setMap] = useState<naver.maps.Map | null>(null)
  const [bins] = useState<DeviceBin[]>(DUMMY_BINS)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const initMap = () => {
      if (!mapRef.current) return
      
      try {
        const mapOptions = {
          center: new naver.maps.LatLng(37.5665, 126.9780),
          zoom: 12,
        }

        const newMap = new naver.maps.Map(mapRef.current, mapOptions)
        setMap(newMap)
        setIsLoading(false)
      } catch (error) {
        console.error('지도 초기화 오류:', error)
        setIsLoading(false)
      }
    }

    // naver.maps가 로드될 때까지 대기
    if (window.naver && window.naver.maps) {
      initMap()
    } else {
      const checkInterval = setInterval(() => {
        if (window.naver && window.naver.maps) {
          clearInterval(checkInterval)
          initMap()
        }
      }, 100)

      return () => clearInterval(checkInterval)
    }
  }, [])

  useEffect(() => {
    if (!map) return

    // 마커 생성
    bins.forEach((bin) => {
      const isFull = bin.fill_percentage >= 90
      const isOffline = bin.status === "offline" || bin.status === "maintenance"
      
      let markerColor = "#10b981" // 정상 (녹색)
      if (isOffline) {
        markerColor = "#6b7280" // 오프라인 (회색)
      } else if (isFull) {
        markerColor = "#ef4444" // 포화 (빨간색)
      }

      const marker = new naver.maps.Marker({
        position: new naver.maps.LatLng(bin.latitude, bin.longitude),
        map: map,
        title: bin.device_id,
        icon: {
          content: `
            <div style="position: relative;">
              <div style="
                width: 20px;
                height: 20px;
                background-color: ${markerColor};
                border: 3px solid white;
                border-radius: 50%;
                box-shadow: 0 2px 4px rgba(0,0,0,0.3);
              "></div>
            </div>
          `,
          anchor: new naver.maps.Point(10, 10),
        },
      })

      // 정보창 내용
      const getStatusText = () => {
        if (isOffline) {
          return bin.status === "offline" ? "오프라인" : "점검중"
        }
        if (isFull) {
          return `포화 (${bin.fill_percentage}%)`
        }
        return `정상 (${bin.fill_percentage}%)`
      }

      const infoWindow = new naver.maps.InfoWindow({
        content: `
          <div style="
            padding: 12px;
            background: #1f2937;
            border: 1px solid #374151;
            border-radius: 8px;
            color: white;
            min-width: 180px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.3);
          ">
            <div style="font-weight: 600; margin-bottom: 4px;">${bin.device_id}</div>
            <div style="color: #9ca3af; font-size: 13px; margin-bottom: 4px;">${bin.location}</div>
            <div style="color: #9ca3af; font-size: 13px;">${getStatusText()}</div>
          </div>
        `,
      })

      naver.maps.Event.addListener(marker, "click", () => {
        if (infoWindow.getMap()) {
          infoWindow.close()
        } else {
          infoWindow.open(map, marker)
        }
      })
    })
  }, [map, bins])

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">실시간 지도</h2>
          <p className="text-muted-foreground">각 장비의 위치와 상태를 확인하세요</p>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-chart-2" />
            <span>정상</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-destructive" />
            <span>포화</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-muted" />
            <span>오프라인</span>
          </div>
        </div>
      </div>

      <Card className="p-0 overflow-hidden">
        <div ref={mapRef} className="w-full h-[600px] relative">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-muted/30 z-10">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                <p className="text-muted-foreground">지도를 불러오는 중...</p>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}