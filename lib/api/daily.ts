import { tryRequest } from "./client";
import type { DailyListResponse, DailyByTagResponse } from "@/types/daily";
import { mapDailyList, mapDailyByTag } from "@/lib/mappers/daily";

export async function getMyDailyList(page = 1, size = 20) {
  const fb: DailyListResponse = { status: 200, dailies: [], page, totalPages: 0, totalElements: 0 };
  const q = new URLSearchParams({ page: String(page), size: String(size) });
  const res = await tryRequest<DailyListResponse>(`/api/v1/users/daily?${q}`, fb);
  return mapDailyList(res);
}

export async function getDailyByTag(tag = "all", page = 1) {
  const fb: DailyByTagResponse = { dailies: [], page, totalPages: 0, totalElements: 0 };
  const q = new URLSearchParams({ tag });
  const res = await tryRequest<DailyByTagResponse>(`/api/v1/daily?${q}`, fb);
  return mapDailyByTag(res);
}
