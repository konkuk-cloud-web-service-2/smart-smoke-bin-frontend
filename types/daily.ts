export interface DailyItem { dailyId: number|string; imageUrl: string; createdAt: string; }
export interface DailyListResponse {
  status: number; dailies: DailyItem[]; page: number; totalPages: number; totalElements: number;
}
export interface DailyByTagItem { dailyId: number|string; dailyImage: string; }
export interface DailyByTagResponse { dailies: DailyByTagItem[]; page: number; totalPages: number; totalElements: number; }
