import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MoreHorizontal } from "lucide-react"

const devices = [
  { id: "SB-001", location: "강남역 2번 출구", capacity: 45, status: "normal", lastUpdate: "5분 전" },
  { id: "SB-002", location: "역삼역 1번 출구", capacity: 98, status: "full", lastUpdate: "2분 전" },
  { id: "SB-003", location: "선릉역 3번 출구", capacity: 67, status: "normal", lastUpdate: "8분 전" },
  { id: "SB-004", location: "삼성역 4번 출구", capacity: 23, status: "normal", lastUpdate: "12분 전" },
  { id: "SB-005", location: "종각역 5번 출구", capacity: 0, status: "offline", lastUpdate: "2시간 전" },
]

export function DeviceTable() {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-border">
            <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">장비 ID</th>
            <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">위치</th>
            <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">적재율</th>
            <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">상태</th>
            <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">마지막 업데이트</th>
            <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">작업</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {devices.map((device) => (
            <tr key={device.id} className="hover:bg-muted/50 transition-colors">
              <td className="py-3 px-4">
                <span className="font-mono text-sm font-medium">{device.id}</span>
              </td>
              <td className="py-3 px-4 text-sm">{device.location}</td>
              <td className="py-3 px-4">
                <div className="flex items-center gap-2">
                  <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all ${
                        device.capacity >= 90 ? "bg-destructive" : device.capacity >= 70 ? "bg-chart-3" : "bg-accent"
                      }`}
                      style={{ width: `${device.capacity}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium">{device.capacity}%</span>
                </div>
              </td>
              <td className="py-3 px-4">
                <Badge
                  variant={
                    device.status === "normal" ? "default" : device.status === "full" ? "destructive" : "secondary"
                  }
                  className={device.status === "normal" ? "bg-accent/10 text-accent hover:bg-accent/20" : ""}
                >
                  {device.status === "normal" && "정상"}
                  {device.status === "full" && "포화"}
                  {device.status === "offline" && "오프라인"}
                </Badge>
              </td>
              <td className="py-3 px-4 text-sm text-muted-foreground">{device.lastUpdate}</td>
              <td className="py-3 px-4 text-right">
                <Button variant="ghost" size="icon">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
