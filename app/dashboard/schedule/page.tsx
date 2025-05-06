"use client"

import { useState } from "react"
import { CalendarClock, Clock, Plus, Save, Trash2 } from "lucide-react"
import { toast } from "sonner"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

type Schedule = {
  id: string
  name: string
  time: string
  days: string[]
  brightness: number
  enabled: boolean
}

export default function SchedulePage() {
  const [schedules, setSchedules] = useState<Schedule[]>([
    {
      id: "1",
      name: "Morning Light",
      time: "07:00",
      days: ["Mon", "Tue", "Wed", "Thu", "Fri"],
      brightness: 200,
      enabled: true,
    },
    {
      id: "2",
      name: "Evening Dim",
      time: "19:30",
      days: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      brightness: 120,
      enabled: true,
    },
    {
      id: "3",
      name: "Night Light",
      time: "22:00",
      days: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      brightness: 30,
      enabled: true,
    },
  ])

  const [newSchedule, setNewSchedule] = useState<Omit<Schedule, "id">>({
    name: "",
    time: "08:00",
    days: ["Mon", "Tue", "Wed", "Thu", "Fri"],
    brightness: 180,
    enabled: true,
  })

  const [isCreating, setIsCreating] = useState(false)

  const toggleSchedule = (id: string) => {
    setSchedules(
      schedules.map((schedule) => (schedule.id === id ? { ...schedule, enabled: !schedule.enabled } : schedule)),
    )

    const schedule = schedules.find((s) => s.id === id)
    if (schedule) {
      toast.success(`${schedule.name} ${!schedule.enabled ? "enabled" : "disabled"}`)
    }
  }

  const deleteSchedule = (id: string) => {
    const schedule = schedules.find((s) => s.id === id)
    setSchedules(schedules.filter((schedule) => schedule.id !== id))

    if (schedule) {
      toast.success(`${schedule.name} deleted`)
    }
  }

  const createSchedule = () => {
    if (!newSchedule.name) {
      toast.error("Please enter a name for the schedule")
      return
    }

    const id = Math.random().toString(36).substring(2, 9)
    setSchedules([...schedules, { ...newSchedule, id }])
    setNewSchedule({
      name: "",
      time: "08:00",
      days: ["Mon", "Tue", "Wed", "Thu", "Fri"],
      brightness: 180,
      enabled: true,
    })
    setIsCreating(false)
    toast.success(`${newSchedule.name} schedule created`)
  }

  const toggleDay = (day: string) => {
    if (newSchedule.days.includes(day)) {
      setNewSchedule({
        ...newSchedule,
        days: newSchedule.days.filter((d) => d !== day),
      })
    } else {
      setNewSchedule({
        ...newSchedule,
        days: [...newSchedule.days, day],
      })
    }
  }

  const allDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Schedule</h1>
          <p className="text-muted-foreground">Create and manage automated lamp schedules</p>
        </div>
        <Button onClick={() => setIsCreating(true)} disabled={isCreating}>
          <Plus className="mr-2 h-4 w-4" />
          Add Schedule
        </Button>
      </div>

      {isCreating && (
        <Card>
          <CardHeader>
            <CardTitle>Create New Schedule</CardTitle>
            <CardDescription>Set up automated control for your lamp</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Schedule Name</Label>
                <Input
                  id="name"
                  placeholder="e.g., Morning Light"
                  value={newSchedule.name}
                  onChange={(e) => setNewSchedule({ ...newSchedule, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="time">Time</Label>
                <Input
                  id="time"
                  type="time"
                  value={newSchedule.time}
                  onChange={(e) => setNewSchedule({ ...newSchedule, time: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Days</Label>
              <div className="flex flex-wrap gap-2">
                {allDays.map((day) => (
                  <Button
                    key={day}
                    variant={newSchedule.days.includes(day) ? "default" : "outline"}
                    size="sm"
                    onClick={() => toggleDay(day)}
                  >
                    {day}
                  </Button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <Label>Brightness ({newSchedule.brightness})</Label>
              <Slider
                value={[newSchedule.brightness]}
                min={0}
                max={255}
                step={1}
                onValueChange={(value) => setNewSchedule({ ...newSchedule, brightness: value[0] })}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="enabled"
                checked={newSchedule.enabled}
                onCheckedChange={(checked) => setNewSchedule({ ...newSchedule, enabled: checked })}
              />
              <Label htmlFor="enabled">Enable schedule immediately</Label>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => setIsCreating(false)}>
              Cancel
            </Button>
            <Button onClick={createSchedule}>
              <Save className="mr-2 h-4 w-4" />
              Save Schedule
            </Button>
          </CardFooter>
        </Card>
      )}

      <div className="space-y-4">
        {schedules.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-10">
              <CalendarClock className="mb-4 h-12 w-12 text-muted-foreground" />
              <h3 className="text-lg font-medium">No schedules yet</h3>
              <p className="text-sm text-muted-foreground">Create your first schedule to automate your lamp</p>
              <Button className="mt-4" onClick={() => setIsCreating(true)} disabled={isCreating}>
                <Plus className="mr-2 h-4 w-4" />
                Add Schedule
              </Button>
            </CardContent>
          </Card>
        ) : (
          schedules.map((schedule) => (
            <Card key={schedule.id}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center">
                    {schedule.name}
                    {!schedule.enabled && (
                      <Badge variant="outline" className="ml-2 text-xs font-normal">
                        Disabled
                      </Badge>
                    )}
                  </CardTitle>
                  <Switch checked={schedule.enabled} onCheckedChange={() => toggleSchedule(schedule.id)} />
                </div>
                <CardDescription>
                  {schedule.days.join(", ")} at {schedule.time}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{schedule.time}</span>
                  </div>
                  <Separator orientation="vertical" className="h-4" />
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      <div
                        className="h-3 w-3 rounded-full"
                        style={{
                          backgroundColor: `rgba(255, 184, 0, ${schedule.brightness / 255})`,
                        }}
                      />
                      <span className="text-sm">{Math.round((schedule.brightness / 255) * 100)}%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="pt-0">
                <Button
                  variant="outline"
                  size="sm"
                  className="ml-auto text-destructive hover:bg-destructive/10 hover:text-destructive"
                  onClick={() => deleteSchedule(schedule.id)}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </Button>
              </CardFooter>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
