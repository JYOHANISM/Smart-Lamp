"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Bell, Calendar, Home, Lightbulb, LogOut, Menu, Moon, Settings, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const { setTheme, theme } = useTheme()
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const menuItems = [
    {
      title: "Dashboard",
      icon: Home,
      href: "/dashboard",
    },
    {
      title: "Lamp Control",
      icon: Lightbulb,
      href: "/dashboard/lamp-control",
    },
    {
      title: "Schedule",
      icon: Calendar,
      href: "/dashboard/schedule",
    },
    {
      title: "Notifications",
      icon: Bell,
      href: "/dashboard/notifications",
    },
    {
      title: "Settings",
      icon: Settings,
      href: "/dashboard/settings",
    },
  ]

  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-background">
        {/* Desktop Sidebar */}
        <Sidebar className="border-r border-sidebar-border/10">
          <SidebarHeader className="flex h-16 items-center border-b border-sidebar-border/10 px-6">
            <div className="flex items-center gap-3 font-semibold">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-yellow-500/20">
                <Lightbulb className="h-5 w-5 text-yellow-400" />
              </div>
              <span className="text-lg">Smart Lamp</span>
            </div>
          </SidebarHeader>
          <SidebarContent className="px-3 py-4">
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.href}
                    className={`mb-1 ${pathname === item.href ? "bg-sidebar-accent/70" : "hover:bg-sidebar-accent/40"}`}
                  >
                    <Link href={item.href} className="flex items-center gap-3 py-2.5 px-3">
                      <div
                        className={`flex h-8 w-8 items-center justify-center rounded-md ${
                          pathname === item.href
                            ? "bg-primary/20 text-primary"
                            : "bg-sidebar-accent/30 text-sidebar-foreground/80"
                        }`}
                      >
                        <item.icon className="h-5 w-5" />
                      </div>
                      <span className="font-medium">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter className="border-t border-sidebar-border/10 p-4">
            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="rounded-full bg-sidebar-accent/30 hover:bg-sidebar-accent/50"
              >
                {isMounted && theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                <span className="sr-only">Toggle theme</span>
              </Button>
              <Button variant="ghost" size="sm" asChild className="bg-sidebar-accent/30 hover:bg-sidebar-accent/50">
                <Link href="/login">
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </Link>
              </Button>
            </div>
          </SidebarFooter>
        </Sidebar>

        {/* Mobile Header */}
        <div className="flex w-full flex-col">
          <header className="sticky top-0 z-10 flex h-16 items-center border-b border-border/10 bg-background px-4 md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="bg-sidebar-accent/20">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-72 p-0 bg-[#0a0d14]">
                <div className="flex h-16 items-center border-b border-sidebar-border/10 px-6">
                  <div className="flex items-center gap-3 font-semibold">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-yellow-500/20">
                      <Lightbulb className="h-5 w-5 text-yellow-400" />
                    </div>
                    <span className="text-lg">Smart Lamp</span>
                  </div>
                </div>
                <nav className="flex flex-col gap-1 p-4">
                  {menuItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center gap-3 rounded-md px-3 py-2.5 text-sm ${
                        pathname === item.href
                          ? "bg-sidebar-accent/70 text-sidebar-accent-foreground"
                          : "hover:bg-sidebar-accent/40 hover:text-sidebar-accent-foreground"
                      }`}
                    >
                      <div
                        className={`flex h-8 w-8 items-center justify-center rounded-md ${
                          pathname === item.href
                            ? "bg-primary/20 text-primary"
                            : "bg-sidebar-accent/30 text-sidebar-foreground/80"
                        }`}
                      >
                        <item.icon className="h-5 w-5" />
                      </div>
                      <span className="font-medium">{item.title}</span>
                    </Link>
                  ))}
                  <div className="mt-auto border-t border-sidebar-border/10 pt-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start bg-sidebar-accent/30 hover:bg-sidebar-accent/50"
                      asChild
                    >
                      <Link href="/login">
                        <LogOut className="mr-2 h-4 w-4" />
                        Logout
                      </Link>
                    </Button>
                  </div>
                </nav>
              </SheetContent>
            </Sheet>
            <div className="ml-4 flex items-center gap-2 font-semibold">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-yellow-500/20">
                <Lightbulb className="h-5 w-5 text-yellow-400" />
              </div>
              <span>Smart Lamp</span>
            </div>
            <div className="ml-auto">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="rounded-full bg-sidebar-accent/20 hover:bg-sidebar-accent/40"
              >
                {isMounted && theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                <span className="sr-only">Toggle theme</span>
              </Button>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 p-4 md:p-6">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  )
}
