export interface HourlyPoint {
    hour: string;   // "00" ~ "23"
    count: number;  // 개수
  }
  
  export interface RegionPoint {
    location: string; // 구/지역명
    count: number;    // 개수
  }
  
  export interface HourlyResponse {
    items: Array<{ hour?: string | number; h?: string | number; count?: number; value?: number }>;
  }
  
  export interface RegionResponse {
    items: Array<{ region?: string; name?: string; count?: number; total?: number; value?: number }>;
  }
  