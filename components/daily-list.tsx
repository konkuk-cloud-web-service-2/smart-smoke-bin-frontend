"use client";
import { useEffect, useState } from "react";
import { getMyDailyList } from "@/lib/api/daily";
import type { DailyItem } from "@/types/daily";

export default function DailyList(){
  const [items, setItems] = useState<DailyItem[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(()=>{ (async()=>{
    setLoading(true);
    const res = await getMyDailyList(1, 12);
    setItems(res.dailies || []);
    setLoading(false);
  })(); }, []);
  if (loading) return <div className="text-sm text-muted-foreground">불러오는 중…</div>;
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {items.map(d=>(
        <div key={String(d.dailyId)} className="rounded-lg overflow-hidden border border-border bg-card">
          <img src={d.imageUrl} className="w-full h-36 object-cover" alt="" />
          <div className="p-2 text-xs text-muted-foreground">{new Date(d.createdAt).toLocaleString()}</div>
        </div>
      ))}
      {items.length===0 && <div className="text-sm text-muted-foreground">데이터가 없습니다.</div>}
    </div>
  );
}
