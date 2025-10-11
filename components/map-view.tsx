"use client"

import { Card } from "@/components/ui/card"

export function MapView() {
  const bins = [
    { id: 1, x: 20, y: 30, status: "normal", location: "강남역 2번 출구", capacity: 45 },
    { id: 2, x: 45, y: 25, status: "normal", location: "역삼역 1번 출구", capacity: 67 },
    { id: 3, x: 65, y: 40, status: "full", location: "선릉역 3번 출구", capacity: 98 },
    { id: 4, x: 30, y: 60, status: "normal", location: "삼성역 4번 출구", capacity: 23 },
    { id: 5, x: 70, y: 65, status: "normal", location: "종각역 5번 출구", capacity: 56 },
    { id: 6, x: 50, y: 50, status: "full", location: "시청역 3번 출구", capacity: 95 },
    { id: 7, x: 85, y: 35, status: "offline", location: "광화문역 1번 출구", capacity: 0 },
    { id: 8, x: 15, y: 75, status: "normal", location: "홍대입구역 2번 출구", capacity: 34 },
  ]

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
        <div className="relative w-full h-[600px] bg-muted/30">
          {/* Simulated map background */}
          <div className="absolute inset-0">
            <svg className="w-full h-full opacity-10">
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
          </div>

          {/* Bin markers */}
          {bins.map((bin) => (
            <div
              key={bin.id}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
              style={{ left: `${bin.x}%`, top: `${bin.y}%` }}
            >
              <div className="relative">
                <div
                  className={`h-5 w-5 rounded-full border-2 border-background shadow-lg transition-transform group-hover:scale-125 ${
                    bin.status === "normal"
                      ? "bg-chart-2"
                      : bin.status === "full"
                        ? "bg-destructive animate-pulse"
                        : "bg-muted"
                  }`}
                />
                {bin.status === "full" && (
                  <div className="absolute inset-0 h-5 w-5 rounded-full bg-destructive/30 animate-ping" />
                )}
              </div>

              {/* Tooltip */}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                <div className="bg-card border border-border rounded-lg px-3 py-2 text-xs whitespace-nowrap shadow-lg">
                  <div className="font-semibold">장비 SB-00{bin.id}</div>
                  <div className="text-muted-foreground">{bin.location}</div>
                  <div className="text-muted-foreground mt-1">
                    {bin.status === "normal" && `정상 (${bin.capacity}%)`}
                    {bin.status === "full" && `포화 (${bin.capacity}%)`}
                    {bin.status === "offline" && "오프라인"}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
