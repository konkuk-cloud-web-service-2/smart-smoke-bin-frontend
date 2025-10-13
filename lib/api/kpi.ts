import { tryRequest } from "./client";
import type { KpiItem } from "@/types/kpi";

const PATH = "/api/v1/dashboard/kpis";

export async function getKpis(): Promise<KpiItem[]> {
  const fallback: KpiItem[] = [
    { id: "growth", label: "주간 증가율", value: "+18.2%", trend: 18.2 },
    { id: "daily", label: "일평균 수거", value: "829개" },
    { id: "region", label: "활성 지역", value: "25개구" },
    { id: "peak", label: "피크 시간", value: "12–14시" },
  ];

  const res = await tryRequest<any>(PATH, fallback);
  const arr = Array.isArray(res) ? res : res?.items ?? fallback;

  // 필드 매핑 (API 형식 다를 경우 대비)
  return arr.map((it: any, i: number) => ({
    id: String(it.id ?? fallback[i].id),
    label: String(it.label ?? it.name ?? fallback[i].label),
    value: String(it.value ?? fallback[i].value),
    trend: Number(it.trend ?? it.change ?? fallback[i].trend ?? 0),
  }));
}
