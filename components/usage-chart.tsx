"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts"

const hourlyData = [
  { hour: "00", count: 45 },
  { hour: "03", count: 23 },
  { hour: "06", count: 67 },
  { hour: "09", count: 189 },
  { hour: "12", count: 312 },
  { hour: "15", count: 267 },
  { hour: "18", count: 234 },
  { hour: "21", count: 156 },
]

const locationData = [
  { location: "강남구", count: 4234 },
  { location: "서초구", count: 3891 },
  { location: "송파구", count: 3456 },
  { location: "마포구", count: 2987 },
  { location: "용산구", count: 2654 },
]

interface UsageChartProps {
  type: "hourly" | "location"
}

export function UsageChart({ type }: UsageChartProps) {
  const data = type === "hourly" ? hourlyData : locationData
  const dataKey = type === "hourly" ? "hour" : "location"
  const barColor = type === "hourly" ? "#a78bfa" : "#2dd4bf"

  return (
    <div className="bg-black/20 rounded-lg p-4">
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#444" opacity={0.5} />
          <XAxis dataKey={dataKey} stroke="#fff" fontSize={12} tickLine={false} axisLine={false} />
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
          <Bar dataKey="count" fill={barColor} radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
