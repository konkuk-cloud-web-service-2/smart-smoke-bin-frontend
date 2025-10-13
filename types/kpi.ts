export interface KpiItem {
    id: string;
    label: string;
    value: string | number;
    trend?: number;       // 증가율 등
    icon?: string;        // lucide 아이콘 이름 (선택)
  }
  