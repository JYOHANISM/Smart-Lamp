// components/offline-banner.tsx
"use client"

import { useEffect, useState } from "react"
import { AlertCircle, WifiOff } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export function OfflineBanner() {
  const [isOnline, setIsOnline] = useState(true)
  const [lastSeen, setLastSeen] = useState<Date | null>(null)

  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => {
      setIsOnline(false)
      setLastSeen(new Date())
    }

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  if (isOnline) return null

  return (
    <Alert variant="destructive" className="mb-4">
      <WifiOff className="h-4 w-4" />
      <AlertTitle>Connection Lost</AlertTitle>
      <AlertDescription>
        Your device is currently offline. Some features may not work properly.
        {lastSeen && (
          <span className="block text-xs mt-1">
            Last connected: {lastSeen.toLocaleTimeString()}
          </span>
        )}
      </AlertDescription>
    </Alert>
  )
}