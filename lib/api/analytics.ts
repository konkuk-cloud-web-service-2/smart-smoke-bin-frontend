import { tryRequest } from "./client";
import type { HourlyResponse, RegionResponse, HourlyPoint, RegionPoint } from "@/types/analytics";

const PATHS = {
  hourly: "/api/v1/analytics/hourly",
  region: "/api/v1/analytics/region",
};


function mapHourly(res: HourlyResponse): HourlyPoint[] {
  const arr: any[] = Array.isArray((res as any)) ? (res as any) : res?.items ?? [];
  return arr.map((it: any): HourlyPoint => ({
    hour: String(it.hour ?? it.h ?? "").padStart(2, "0"),
    count: Number(it.count ?? it.value ?? 0),
  })).filter((p: HourlyPoint) => p.hour !== "" && !Number.isNaN(p.count));
}

function mapRegion(res: RegionResponse): RegionPoint[] {
  const arr: any[] = Array.isArray((res as any)) ? (res as any) : res?.items ?? [];
  return arr.map((it: any): RegionPoint => ({
    location: String(it.region ?? it.name ?? ""),
    count: Number(it.count ?? it.total ?? it.value ?? 0),
  })).filter((p: RegionPoint) => p.location !== "" && !Number.isNaN(p.count));
}

export async function getHourlyUsage(): Promise<HourlyPoint[]> {
  // 실패 대비 더미 데이톼
  const fb: HourlyPoint[] = [
    { hour: "00", count: 45 }, { hour: "03", count: 23 }, { hour: "06", count: 67 },
    { hour: "09", count: 189 }, { hour: "12", count: 312 }, { hour: "15", count: 267 },
    { hour: "18", count: 234 }, { hour: "21", count: 156 },
  ];
  const res = await tryRequest<HourlyResponse>(PATHS.hourly, { items: fb as any });
  const mapped = mapHourly(res);
  return mapped.length ? mapped : fb;
}

export async function getRegionUsage(): Promise<RegionPoint[]> {
  const fb: RegionPoint[] = [
    { location: "강남구", count: 4234 }, { location: "서초구", count: 3891 },
    { location: "송파구", count: 3456 }, { location: "마포구", count: 2987 }, { location: "용산구", count: 2654 },
  ];
  const res = await tryRequest<RegionResponse>(PATHS.region, { items: fb as any });
  const mapped = mapRegion(res);
  return mapped.length ? mapped : fb;
}
