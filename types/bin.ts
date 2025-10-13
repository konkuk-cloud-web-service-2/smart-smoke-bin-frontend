export type BinStatus = "normal" | "full" | "offline";

export interface BinItem {
  id: string;           // 장비 ID
  location: string;     // 위치명
  capacity: number;     // 적재율 0~100
  status: BinStatus;    // 상태
  updatedAt: string;    // ISO 시간 (표시용 포맷은 UI에서 처리)
}
