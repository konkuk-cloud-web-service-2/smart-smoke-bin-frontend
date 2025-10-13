"use client";
import { setToken, getToken, clearToken } from "@/lib/auth/token";
import { useState, useEffect } from "react";

export default function DevAuthPage() {
  const [token, setTok] = useState<string | null>(null);

  useEffect(() => { setTok(getToken()); }, []);

  return (
    <div className="p-6 space-y-4">
      <div className="text-lg font-semibold">Dev Auth</div>
      <div className="text-sm text-muted-foreground">현재 토큰: {token ? token.slice(0, 12) + "..." : "(없음)"}</div>
      <div className="flex gap-2">
        <button
          onClick={() => { setToken("dummy-jwt-token"); setTok(getToken()); }}
          className="px-3 py-1.5 rounded bg-chart-2 text-black"
        >토큰 저장</button>
        <button
          onClick={() => { clearToken(); setTok(getToken()); }}
          className="px-3 py-1.5 rounded bg-destructive"
        >토큰 삭제</button>
      </div>
    </div>
  );
}
