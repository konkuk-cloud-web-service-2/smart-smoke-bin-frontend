import { request, tryRequest } from "./client";
import type { BinItem } from "@/types/bin";

const PATH = {
  list: "/api/v1/bins",             
};

export async function getBins(): Promise<BinItem[]> {

  const fallback: BinItem[] = [
    { id:"SB-001", location:"강남역 2번 출구", capacity:45, status:"normal",  updatedAt:new Date(Date.now()-5*60e3).toISOString() },
    { id:"SB-002", location:"역삼역 1번 출구", capacity:98, status:"full",    updatedAt:new Date(Date.now()-2*60e3).toISOString() },
    { id:"SB-003", location:"선릉역 3번 출구", capacity:67, status:"normal",  updatedAt:new Date(Date.now()-8*60e3).toISOString() },
    { id:"SB-004", location:"삼성역 4번 출구", capacity:23, status:"normal",  updatedAt:new Date(Date.now()-12*60e3).toISOString() },
    { id:"SB-005", location:"종각역 5번 출구", capacity:0,  status:"offline", updatedAt:new Date(Date.now()-2*60*60e3).toISOString() },
  ];

  const data = await tryRequest<any>(PATH.list, fallback);
  const arr = Array.isArray(data) ? data : data?.items ?? fallback;
  return arr.map((it: any) => ({
    id: String(it.id ?? it.binId ?? it.code ?? ""),
    location: String(it.location ?? it.location_name ?? it.address ?? ""),
    capacity: Number(it.capacity ?? it.fill ?? it.fill_percent ?? 0),
    status: ((): "normal"|"full"|"offline" => {
      const s = String(it.status ?? "").toLowerCase();
      if (s.includes("full") || s.includes("포화") || Number(it.capacity ?? 0) >= 95) return "full";
      if (s.includes("off") || s.includes("offline")) return "offline";
      return "normal";
    })(),
    updatedAt: String(it.updatedAt ?? it.updated_at ?? it.lastUpdate ?? new Date().toISOString()),
  }));
}
