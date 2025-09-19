"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, Bell, MessageSquare, AlertTriangle, Info, Calendar, MoreHorizontal } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

// Mock data - replace with actual data fetching
const mockNotifications = [
  {
    id: "1",
    type: "announcement",
    title: "Society Annual General Meeting",
    message:
      "The Annual General Meeting is scheduled for February 15th, 2024 at 6:00 PM in the community hall. All members are requested to attend.",
    timestamp: "2024-01-15T10:30:00Z",
    isRead: false,
    priority: "high",
    sender: "Society Secretary",
  },
  {
    id: "2",
    type: "alert",
    title: "Water Supply Interruption",
    message:
      "Water supply will be interrupted tomorrow (Jan 16) from 10 AM to 2 PM for maintenance work on the main pipeline.",
    timestamp: "2024-01-15T09:15:00Z",
    isRead: false,
    priority: "urgent",
    sender: "Maintenance Team",
  },
  {
    id: "3",
    type: "update",
    title: "Visitor Request Approved",
    message: "Your visitor request for John Doe on January 16th has been approved by security.",
    timestamp: "2024-01-15T08:45:00Z",
    isRead: true,
    priority: "medium",
    sender: "Security Team",
  },
  {
    id: "4",
    type: "announcement",
    title: "New Gym Equipment Installed",
    message:
      "New cardio equipment has been installed in the gym. Please follow the usage guidelines posted near the equipment.",
    timestamp: "2024-01-14T16:20:00Z",
    isRead: true,
    priority: "low",
    sender: "Facility Manager",
  },
  {
    id: "5",
    type: "alert",
    title: "Maintenance Payment Due",
    message:
      "Your maintenance payment of ₹8,500 is due on February 5th, 2024. Please make the payment to avoid late fees.",
    timestamp: "2024-01-14T14:30:00Z",
    isRead: false,
    priority: "high",
    sender: "Accounts Department",
  },
]

const getTypeIcon = (type: string) => {
  switch (type) {
    case "announcement":
      return <MessageSquare className="h-4 w-4" />
    case "alert":
      return <AlertTriangle className="h-4 w-4" />
    case "update":
      return <Info className="h-4 w-4" />
    default:
      return <Bell className="h-4 w-4" />
  }
}

const getTypeColor = (type: string) => {
  switch (type) {
    case "announcement":
      return "bg-blue-100 text-blue-800"
    case "alert":
      return "bg-red-100 text-red-800"
    case "update":
      return "bg-green-100 text-green-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "urgent":
      return "bg-red-100 text-red-800"
    case "high":
      return "bg-orange-100 text-orange-800"
    case "medium":
      return "bg-yellow-100 text-yellow-800"
    case "low":
      return "bg-green-100 text-green-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

export function NotificationsList() {
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [notifications, setNotifications] = useState(mockNotifications)

  const filteredNotifications = notifications.filter((notification) => {
    const matchesSearch =
      notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notification.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notification.sender.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesType = typeFilter === "all" || notification.type === typeFilter

    return matchesSearch && matchesType
  })

  const markAsRead = (id: string) => {
    setNotifications(notifications.map((notif) => (notif.id === id ? { ...notif, isRead: true } : notif)))
  }

  const markAllAsRead = () => {
    setNotifications(notifications.map((notif) => ({ ...notif, isRead: true })))
  }

  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter((notif) => notif.id !== id))
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2 flex-1">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search notifications..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="announcement">Announcements</SelectItem>
              <SelectItem value="alert">Alerts</SelectItem>
              <SelectItem value="update">Updates</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button variant="outline" size="sm" onClick={markAllAsRead}>
          Mark All Read
        </Button>
      </div>

      <div className="space-y-3">
        {filteredNotifications.map((notification) => (
          <Card
            key={notification.id}
            className={`transition-all hover:shadow-md ${!notification.isRead ? "border-l-4 border-l-primary bg-muted/30" : ""}`}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3 flex-1">
                  <div className="mt-1">{getTypeIcon(notification.type)}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <CardTitle className={`text-base ${!notification.isRead ? "font-semibold" : "font-medium"}`}>
                        {notification.title}
                      </CardTitle>
                      {!notification.isRead && <div className="w-2 h-2 bg-primary rounded-full" />}
                    </div>
                    <div className="flex items-center space-x-2 mb-2">
                      <Badge className={getTypeColor(notification.type)} variant="secondary">
                        {notification.type.charAt(0).toUpperCase() + notification.type.slice(1)}
                      </Badge>
                      <Badge className={getPriorityColor(notification.priority)} variant="secondary">
                        {notification.priority.charAt(0).toUpperCase() + notification.priority.slice(1)}
                      </Badge>
                    </div>
                    <CardDescription className="text-sm">{notification.message}</CardDescription>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {!notification.isRead && (
                      <DropdownMenuItem onClick={() => markAsRead(notification.id)}>Mark as Read</DropdownMenuItem>
                    )}
                    <DropdownMenuItem>Share</DropdownMenuItem>
                    <DropdownMenuItem className="text-red-600" onClick={() => deleteNotification(notification.id)}>
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                    <Calendar className="h-3 w-3 mr-1" />
                    {new Date(notification.timestamp).toLocaleDateString()}
                  </div>
                  <div>From: {notification.sender}</div>
                </div>
                <div>{new Date(notification.timestamp).toLocaleTimeString()}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
