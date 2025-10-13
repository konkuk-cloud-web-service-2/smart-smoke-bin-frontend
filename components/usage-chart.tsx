"use client";

import { useEffect, useState } from "react";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { getHourlyUsage, getRegionUsage } from "@/lib/api/analytics";
import type { HourlyPoint, RegionPoint } from "@/types/analytics";

interface UsageChartProps {
  type: "hourly" | "location";
}

export function UsageChart({ type }: UsageChartProps) {
  const [data, setData] = useState<Array<any>>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      setLoading(true);
      setErr(null);
      try {
        if (type === "hourly") {
          const res: HourlyPoint[] = await getHourlyUsage();
          if (alive) setData(res);
        } else {
          const res: RegionPoint[] = await getRegionUsage();
          if (alive) setData(res);
        }
      } catch (e: any) {
        if (alive) setErr(e?.message || "데이터를 불러오지 못했습니다");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, [type]);

  const dataKey = type === "hourly" ? "hour" : "location";
  const barColor = type === "hourly" ? "#a78bfa" : "#2dd4bf";

  if (loading) return <div className="text-sm text-muted-foreground">불러오는 중…</div>;
  if (err) return <div className="text-sm text-destructive">{err}</div>;

  return (
    <div className="bg-black/20 rounded-lg p-4">
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#444" opacity={0.5} />
          <XAxis dataKey={dataKey} stroke="#fff" fontSize={12} tickLine={false} axisLine={false} />
          <YAxis stroke="#fff" fontSize={12} tickLine={false} axisLine={false} />
          <Tooltip
            contentStyle={{
              backgroundColor: "#1a1a1a",
              border: "1px solid #444",
              borderRadius: "8px",
              color: "#fff",
            }}
            labelStyle={{ color: "#fff" }}
          />
          <Bar dataKey="count" fill={barColor} radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
