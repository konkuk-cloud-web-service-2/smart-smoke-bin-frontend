"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts"

// 1. 👇 Overview 컴포넌트에서 정의한 타입을 가져오거나 다시 정의합니다.
// (Eslint 오류를 피하기 위해 'any' 대신 정확한 타입을 사용합니다.)
interface TimePattern {
  label: string;
  count: number;
}
interface RegionalCollection {
  district_name: string;
  total_drops: number;
}

// 2. 👇 Props 타입을 'Discriminated Union'으로 수정합니다.
// 'type'이 "hourly"면 'data'는 TimePattern[]이어야 하고,
// 'type'이 "location"이면 'data'는 RegionalCollection[]이어야 합니다.
type UsageChartProps = 
  | { type: "hourly"; data: TimePattern[] }
  | { type: "location"; data: RegionalCollection[] };

export function UsageChart({ type, data }: UsageChartProps) { // 3. 👇 'data' prop을 받습니다.
  
  // 4. 👇 더미 데이터를 삭제하고, API 데이터의 키(key)에 맞게 변수를 설정합니다.
  const xAxisKey = type === "hourly" ? "label" : "district_name";
  const barKey = type === "hourly" ? "count" : "total_drops";
  const barColor = type === "hourly" ? "#a78bfa" : "#2dd4bf";

  return (
    <div className="bg-black/20 rounded-lg p-4">
      <ResponsiveContainer width="100%" height={300}>
        {/* 5. 👇 'data' prop을 BarChart에 전달합니다. */}
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#444" opacity={0.5} />
          {/* 6. 👇 XAxis의 dataKey를 API에 맞게 수정 */}
          <XAxis dataKey={xAxisKey} stroke="#fff" fontSize={12} tickLine={false} axisLine={false} />
          <YAxis stroke="#fff" fontSize={12} tickLine={false} axisLine={false} />
          <Tooltip
            contentStyle={{
              backgroundColor: "#1a1a1a",
              border: "1px solid #444",
              borderRadius: "8px",
              color: "#fff",
            }}
            labelStyle={{ color: "#fff" }}
          />
          {/* 7. 👇 Bar의 dataKey를 API에 맞게 수정 */}
          <Bar dataKey={barKey} fill={barColor} radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}