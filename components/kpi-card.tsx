"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { TrendingUp, Calendar, MapPin, Clock } from "lucide-react";
import { getKpis } from "@/lib/api/kpi";
import type { KpiItem } from "@/types/kpi";

export function KpiCards() {
  const [data, setData] = useState<KpiItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      setLoading(true);
      setErr(null);
      try {
        const list = await getKpis();
        if (alive) setData(list);
      } catch (e: any) {
        if (alive) setErr(e?.message || "불러오기 실패");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  if (loading)
    return <div className="text-sm text-muted-foreground">불러오는 중…</div>;
  if (err) return <div className="text-sm text-destructive">{err}</div>;

  const icons: Record<string, JSX.Element> = {
    growth: <TrendingUp className="h-5 w-5 text-chart-1" />,
    daily: <Calendar className="h-5 w-5 text-chart-2" />,
    region: <MapPin className="h-5 w-5 text-chart-3" />,
    peak: <Clock className="h-5 w-5 text-chart-4" />,
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {data.map((kpi) => (
        <Card key={kpi.id} className="p-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center">
              {icons[kpi.id] || <TrendingUp className="h-5 w-5 text-accent" />}
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{kpi.label}</p>
              <p className="text-xl font-bold">{kpi.value}</p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
