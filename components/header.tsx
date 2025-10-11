"use client"

import { ArrowLeft, Cloud, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"

interface HeaderProps {
  onBack?: () => void
}

export function Header({ onBack }: HeaderProps) {
  return (
    <header className="border-b bg-card/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {onBack && (
              <Button variant="ghost" size="icon" onClick={onBack} className="h-9 w-9">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            )}
            <div className="flex items-center gap-2">
              <div className="relative">
                <Sun className="h-6 w-6 text-cyan-600" />
                <Cloud className="h-4 w-4 text-teal-600 absolute -bottom-1 -right-1" />
              </div>
              <h1 className="text-xl font-bold text-foreground">그늘길</h1>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-sm text-muted-foreground">
              오늘의 UV 지수: <span className="font-semibold text-orange-600">8 (높음)</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
