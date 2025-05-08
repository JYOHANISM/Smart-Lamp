// app/dashboard/page.tsx
"use client"

import { useState, useEffect } from "react"
import { Activity, Battery, Lightbulb, Power, Wifi } from 'lucide-react'
import { toast } from "sonner"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Bar, BarChart, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  fetchLampStatus, 
  toggleLamp, 
  setBrightness, 
  fetchSensorData,
  type LightDataPoint,
  type EnergyDataPoint
} from "@/lib/api"

export default function Dashboard() {
  const [isOn, setIsOn] = useState(false)
  const [lightData, setLightData] = useState<LightDataPoint[]>([])
  const [energyData, setEnergyData] = useState<EnergyDataPoint[]>([])
  const [batteryLevel, setBatteryLevel] = useState(0)
  const [wifiStrength, setWifiStrength] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  // Fetch initial data
  useEffect(() => {
    async function fetchInitialData() {
      try {
        setIsLoading(true)
        
        // Fetch lamp status
        const statusData = await fetchLampStatus()
        setIsOn(statusData.isOn)
        setBatteryLevel(statusData.batteryLevel || 0)
        setWifiStrength(statusData.wifiStrength || 0)
        
        // Fetch sensor data
        const sensorData = await fetchSensorData()
        if (sensorData.lightReadings) {
          setLightData(sensorData.lightReadings)
        }
        if (sensorData.energyUsage) {
          setEnergyData(sensorData.energyUsage)
        }
      } catch (error) {
        console.error("Error fetching data:", error)
        toast.error("Failed to fetch device data")
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchInitialData()
    
    // Set up polling for real-time updates
    const interval = setInterval(async () => {
      try {
        const statusData = await fetchLampStatus()
        setIsOn(statusData.isOn)
        setBatteryLevel(statusData.batteryLevel || batteryLevel)
        setWifiStrength(statusData.wifiStrength || wifiStrength)
        
        const sensorData = await fetchSensorData()
        if (sensorData.lightReadings) {
          setLightData(sensorData.lightReadings)
        }
      } catch (error) {
        console.error("Error polling device data:", error)
      }
    }, 10000) // Poll every 10 seconds
    
    return () => clearInterval(interval)
  }, [batteryLevel, wifiStrength])

  const handleTogglePower = async () => {
    try {
      setIsLoading(true)
      await toggleLamp(!isOn)
      setIsOn(!isOn)
      toast.success(`Lamp turned ${!isOn ? "on" : "off"}`)
    } catch (error) {
      toast.error("Failed to toggle lamp")
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSetBrightness = async (value: number) => {
    try {
      await setBrightness(value)
      toast.success(`Brightness set to ${Math.round((value / 255) * 100)}%`)
    } catch (error) {
      toast.error("Failed to set brightness")
      console.error(error)
    }
  }

  if (isLoading && lightData.length === 0) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>Loading device data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Monitor and control your smart lamp</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={isOn ? "default" : "outline"} className="h-7 px-3">
            {isOn ? "Online" : "Offline"}
          </Badge>
          <Button 
            variant={isOn ? "default" : "outline"} 
            size="sm" 
            onClick={handleTogglePower}
            disabled={isLoading}
          >
            <Power className="mr-2 h-4 w-4" />
            {isOn ? "Turn Off" : "Turn On"}
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Current Status</CardTitle>
            <CardDescription>Smart Lamp Living Room</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center py-4">
              <div className="relative mb-4">
                <Lightbulb className={`h-20 w-20 ${isOn ? "text-yellow-400" : "text-gray-400"}`} strokeWidth={1.5} />
                {isOn && <div className="absolute inset-0 -z-10 animate-pulse rounded-full bg-yellow-400/30 blur-xl" />}
              </div>
              <h3 className="text-2xl font-bold">{isOn ? "Turned On" : "Turned Off"}</h3>
              <p className="text-sm text-muted-foreground">Last updated: just now</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Device Health</CardTitle>
            <CardDescription>Connection and battery status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col items-center justify-center rounded-lg border p-3">
                <Battery className="mb-2 h-8 w-8 text-green-500" />
                <div className="text-xl font-bold">{batteryLevel}%</div>
                <p className="text-xs text-muted-foreground">Battery</p>
              </div>
              <div className="flex flex-col items-center justify-center rounded-lg border p-3">
                <Wifi className="mb-2 h-8 w-8 text-blue-500" />
                <div className="text-xl font-bold">{wifiStrength}%</div>
                <p className="text-xs text-muted-foreground">Signal</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Quick Actions</CardTitle>
            <CardDescription>Commonly used controls</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                className="h-20 flex-col gap-1"
                onClick={() => handleSetBrightness(255)}
                disabled={!isOn || isLoading}
              >
                <Lightbulb className="h-6 w-6" />
                <span>Max Brightness</span>
              </Button>
              <Button
                variant="outline"
                className="h-20 flex-col gap-1"
                onClick={() => handleSetBrightness(77)}
                disabled={!isOn || isLoading}
              >
                <Lightbulb className="h-6 w-6" />
                <span>Dim Light</span>
              </Button>
              <Button
                variant="outline"
                className="h-20 flex-col gap-1"
                onClick={() => toast.success("Schedule activated")}
                disabled={!isOn || isLoading}
              >
                <Activity className="h-6 w-6" />
                <span>Auto Mode</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-20 flex-col gap-1" 
                onClick={handleTogglePower}
                disabled={isLoading}
              >
                <Power className="h-6 w-6" />
                <span>Toggle</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="light" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="light">Light Sensor Data</TabsTrigger>
          <TabsTrigger value="energy">Energy Usage</TabsTrigger>
        </TabsList>
        <TabsContent value="light">
          <Card>
            <CardHeader>
              <CardTitle>Light Sensor Readings</CardTitle>
              <CardDescription>24-hour light intensity data from the sensor</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={lightData}>
                    <XAxis dataKey="hour" tickFormatter={(hour) => `${hour}:00`} />
                    <YAxis />
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="rounded-lg border bg-background p-2 shadow-sm">
                              <div className="grid grid-cols-2 gap-2">
                                <div className="flex flex-col">
                                  <span className="text-[0.70rem] uppercase text-muted-foreground">Time</span>
                                  <span className="font-bold text-muted-foreground">{payload[0].payload.hour}:00</span>
                                </div>
                                <div className="flex flex-col">
                                  <span className="text-[0.70rem] uppercase text-muted-foreground">Light Level</span>
                                  <span className="font-bold">{payload[0].value}</span>
                                </div>
                              </div>
                            </div>
                          )
                        }
                        return null
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke="#FFB800"
                      strokeWidth={2}
                      activeDot={{ r: 6, strokeWidth: 0 }}
                      dot={{ r: 0 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="energy">
          <Card>
            <CardHeader>
              <CardTitle>Weekly Energy Usage</CardTitle>
              <CardDescription>Power consumption over the past week</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={energyData}>
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="rounded-lg border bg-background p-2 shadow-sm">
                              <div className="grid grid-cols-2 gap-2">
                                <div className="flex flex-col">
                                  <span className="text-[0.70rem] uppercase text-muted-foreground">Day</span>
                                  <span className="font-bold text-muted-foreground">{payload[0].payload.day}</span>
                                </div>
                                <div className="flex flex-col">
                                  <span className="text-[0.70rem] uppercase text-muted-foreground">Usage</span>
                                  <span className="font-bold">{payload[0].value} kWh</span>
                                </div>
                              </div>
                            </div>
                          )
                        }
                        return null
                      }}
                    />
                    <Bar dataKey="usage" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}