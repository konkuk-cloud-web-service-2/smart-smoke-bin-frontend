export interface FeedEntry { feedId: number|string; imageUrl: string; createdAt: string; }
export interface LikesResponse {
  status: number; data: { content: FeedEntry[]; totalPages: number; totalElements: number; current: number; size: number; };
}
