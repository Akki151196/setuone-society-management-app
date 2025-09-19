"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Hash, Lock, Users, MessageSquare, Megaphone, Wrench, Calendar } from "lucide-react"

// Mock data - replace with actual data fetching
const mockChannels = [
  {
    id: "general",
    name: "General",
    description: "Community-wide discussions",
    icon: MessageSquare,
    memberCount: 156,
    unreadCount: 3,
    isPrivate: false,
    isActive: true,
  },
  {
    id: "announcements",
    name: "Announcements",
    description: "Official society announcements",
    icon: Megaphone,
    memberCount: 156,
    unreadCount: 1,
    isPrivate: false,
    isActive: false,
  },
  {
    id: "maintenance",
    name: "Maintenance",
    description: "Maintenance and repair discussions",
    icon: Wrench,
    memberCount: 89,
    unreadCount: 0,
    isPrivate: false,
    isActive: false,
  },
  {
    id: "events",
    name: "Events",
    description: "Community events and activities",
    icon: Calendar,
    memberCount: 124,
    unreadCount: 5,
    isPrivate: false,
    isActive: false,
  },
  {
    id: "committee",
    name: "Committee",
    description: "Committee members only",
    icon: Users,
    memberCount: 12,
    unreadCount: 0,
    isPrivate: true,
    isActive: false,
  },
]

export function ChatChannels() {
  const [activeChannel, setActiveChannel] = useState("general")
  const [channels] = useState(mockChannels)

  return (
    <div className="space-y-2">
      {channels.map((channel) => {
        const IconComponent = channel.icon
        return (
          <Button
            key={channel.id}
            variant={activeChannel === channel.id ? "secondary" : "ghost"}
            className="w-full justify-start h-auto p-3"
            onClick={() => setActiveChannel(channel.id)}
          >
            <div className="flex items-center space-x-3 w-full">
              <div className="flex items-center space-x-2">
                {channel.isPrivate ? (
                  <Lock className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <Hash className="h-4 w-4 text-muted-foreground" />
                )}
                <IconComponent className="h-4 w-4" />
              </div>
              <div className="flex-1 text-left">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{channel.name}</span>
                  {channel.unreadCount > 0 && (
                    <Badge variant="secondary" className="ml-2 h-5 px-2 text-xs">
                      {channel.unreadCount}
                    </Badge>
                  )}
                </div>
                <div className="text-xs text-muted-foreground mt-1">{channel.memberCount} members</div>
              </div>
            </div>
          </Button>
        )
      })}
    </div>
  )
}
