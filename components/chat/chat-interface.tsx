"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Send, Paperclip, Smile, MoreHorizontal } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

// Mock data - replace with actual data fetching
const mockMessages = [
  {
    id: "1",
    user: {
      name: "Rajesh Kumar",
      avatar: "/placeholder.svg?height=32&width=32",
      unit: "A-101",
      role: "member",
    },
    message: "Good morning everyone! Has anyone noticed the water pressure issue in Tower A?",
    timestamp: "2024-01-15T09:30:00Z",
    type: "text",
  },
  {
    id: "2",
    user: {
      name: "Priya Sharma",
      avatar: "/placeholder.svg?height=32&width=32",
      unit: "B-205",
      role: "member",
    },
    message: "Yes, I've been experiencing the same issue since yesterday. Already raised a maintenance request.",
    timestamp: "2024-01-15T09:32:00Z",
    type: "text",
  },
  {
    id: "3",
    user: {
      name: "Society Secretary",
      avatar: "/placeholder.svg?height=32&width=32",
      unit: "Admin",
      role: "secretary",
    },
    message:
      "We're aware of the water pressure issue and our maintenance team is working on it. Expected to be resolved by evening.",
    timestamp: "2024-01-15T09:35:00Z",
    type: "text",
  },
  {
    id: "4",
    user: {
      name: "Amit Patel",
      avatar: "/placeholder.svg?height=32&width=32",
      unit: "C-304",
      role: "member",
    },
    message: "Thank you for the quick response! 👍",
    timestamp: "2024-01-15T09:36:00Z",
    type: "text",
  },
]

const getRoleColor = (role: string) => {
  switch (role) {
    case "admin":
      return "bg-red-100 text-red-800"
    case "secretary":
      return "bg-blue-100 text-blue-800"
    case "security":
      return "bg-green-100 text-green-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

export function ChatInterface() {
  const [messages, setMessages] = useState(mockMessages)
  const [newMessage, setNewMessage] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const sendMessage = () => {
    if (newMessage.trim()) {
      const message = {
        id: Date.now().toString(),
        user: {
          name: "You",
          avatar: "/placeholder.svg?height=32&width=32",
          unit: "A-101",
          role: "member",
        },
        message: newMessage,
        timestamp: new Date().toISOString(),
        type: "text",
      }
      setMessages([...messages, message])
      setNewMessage("")
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div key={message.id} className="flex items-start space-x-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src={message.user.avatar || "/placeholder.svg"} alt={message.user.name} />
              <AvatarFallback>{message.user.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-1">
                <span className="font-medium text-sm">{message.user.name}</span>
                <span className="text-xs text-muted-foreground">{message.user.unit}</span>
                {message.user.role !== "member" && (
                  <Badge className={getRoleColor(message.user.role)} variant="secondary">
                    {message.user.role}
                  </Badge>
                )}
                <span className="text-xs text-muted-foreground">
                  {new Date(message.timestamp).toLocaleTimeString()}
                </span>
              </div>
              <div className="text-sm bg-muted/50 rounded-lg p-3">{message.message}</div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-6 w-6 p-0">
                  <MoreHorizontal className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Reply</DropdownMenuItem>
                <DropdownMenuItem>Copy</DropdownMenuItem>
                <DropdownMenuItem className="text-red-600">Report</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="border-t p-4">
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm">
            <Paperclip className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <Smile className="h-4 w-4" />
          </Button>
          <Input
            placeholder="Type your message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1"
          />
          <Button onClick={sendMessage} disabled={!newMessage.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
