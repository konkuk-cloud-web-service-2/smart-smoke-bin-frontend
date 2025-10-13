import { tryRequest } from "./client";
import type { LikesResponse } from "@/types/feed";

export function getLikedFeeds(page=1, size=20){
  const fb: LikesResponse = { status:200, data:{ content:[], totalPages:0, totalElements:0, current:page, size } };
  const q = new URLSearchParams({ page:String(page), size:String(size) });
  return tryRequest<LikesResponse>(`/api/v1/users/likes?${q}`, fb);
}
