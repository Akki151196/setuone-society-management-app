"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Bell, Menu } from "lucide-react"
import type { Profile } from "@/lib/types"

interface HeaderProps {
  profile: Profile
  title: string
  onMenuClick?: () => void
}

export function Header({ profile, title, onMenuClick }: HeaderProps) {
  return (
    <header className="flex h-16 items-center justify-between border-b bg-card px-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="md:hidden" onClick={onMenuClick}>
          <Menu className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-foreground">{title}</h1>
          <p className="text-sm text-muted-foreground">Welcome back, {profile.full_name}</p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <Badge variant="destructive" className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs">
                3
              </Badge>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <div className="p-4">
              <h4 className="font-medium mb-2">Notifications</h4>
              <div className="space-y-2">
                <div className="p-2 rounded-md bg-muted/50">
                  <p className="text-sm font-medium">New visitor request</p>
                  <p className="text-xs text-muted-foreground">John Doe wants to visit tomorrow</p>
                </div>
                <div className="p-2 rounded-md bg-muted/50">
                  <p className="text-sm font-medium">Maintenance completed</p>
                  <p className="text-xs text-muted-foreground">Elevator repair has been completed</p>
                </div>
                <div className="p-2 rounded-md bg-muted/50">
                  <p className="text-sm font-medium">Payment reminder</p>
                  <p className="text-xs text-muted-foreground">Monthly maintenance due in 3 days</p>
                </div>
              </div>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
