"use client"; 

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Loader2 } from "lucide-react"; 
import { useState, useEffect } from "react"; 

interface Device {
  id: string; 
  device_id: string;
  location: string;
  fill_percentage: number;
  status: "active" | "maintenance" | "offline" | string;
}

export function DeviceTable() {

  const [devices, setDevices] = useState<Device[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true); 
      try {
        const res = await fetch(
          `https://u0r3k4is4k.execute-api.ap-northeast-2.amazonaws.com/Prod/devices`,
          {
            cache: "no-store", 
          }
        );

        if (!res.ok) {
          throw new Error(`Failed to fetch devices: ${res.statusText}`);
        }

        const response = await res.json();
        setDevices(response.data); 
      } catch (error) {
        console.error("Failed to fetch devices:", error);
        setDevices([]); 
      } finally {
        setIsLoading(false); 
      }
    }

    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex h-[300px] w-full items-center justify-center rounded-lg border border-dashed border-border bg-muted/20">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-border">
      <table className="w-full">
        <thead>
          <tr className="border-b border-border bg-muted/50">
            <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
              장비 ID
            </th>
            <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
              위치
            </th>
            <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
              적재율
            </th>
            <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
              상태
            </th>
            <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">
              작업
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {devices.length === 0 ? (
            <tr>
              <td
                colSpan={5}
                className="py-10 text-center text-muted-foreground"
              >
                표시할 장비 데이터가 없습니다.
              </td>
            </tr>
          ) : (
            devices.map((device) => (
              <tr key={device.id} className="hover:bg-muted/50 transition-colors">
                <td className="py-3 px-4">
                  <span className="font-mono text-sm font-medium">
                    {device.device_id}
                  </span>
                </td>
                <td className="py-3 px-4 text-sm">{device.location}</td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2">
                    <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all bg-chart-3`} 
                        style={{ width: `${device.fill_percentage}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium">
                      {device.fill_percentage}%
                    </span>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <Badge
                    variant={
                      device.status === "active"
                        ? "default"
                        : device.status === "full"
                          ? "secondary"
                          : "destructive"
                    }
                    className={

                      device.status === "active"
                        ? "bg-green-500/20 text-green-400 hover:bg-green-500/30 border-green-500/30"
                        : device.status === "maintenance"
                          ? "bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30 border-yellow-500/30"
                        : device.status === "full"
                          ? "bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30 border-yellow-500/30"
                          : "bg-red-500/20 text-red-400 hover:bg-red-500/30 border-red-500/30" // Offline 등
                    }
                  >
                    {device.status === "active" && "정상"}
                    {device.status === "maintenance" && "점검중"}
                    {device.status === "full" && "포화"}
                    {device.status === "offline" && "오프라인"}
                  </Badge>
                </td>
                <td className="py-3 px-4 text-right">
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}