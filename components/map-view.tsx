"use client";
import { useEffect, useMemo, useState } from "react";
import { getBins } from "@/lib/api/bins";
import type { BinItem } from "@/types/bin";

// 좌표(더미)
const baseSpots = [
  { id: "SB-001", x: 20, y: 30 },
  { id: "SB-002", x: 45, y: 25 },
  { id: "SB-003", x: 65, y: 40 },
  { id: "SB-004", x: 30, y: 60 },
  { id: "SB-005", x: 70, y: 65 },
];

export function MapView() {
  const [bins, setBins] = useState<BinItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    (async () => {
      setLoading(true);
      try {
        const list = await getBins();
        if (alive) setBins(list);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  const markers = useMemo(() => {
    const map = new Map(bins.map((b) => [b.id, b]));
    return baseSpots.map((s) => ({
      ...s,
      data: map.get(s.id) || null,
    }));
  }, [bins]);

  if (loading)
    return <div className="text-sm text-muted-foreground">지도를 불러오는 중…</div>;

  return (
    <div className="p-0 overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/40">
      <div className="relative w-full h-[600px] bg-muted/30">
        <div className="absolute inset-0">
          <svg className="w-full h-full opacity-10">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path
                  d="M 40 0 L 0 0 0 40"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        {markers.map((m) => {
          const status = m.data?.status ?? "normal";
          const capacity = m.data?.capacity ?? 0;
          const location = m.data?.location ?? m.id;
          return (
            <div
              key={m.id}
              className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
              style={{ left: `${m.x}%`, top: `${m.y}%` }}
            >
              <div className="relative">
                <div
                  className={`h-5 w-5 rounded-full border-2 border-background shadow-lg transition-transform group-hover:scale-125 ${
                    status === "normal"
                      ? "bg-chart-2"
                      : status === "full"
                      ? "bg-destructive animate-pulse"
                      : "bg-muted"
                  }`}
                />
                {status === "full" && (
                  <div className="absolute inset-0 h-5 w-5 rounded-full bg-destructive/30 animate-ping" />
                )}
              </div>

              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                <div className="bg-card border border-border rounded-lg px-3 py-2 text-xs whitespace-nowrap shadow-lg">
                  <div className="font-semibold">장비 {m.id}</div>
                  <div className="text-muted-foreground">{location}</div>
                  <div className="text-muted-foreground mt-1">
                    {status === "normal" && `정상 (${capacity}%)`}
                    {status === "full" && `포화 (${capacity}%)`}
                    {status === "offline" && "오프라인"}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
