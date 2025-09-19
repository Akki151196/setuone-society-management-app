"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Calendar, Clock, MapPin, Users, IndianRupee, UserCheck } from "lucide-react"
import Image from "next/image"
import type { Event } from "@/lib/types"

interface EventsGridProps {
  events: Event[]
  userRegistrations: any[]
}

export function EventsGrid({ events, userRegistrations }: EventsGridProps) {
  const [isLoading, setIsLoading] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  const isRegistered = (eventId: string) => {
    return userRegistrations.some((reg) => reg.event_id === eventId)
  }

  const handleRegister = async (eventId: string) => {
    setIsLoading(eventId)
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) throw new Error("Not authenticated")

      const { error } = await supabase.from("event_registrations").insert({
        event_id: eventId,
        user_id: user.id,
      })

      if (error) throw error

      toast.success("Successfully registered for event!")
      router.refresh()
    } catch (error: any) {
      toast.error(error.message || "Failed to register for event")
    } finally {
      setIsLoading(null)
    }
  }

  if (events.length === 0) {
    return (
      <div className="text-center py-8">
        <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">No upcoming events</h3>
        <p className="text-muted-foreground">Check back later for new community events</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {events.map((event) => (
        <Card key={event.id} className="overflow-hidden hover:shadow-lg transition-shadow">
          <div className="aspect-video relative">
            <Image
              src={event.image_url || "/placeholder.svg?height=200&width=300&query=community event"}
              alt={event.title}
              fill
              className="object-cover"
            />
            {event.registration_fee && event.registration_fee > 0 && (
              <Badge className="absolute top-2 right-2 bg-primary">
                <IndianRupee className="w-3 h-3 mr-1" />₹{event.registration_fee}
              </Badge>
            )}
          </div>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg line-clamp-1">{event.title}</CardTitle>
              {isRegistered(event.id) && (
                <Badge variant="secondary">
                  <UserCheck className="w-3 h-3 mr-1" />
                  Registered
                </Badge>
              )}
            </div>
            <CardDescription className="line-clamp-2">{event.description}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2 text-sm">
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-2 text-muted-foreground" />
                <span>{new Date(event.event_date).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-2 text-muted-foreground" />
                <span>
                  {event.start_time} - {event.end_time}
                </span>
              </div>
              {event.location && (
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 mr-2 text-muted-foreground" />
                  <span className="line-clamp-1">{event.location}</span>
                </div>
              )}
              {event.max_attendees && (
                <div className="flex items-center">
                  <Users className="w-4 h-4 mr-2 text-muted-foreground" />
                  <span>Max {event.max_attendees} attendees</span>
                </div>
              )}
            </div>

            {event.creator && (
              <div className="flex items-center space-x-2 pt-2 border-t">
                <Avatar className="h-6 w-6">
                  <AvatarImage src={event.creator.profile_image_url || "/placeholder.svg"} />
                  <AvatarFallback className="text-xs">
                    {event.creator.full_name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm text-muted-foreground">Organized by {event.creator.full_name}</span>
              </div>
            )}

            <Button
              className="w-full"
              onClick={() => handleRegister(event.id)}
              disabled={isLoading === event.id || isRegistered(event.id)}
            >
              {isLoading === event.id
                ? "Registering..."
                : isRegistered(event.id)
                  ? "Already Registered"
                  : event.registration_fee && event.registration_fee > 0
                    ? `Register - ₹${event.registration_fee}`
                    : "Register for Free"}
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
