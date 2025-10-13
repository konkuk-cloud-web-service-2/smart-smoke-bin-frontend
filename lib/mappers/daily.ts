import type { DailyByTagResponse, DailyItem, DailyListResponse } from "@/types/daily";

export function mapDailyList(res: DailyListResponse) {
  return {
    ...res,
    dailies: (res.dailies || []).map((d) => ({
      dailyId: d.dailyId,
      imageUrl: d.imageUrl,     // 표준: imageUrl
      createdAt: d.createdAt,
    })) as DailyItem[],
  };
}

export function mapDailyByTag(res: DailyByTagResponse) {
  return {
    ...res,
    dailies: (res.dailies || []).map((d) => ({
      dailyId: d.dailyId,
      imageUrl: d.dailyImage,   // 표준으로 변환
      createdAt: new Date().toISOString(), // 문서에 createdAt이 없어서 임시값(원본 스펙 확정되면 교체)
    })) as DailyItem[],
  };
}
