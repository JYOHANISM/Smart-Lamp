"use client"

import { useState, useEffect } from "react"
import { Activity, Battery, Lightbulb, Power, Wifi } from "lucide-react"
import { toast } from "sonner"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Bar, BarChart, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

// Mock data for light sensor readings
const generateLightData = () => {
  return Array.from({ length: 24 }, (_, i) => ({
    hour: i,
    value: Math.floor(Math.random() * 100) + 20,
  }))
}

// Mock data for energy usage
const generateEnergyData = () => {
  return Array.from({ length: 7 }, (_, i) => ({
    day: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][i],
    usage: Math.floor(Math.random() * 50) + 10,
  }))
}

export default function Dashboard() {
  const [isOn, setIsOn] = useState(true)
  const [lightData, setLightData] = useState(generateLightData())
  const [energyData, setEnergyData] = useState(generateEnergyData())
  const [batteryLevel, setBatteryLevel] = useState(87)
  const [wifiStrength, setWifiStrength] = useState(92)

  // Simulate real-time data updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Update light sensor data with a new reading
      setLightData((prev) => {
        const newData = [...prev]
        const lastHour = newData[newData.length - 1].hour
        const newValue = Math.floor(Math.random() * 100) + 20

        // Replace the oldest data point
        newData.shift()
        newData.push({ hour: (lastHour + 1) % 24, value: newValue })

        return newData
      })
    }, 10000)

    return () => clearInterval(interval)
  }, [])

  const togglePower = () => {
    setIsOn(!isOn)
    toast.success(`Lamp turned ${!isOn ? "on" : "off"}`)
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
          <Button variant={isOn ? "default" : "outline"} size="sm" onClick={togglePower}>
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
                onClick={() => toast.success("Brightness set to 100%")}
              >
                <Lightbulb className="h-6 w-6" />
                <span>Max Brightness</span>
              </Button>
              <Button
                variant="outline"
                className="h-20 flex-col gap-1"
                onClick={() => toast.success("Brightness set to 30%")}
              >
                <Lightbulb className="h-6 w-6" />
                <span>Dim Light</span>
              </Button>
              <Button
                variant="outline"
                className="h-20 flex-col gap-1"
                onClick={() => toast.success("Schedule activated")}
              >
                <Activity className="h-6 w-6" />
                <span>Auto Mode</span>
              </Button>
              <Button variant="outline" className="h-20 flex-col gap-1" onClick={togglePower}>
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
