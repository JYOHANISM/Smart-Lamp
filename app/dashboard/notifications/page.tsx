"use client"

import { useState } from "react"
import { Bell, BellOff, Check, Clock, Lightbulb, Smartphone, Wifi } from "lucide-react"
import { toast } from "sonner"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"

type Notification = {
  id: string
  title: string
  message: string
  time: string
  read: boolean
  type: "status" | "alert" | "info"
}

export default function NotificationsPage() {
  const [notificationSettings, setNotificationSettings] = useState({
    statusChanges: true,
    scheduleReminders: true,
    batteryAlerts: true,
    pushNotifications: false,
    emailNotifications: true,
  })

  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      title: "Lamp Turned On",
      message: "Your living room lamp was turned on",
      time: "Today, 10:23 AM",
      read: false,
      type: "status",
    },
    {
      id: "2",
      title: "Schedule Activated",
      message: "Evening Dim schedule has been activated",
      time: "Today, 7:30 PM",
      read: true,
      type: "info",
    },
    {
      id: "3",
      title: "Connection Lost",
      message: "Your lamp lost connection to WiFi",
      time: "Yesterday, 11:45 PM",
      read: true,
      type: "alert",
    },
    {
      id: "4",
      title: "Lamp Turned Off",
      message: "Your living room lamp was turned off",
      time: "Yesterday, 10:30 PM",
      read: true,
      type: "status",
    },
  ])

  const updateSetting = (key: keyof typeof notificationSettings, value: boolean) => {
    setNotificationSettings({
      ...notificationSettings,
      [key]: value,
    })

    const settingName = key
      .replace(/([A-Z])/g, " $1")
      .toLowerCase()
      .replace(/^\w/, (c) => c.toUpperCase())

    toast.success(`${settingName} ${value ? "enabled" : "disabled"}`)
  }

  const markAsRead = (id: string) => {
    setNotifications(
      notifications.map((notification) => (notification.id === id ? { ...notification, read: true } : notification)),
    )
  }

  const markAllAsRead = () => {
    setNotifications(notifications.map((notification) => ({ ...notification, read: true })))
    toast.success("All notifications marked as read")
  }

  const clearNotifications = () => {
    setNotifications([])
    toast.success("All notifications cleared")
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "status":
        return <Lightbulb className="h-5 w-5 text-blue-500" />
      case "alert":
        return <Wifi className="h-5 w-5 text-red-500" />
      case "info":
        return <Clock className="h-5 w-5 text-green-500" />
      default:
        return <Bell className="h-5 w-5" />
    }
  }

  const unreadCount = notifications.filter((n) => !n.read).length

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Notifications</h1>
          <p className="text-muted-foreground">Manage your notification preferences and history</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={markAllAsRead} disabled={unreadCount === 0}>
            <Check className="mr-2 h-4 w-4" />
            Mark all as read
          </Button>
          <Button variant="outline" onClick={clearNotifications} disabled={notifications.length === 0}>
            <BellOff className="mr-2 h-4 w-4" />
            Clear all
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Notification Settings</CardTitle>
            <CardDescription>Configure what notifications you receive</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-sm font-medium">Event Types</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Lightbulb className="h-4 w-4 text-muted-foreground" />
                    <Label htmlFor="status-changes" className="flex-1">
                      Status changes
                    </Label>
                  </div>
                  <Switch
                    id="status-changes"
                    checked={notificationSettings.statusChanges}
                    onCheckedChange={(checked) => updateSetting("statusChanges", checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <Label htmlFor="schedule-reminders" className="flex-1">
                      Schedule reminders
                    </Label>
                  </div>
                  <Switch
                    id="schedule-reminders"
                    checked={notificationSettings.scheduleReminders}
                    onCheckedChange={(checked) => updateSetting("scheduleReminders", checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Wifi className="h-4 w-4 text-muted-foreground" />
                    <Label htmlFor="battery-alerts" className="flex-1">
                      Battery & connection alerts
                    </Label>
                  </div>
                  <Switch
                    id="battery-alerts"
                    checked={notificationSettings.batteryAlerts}
                    onCheckedChange={(checked) => updateSetting("batteryAlerts", checked)}
                  />
                </div>
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <h3 className="text-sm font-medium">Delivery Methods</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Smartphone className="h-4 w-4 text-muted-foreground" />
                    <Label htmlFor="push-notifications" className="flex-1">
                      Push notifications
                    </Label>
                  </div>
                  <Switch
                    id="push-notifications"
                    checked={notificationSettings.pushNotifications}
                    onCheckedChange={(checked) => updateSetting("pushNotifications", checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Bell className="h-4 w-4 text-muted-foreground" />
                    <Label htmlFor="email-notifications" className="flex-1">
                      Email notifications
                    </Label>
                  </div>
                  <Switch
                    id="email-notifications"
                    checked={notificationSettings.emailNotifications}
                    onCheckedChange={(checked) => updateSetting("emailNotifications", checked)}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div>
              <CardTitle>Recent Notifications</CardTitle>
              <CardDescription>Your notification history</CardDescription>
            </div>
            {unreadCount > 0 && <Badge className="ml-auto">{unreadCount} new</Badge>}
          </CardHeader>
          <CardContent>
            {notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <Bell className="mb-2 h-8 w-8 text-muted-foreground" />
                <h3 className="text-sm font-medium">No notifications</h3>
                <p className="text-sm text-muted-foreground">You're all caught up!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`relative rounded-lg border p-4 ${
                      !notification.read ? "bg-muted/40 border-primary/20" : ""
                    }`}
                  >
                    {!notification.read && <div className="absolute right-2 top-2 h-2 w-2 rounded-full bg-primary" />}
                    <div className="flex gap-4">
                      <div className="mt-0.5">{getNotificationIcon(notification.type)}</div>
                      <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium leading-none">{notification.title}</p>
                        <p className="text-sm text-muted-foreground">{notification.message}</p>
                        <div className="flex items-center justify-between pt-2">
                          <p className="text-xs text-muted-foreground">{notification.time}</p>
                          {!notification.read && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-auto p-0 text-xs font-medium"
                              onClick={() => markAsRead(notification.id)}
                            >
                              Mark as read
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
