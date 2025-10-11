"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Cigarette, CheckCircle2 } from "lucide-react"

export function HardwareInterface() {
  const [count, setCount] = useState(847)
  const [capacity, setCapacity] = useState(68)
  const [showThankYou, setShowThankYou] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)

  const handleDisposal = () => {
    if (capacity >= 100) return

    setIsAnimating(true)
    setShowThankYou(true)

    setTimeout(() => {
      setCount((prev) => prev + 1)
      setCapacity((prev) => Math.min(100, prev + 1))
    }, 300)

    setTimeout(() => {
      setShowThankYou(false)
      setIsAnimating(false)
    }, 2000)
  }

  const isFull = capacity >= 95

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">하드웨어 인터페이스</h1>
        <p className="text-muted-foreground mt-2">실제 스마트 스모크 빈의 LED 디스플레이 시뮬레이션</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* LED Display Simulation */}
        <Card className="p-8 bg-zinc-900 border-zinc-800">
          <div className="aspect-[4/3] bg-black rounded-lg border-4 border-zinc-700 flex items-center justify-center relative overflow-hidden">
            {/* Normal Display */}
            {!showThankYou && !isFull && (
              <div className="text-center space-y-6 animate-in fade-in duration-300">
                <div className="space-y-2">
                  <div className="text-6xl font-bold text-green-400 tabular-nums">{count}</div>
                  <div className="text-xl text-green-400/80">투입 개수</div>
                </div>

                <div className="space-y-2">
                  <div className="text-5xl font-bold text-cyan-400 tabular-nums">{capacity}%</div>
                  <div className="text-lg text-cyan-400/80">적재율</div>
                </div>
              </div>
            )}

            {/* Thank You Animation */}
            {showThankYou && !isFull && (
              <div className="text-center space-y-4 animate-in zoom-in duration-300">
                <CheckCircle2 className="h-24 w-24 text-green-400 mx-auto animate-pulse" />
                <div className="text-4xl font-bold text-green-400">감사합니다!</div>
                <div className="text-xl text-green-400/80">깨끗한 환경을 만들어주셔서 감사합니다</div>
              </div>
            )}

            {/* Full Display */}
            {isFull && (
              <div className="text-center space-y-4 animate-in fade-in duration-300">
                <div className="text-3xl font-bold text-orange-400">곧 비워집니다</div>
                <div className="text-lg text-orange-400/80 px-8">주변 다른 수거함을 이용해주세요</div>
                <div className="text-sm text-orange-400/60 mt-4">가까운 수거함: 50m 앞</div>
              </div>
            )}
          </div>

          <div className="mt-6 text-center text-sm text-muted-foreground">LED 매트릭스 디스플레이 (실제 하드웨어)</div>
        </Card>

        {/* Control Panel */}
        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">시뮬레이션 컨트롤</h3>

            <div className="space-y-4">
              <Button
                onClick={handleDisposal}
                disabled={isAnimating || isFull}
                className="w-full h-16 text-lg"
                size="lg"
              >
                <Cigarette className="mr-2 h-5 w-5" />
                담배꽁초 투입 시뮬레이션
              </Button>

              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant="outline"
                  onClick={() => {
                    setCount(0)
                    setCapacity(0)
                  }}
                >
                  초기화
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setCount(1500)
                    setCapacity(95)
                  }}
                >
                  포화 상태
                </Button>
              </div>
            </div>
          </Card>

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

          <Card className="p-6 bg-blue-500/10 border-blue-500/20">
            <h3 className="text-lg font-semibold mb-2 text-blue-400">게임화 요소</h3>
            <p className="text-sm text-muted-foreground">
              실제 하드웨어에서는 투입 시 즉각적인 긍정적 피드백을 제공하여 시민들의 자발적 참여를 유도합니다. 숫자가
              올라가는 애니메이션과 감사 메시지를 통해 재미있고 보람찬 경험을 제공합니다.
            </p>
          </Card>
        </div>
      </div>
    </div>
  )
}
