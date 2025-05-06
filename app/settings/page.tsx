"use client"

import { useState } from "react"
import { Lightbulb, Save, User, Wifi } from "lucide-react"
import { toast } from "sonner"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function SettingsPage() {
  const [deviceSettings, setDeviceSettings] = useState({
    name: "Living Room Lamp",
    autoUpdate: true,
    sleepMode: true,
    sleepAfter: "30",
    powerSaving: true,
  })

  const [accountSettings, setAccountSettings] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    language: "en",
    darkMode: true,
    notifications: true,
  })

  const [wifiSettings, setWifiSettings] = useState({
    ssid: "HomeNetwork",
    password: "••••••••••",
    ipAddress: "192.168.1.45",
    macAddress: "00:1B:44:11:3A:B7",
    signalStrength: "Excellent",
  })

  const updateDeviceSetting = <K extends keyof typeof deviceSettings>(key: K, value: (typeof deviceSettings)[K]) => {
    setDeviceSettings({
      ...deviceSettings,
      [key]: value,
    })
  }

  const updateAccountSetting = <K extends keyof typeof accountSettings>(key: K, value: (typeof accountSettings)[K]) => {
    setAccountSettings({
      ...accountSettings,
      [key]: value,
    })
  }

  const saveDeviceSettings = () => {
    toast.success("Device settings saved")
  }

  const saveAccountSettings = () => {
    toast.success("Account settings saved")
  }

  const saveWifiSettings = () => {
    toast.success("WiFi settings saved")
  }

  const resetDevice = () => {
    const confirm = window.confirm("Are you sure you want to reset your device? This will erase all settings and data.")

    if (confirm) {
      toast.success("Device has been reset to factory settings")
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">Manage your device and account settings</p>
      </div>

      <Tabs defaultValue="device" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="device">
            <Lightbulb className="mr-2 h-4 w-4" />
            Device
          </TabsTrigger>
          <TabsTrigger value="account">
            <User className="mr-2 h-4 w-4" />
            Account
          </TabsTrigger>
          <TabsTrigger value="network">
            <Wifi className="mr-2 h-4 w-4" />
            Network
          </TabsTrigger>
        </TabsList>

        <TabsContent value="device" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Device Settings</CardTitle>
              <CardDescription>Configure your smart lamp device settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="device-name">Device Name</Label>
                <Input
                  id="device-name"
                  value={deviceSettings.name}
                  onChange={(e) => updateDeviceSetting("name", e.target.value)}
                />
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="auto-update">Automatic Updates</Label>
                    <p className="text-sm text-muted-foreground">Keep your device firmware up to date</p>
                  </div>
                  <Switch
                    id="auto-update"
                    checked={deviceSettings.autoUpdate}
                    onCheckedChange={(checked) => updateDeviceSetting("autoUpdate", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="sleep-mode">Sleep Mode</Label>
                    <p className="text-sm text-muted-foreground">Automatically turn off when inactive</p>
                  </div>
                  <Switch
                    id="sleep-mode"
                    checked={deviceSettings.sleepMode}
                    onCheckedChange={(checked) => updateDeviceSetting("sleepMode", checked)}
                  />
                </div>

                {deviceSettings.sleepMode && (
                  <div className="ml-6 space-y-2">
                    <Label htmlFor="sleep-after">Sleep After</Label>
                    <Select
                      value={deviceSettings.sleepAfter}
                      onValueChange={(value) => updateDeviceSetting("sleepAfter", value)}
                    >
                      <SelectTrigger id="sleep-after">
                        <SelectValue placeholder="Select time" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="15">15 minutes</SelectItem>
                        <SelectItem value="30">30 minutes</SelectItem>
                        <SelectItem value="60">1 hour</SelectItem>
                        <SelectItem value="120">2 hours</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="power-saving">Power Saving Mode</Label>
                    <p className="text-sm text-muted-foreground">Reduce brightness when battery is low</p>
                  </div>
                  <Switch
                    id="power-saving"
                    checked={deviceSettings.powerSaving}
                    onCheckedChange={(checked) => updateDeviceSetting("powerSaving", checked)}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={resetDevice}>
                Reset Device
              </Button>
              <Button onClick={saveDeviceSettings}>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="account" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Account Settings</CardTitle>
              <CardDescription>Manage your account preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="account-name">Name</Label>
                  <Input
                    id="account-name"
                    value={accountSettings.name}
                    onChange={(e) => updateAccountSetting("name", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="account-email">Email</Label>
                  <Input
                    id="account-email"
                    type="email"
                    value={accountSettings.email}
                    onChange={(e) => updateAccountSetting("email", e.target.value)}
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="language">Language</Label>
                  <Select
                    value={accountSettings.language}
                    onValueChange={(value) => updateAccountSetting("language", value)}
                  >
                    <SelectTrigger id="language">
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Spanish</SelectItem>
                      <SelectItem value="fr">French</SelectItem>
                      <SelectItem value="de">German</SelectItem>
                      <SelectItem value="id">Indonesian</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="dark-mode">Dark Mode</Label>
                    <p className="text-sm text-muted-foreground">Use dark theme for the interface</p>
                  </div>
                  <Switch
                    id="dark-mode"
                    checked={accountSettings.darkMode}
                    onCheckedChange={(checked) => updateAccountSetting("darkMode", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="notifications">Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive updates and alerts via email</p>
                  </div>
                  <Switch
                    id="notifications"
                    checked={accountSettings.notifications}
                    onCheckedChange={(checked) => updateAccountSetting("notifications", checked)}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={saveAccountSettings} className="ml-auto">
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="network" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Network Settings</CardTitle>
              <CardDescription>Configure your device's network connection</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="wifi-ssid">WiFi Network</Label>
                  <Input
                    id="wifi-ssid"
                    value={wifiSettings.ssid}
                    onChange={(e) =>
                      setWifiSettings({
                        ...wifiSettings,
                        ssid: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="wifi-password">Password</Label>
                  <Input
                    id="wifi-password"
                    type="password"
                    value={wifiSettings.password}
                    onChange={(e) =>
                      setWifiSettings({
                        ...wifiSettings,
                        password: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="rounded-lg border p-4">
                  <h3 className="mb-2 text-sm font-medium">Connection Information</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">IP Address</span>
                      <span className="text-sm font-mono">{wifiSettings.ipAddress}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">MAC Address</span>
                      <span className="text-sm font-mono">{wifiSettings.macAddress}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Signal Strength</span>
                      <span className="text-sm">{wifiSettings.signalStrength}</span>
                    </div>
                  </div>
                </div>

                <Button variant="outline" className="w-full" onClick={() => toast.success("Scanning for networks...")}>
                  <Wifi className="mr-2 h-4 w-4" />
                  Scan for Networks
                </Button>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={saveWifiSettings} className="ml-auto">
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
