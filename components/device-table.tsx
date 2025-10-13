"use client";
import { useEffect, useState } from "react";
import { MoreHorizontal } from "lucide-react";
import { getBins } from "@/lib/api/bins";
import type { BinItem } from "@/types/bin";
import { timeSince } from "@/lib/time";

export function DeviceTable() {
  const [devices, setDevices] = useState<BinItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        setErr(null);
        const list = await getBins();
        if (alive) setDevices(list);
      } catch (e: any) {
        if (alive) setErr(e?.message || "불러오기 실패");
      } finally {
        if (alive) setLoading(false);
      }
    })();

    // (선택) 30초마다 갱신
    const t = setInterval(async () => {
      try {
        const list = await getBins();
        if (alive) setDevices(list);
      } catch {}
    }, 30000);

    return () => {
      alive = false;
      clearInterval(t);
    };
  }, []);

  if (loading)
    return <div className="text-sm text-muted-foreground">불러오는 중…</div>;
  if (err) return <div className="text-sm text-destructive">{err}</div>;

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-border text-sm text-muted-foreground">
            <th className="py-3 px-4 text-left font-medium">장비 ID</th>
            <th className="py-3 px-4 text-left font-medium">위치</th>
            <th className="py-3 px-4 text-left font-medium">적재율</th>
            <th className="py-3 px-4 text-left font-medium">상태</th>
            <th className="py-3 px-4 text-left font-medium">최근 업데이트</th>
            <th className="py-3 px-4 text-right font-medium">액션</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-border">
          {devices.map((device) => (
            <tr
              key={device.id}
              className="hover:bg-muted/50 transition-colors"
            >
              <td className="py-3 px-4">
                <span className="font-mono text-sm font-medium">
                  {device.id}
                </span>
              </td>

              <td className="py-3 px-4 text-sm">{device.location}</td>

              <td className="py-3 px-4">
                <div className="flex items-center gap-2">
                  <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all ${
                        device.capacity >= 90
                          ? "bg-destructive"
                          : device.capacity >= 70
                          ? "bg-chart-3"
                          : "bg-accent"
                      }`}
                      style={{ width: `${device.capacity}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium">
                    {device.capacity}%
                  </span>
                </div>
              </td>

              <td className="py-3 px-4">
                <span
                  className={
                    device.status === "normal"
                      ? "px-2 py-0.5 rounded-lg text-xs bg-accent/10 text-accent"
                      : device.status === "full"
                      ? "px-2 py-0.5 rounded-lg text-xs bg-destructive/20 text-destructive"
                      : "px-2 py-0.5 rounded-lg text-xs bg-zinc-700/40 text-zinc-300"
                  }
                >
                  {device.status === "normal"
                    ? "정상"
                    : device.status === "full"
                    ? "포화"
                    : "오프라인"}
                </span>
              </td>

              <td className="py-3 px-4 text-sm text-muted-foreground">
                {timeSince(device.updatedAt)}
              </td>

              <td className="py-3 px-4 text-right">
                <button className="h-8 w-8 inline-grid place-items-center rounded-md hover:bg-zinc-800 text-zinc-300">
                  <MoreHorizontal className="h-4 w-4" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
