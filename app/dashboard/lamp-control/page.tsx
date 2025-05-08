// app/dashboard/lamp-control/page.tsx
"use client"

import { useState, useEffect } from "react"
import { Lightbulb, Power } from 'lucide-react'
import { toast } from "sonner"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { fetchLampStatus, toggleLamp, setBrightness } from "@/lib/api"

export default function LampControl() {
  const [isOn, setIsOn] = useState(true)
  const [brightness, setBrightnessValue] = useState(180)
  const [isLoading, setIsLoading] = useState(true)
  const [presets, setPresets] = useState([
    { name: "Bright", brightness: 255 },
    { name: "Medium", brightness: 150 },
    { name: "Dim", brightness: 50 },
    { name: "Night Light", brightness: 20 },
  ])

  // Fetch initial lamp status
  useEffect(() => {
    async function fetchInitialStatus() {
      try {
        setIsLoading(true)
        const statusData = await fetchLampStatus()
        setIsOn(statusData.isOn)
        setBrightnessValue(statusData.brightness || 180)
      } catch (error) {
        console.error("Error fetching lamp status:", error)
        toast.error("Failed to fetch lamp status")
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchInitialStatus()
  }, [])

  // Handle brightness changes
  const handleBrightnessChange = async (value: number[]) => {
    const brightnessValue = value[0]
    setBrightnessValue(brightnessValue)
    
    try {
      await setBrightness(brightnessValue)
      toast.success(`Brightness set to ${Math.round((brightnessValue / 255) * 100)}%`)
    } catch (error) {
      console.error("Error setting brightness:", error)
      toast.error("Failed to set brightness")
    }
  }

  const togglePower = async () => {
    try {
      setIsLoading(true)
      await toggleLamp(!isOn)
      setIsOn(!isOn)
      toast.success(`Lamp turned ${!isOn ? "on" : "off"}`)
    } catch (error) {
      console.error("Error toggling lamp:", error)
      toast.error("Failed to toggle lamp")
    } finally {
      setIsLoading(false)
    }
  }

  const applyPreset = async (preset: { name: string; brightness: number }) => {
    try {
      setIsLoading(true)
      setBrightnessValue(preset.brightness)
      await setBrightness(preset.brightness)
      toast.success(`Applied ${preset.name} preset`)
    } catch (error) {
      console.error("Error applying preset:", error)
      toast.error("Failed to apply preset")
    } finally {
      setIsLoading(false)
    }
  }

  const saveCurrentAsPreset = () => {
    const name = prompt("Enter a name for this preset:")
    if (name) {
      const newPreset = { name, brightness }
      setPresets([...presets, newPreset])
      toast.success(`Saved "${name}" preset`)
    }
  }

  // Calculate background gradient based on brightness
  const getBgStyle = () => {
    if (!isOn) return { background: "#1e293b" }

    const opacity = brightness / 255
    return {
      background: `radial-gradient(circle, rgba(255, 184, 0, ${opacity * 0.4}) 0%, transparent 70%)`,
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>Loading lamp control...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Lamp Control</h1>
        <p className="text-muted-foreground">Adjust brightness of your smart lamp</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Lamp Preview</CardTitle>
            <CardDescription>Visual representation of current settings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center">
              <div
                className="relative mb-6 flex h-48 w-48 items-center justify-center rounded-full"
                style={getBgStyle()}
              >
                <Lightbulb className={`h-24 w-24 ${isOn ? "text-yellow-400" : "text-gray-400"}`} strokeWidth={1.5} />
                {isOn && (
                  <div
                    className="absolute inset-0 -z-10 animate-pulse rounded-full blur-xl"
                    style={{ backgroundColor: `rgba(255, 184, 0, ${brightness / 255 * 0.25})` }}
                  />
                )}
              </div>
              <div className="mt-4 flex gap-4">
                <Button 
                  variant={isOn ? "default" : "outline"} 
                  size="lg" 
                  onClick={togglePower} 
                  className="w-32"
                  disabled={isLoading}
                >
                  <Power className="mr-2 h-4 w-4" />
                  {isOn ? "Turn Off" : "Turn On"}
                </Button>
                <Button 
                  variant="outline" 
                  size="lg" 
                  onClick={saveCurrentAsPreset} 
                  className="w-32" 
                  disabled={!isOn || isLoading}
                >
                  <Lightbulb className="mr-2 h-4 w-4" />
                  Save Preset
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Brightness Control</CardTitle>
              <CardDescription>Adjust the intensity (0-255)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Current: {brightness}</span>
                  <span className="text-sm font-medium">{Math.round((brightness / 255) * 100)}%</span>
                </div>
                <Slider
                  value={[brightness]}
                  min={0}
                  max={255}
                  step={1}
                  disabled={!isOn || isLoading}
                  onValueChange={handleBrightnessChange}
                  className="py-4"
                />
                <div className="flex justify-between">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleBrightnessChange([50])} 
                    disabled={!isOn || isLoading}
                  >
                    Low
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleBrightnessChange([125])} 
                    disabled={!isOn || isLoading}
                  >
                    Medium
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleBrightnessChange([200])} 
                    disabled={!isOn || isLoading}
                  >
                    High
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleBrightnessChange([255])} 
                    disabled={!isOn || isLoading}
                  >
                    Max
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Brightness Presets</CardTitle>
              <CardDescription>Quickly apply saved brightness settings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                {presets.map((preset, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="h-16 justify-start gap-3"
                    onClick={() => applyPreset(preset)}
                    disabled={!isOn || isLoading}
                  >
                    <div 
                      className="h-8 w-8 rounded-full border" 
                      style={{ 
                        backgroundColor: `rgba(255, 184, 0, ${preset.brightness / 255})` 
                      }} 
                    />
                    <div className="flex flex-col items-start">
                      <span>{preset.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {Math.round((preset.brightness / 255) * 100)}%
                      </span>
                    </div>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}