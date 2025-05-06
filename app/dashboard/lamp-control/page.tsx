"use client"

import { useState, useEffect } from "react"
import { Lightbulb, Power, Zap } from "lucide-react"
import { toast } from "sonner"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { HexColorPicker } from "react-colorful"

export default function LampControl() {
  const [isOn, setIsOn] = useState(true)
  const [brightness, setBrightness] = useState(180)
  const [color, setColor] = useState("#FFB800")
  const [presets, setPresets] = useState([
    { name: "Warm", brightness: 180, color: "#FFB800" },
    { name: "Cool", brightness: 220, color: "#E0F2FF" },
    { name: "Reading", brightness: 255, color: "#FFFFFF" },
    { name: "Movie", brightness: 80, color: "#FF9D00" },
    { name: "Night", brightness: 30, color: "#FF5C00" },
  ])

  // Simulate lamp state changes
  useEffect(() => {
    if (isOn) {
      toast.success(`Brightness set to ${Math.round((brightness / 255) * 100)}%`)
    }
  }, [brightness, isOn])

  const togglePower = () => {
    setIsOn(!isOn)
    toast.success(`Lamp turned ${!isOn ? "on" : "off"}`)
  }

  const applyPreset = (preset: { name: string; brightness: number; color: string }) => {
    setBrightness(preset.brightness)
    setColor(preset.color)
    toast.success(`Applied ${preset.name} preset`)
  }

  const saveCurrentAsPreset = () => {
    const name = prompt("Enter a name for this preset:")
    if (name) {
      const newPreset = { name, brightness, color }
      setPresets([...presets, newPreset])
      toast.success(`Saved "${name}" preset`)
    }
  }

  // Calculate background gradient based on brightness and color
  const getBgStyle = () => {
    if (!isOn) return { background: "#1e293b" }

    const opacity = brightness / 255
    return {
      background: `radial-gradient(circle, ${color}${Math.round(opacity * 40).toString(16)} 0%, transparent 70%)`,
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Lamp Control</h1>
        <p className="text-muted-foreground">Adjust brightness and color of your smart lamp</p>
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
                    style={{ backgroundColor: `${color}40` }}
                  />
                )}
              </div>
              <div className="mt-4 flex gap-4">
                <Button variant={isOn ? "default" : "outline"} size="lg" onClick={togglePower} className="w-32">
                  <Power className="mr-2 h-4 w-4" />
                  {isOn ? "Turn Off" : "Turn On"}
                </Button>
                <Button variant="outline" size="lg" onClick={saveCurrentAsPreset} className="w-32" disabled={!isOn}>
                  <Zap className="mr-2 h-4 w-4" />
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
                  disabled={!isOn}
                  onValueChange={(value) => setBrightness(value[0])}
                  className="py-4"
                />
                <div className="flex justify-between">
                  <Button variant="outline" size="sm" onClick={() => setBrightness(50)} disabled={!isOn}>
                    Low
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setBrightness(125)} disabled={!isOn}>
                    Medium
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setBrightness(200)} disabled={!isOn}>
                    High
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setBrightness(255)} disabled={!isOn}>
                    Max
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Color Control</CardTitle>
              <CardDescription>Choose the perfect color for your lamp</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="picker">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="picker">Color Picker</TabsTrigger>
                  <TabsTrigger value="presets">Presets</TabsTrigger>
                </TabsList>
                <TabsContent value="picker" className="py-4">
                  <div className="flex justify-center">
                    <HexColorPicker
                      color={color}
                      onChange={setColor}
                      style={{ width: "100%", height: "200px" }}
                      className={!isOn ? "opacity-50 pointer-events-none" : ""}
                    />
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-sm font-medium">Current color:</span>
                    <div className="flex items-center gap-2">
                      <div className="h-6 w-6 rounded-full border" style={{ backgroundColor: color }} />
                      <span className="text-sm font-mono">{color}</span>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="presets" className="py-4">
                  <div className="grid grid-cols-2 gap-3">
                    {presets.map((preset, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        className="h-16 justify-start gap-3"
                        onClick={() => applyPreset(preset)}
                        disabled={!isOn}
                      >
                        <div className="h-8 w-8 rounded-full border" style={{ backgroundColor: preset.color }} />
                        <div className="flex flex-col items-start">
                          <span>{preset.name}</span>
                          <span className="text-xs text-muted-foreground">
                            {Math.round((preset.brightness / 255) * 100)}%
                          </span>
                        </div>
                      </Button>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
