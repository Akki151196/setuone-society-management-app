"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, MapPin, IndianRupee, X } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { useState } from "react"
import Image from "next/image"

interface MyEventRegistrationsProps {
  registrations: any[]
}

export function MyEventRegistrations({ registrations }: MyEventRegistrationsProps) {
  const [isLoading, setIsLoading] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  const handleUnregister = async (registrationId: string, eventTitle: string) => {
    setIsLoading(registrationId)
    try {
      const { error } = await supabase.from("event_registrations").delete().eq("id", registrationId)

      if (error) throw error

      toast.success(`Unregistered from ${eventTitle}`)
      router.refresh()
    } catch (error: any) {
      toast.error(error.message || "Failed to unregister from event")
    } finally {
      setIsLoading(null)
    }
  }

  const canUnregister = (eventDate: string) => {
    return new Date(eventDate) > new Date()
  }

  if (registrations.length === 0) {
    return (
      <div className="text-center py-8">
        <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">No event registrations</h3>
        <p className="text-muted-foreground">Register for events to see them here</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {registrations.map((registration) => (
        <Card key={registration.id} className="overflow-hidden">
          <div className="aspect-video relative">
            <Image
              src={registration.event?.image_url || "/placeholder.svg?height=200&width=300&query=community event"}
              alt={registration.event?.title || "Event"}
              fill
              className="object-cover"
            />
            <Badge className="absolute top-2 right-2 bg-green-600">Registered</Badge>
          </div>
          <CardHeader>
            <CardTitle className="text-lg">{registration.event?.title}</CardTitle>
            <CardDescription className="line-clamp-2">{registration.event?.description}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2 text-sm">
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-2 text-muted-foreground" />
                <span>{new Date(registration.event?.event_date).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-2 text-muted-foreground" />
                <span>
                  {registration.event?.start_time} - {registration.event?.end_time}
                </span>
              </div>
              {registration.event?.location && (
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 mr-2 text-muted-foreground" />
                  <span className="line-clamp-1">{registration.event.location}</span>
                </div>
              )}
              {registration.event?.registration_fee && registration.event.registration_fee > 0 && (
                <div className="flex items-center">
                  <IndianRupee className="w-4 h-4 mr-2 text-muted-foreground" />
                  <span>₹{registration.event.registration_fee}</span>
                </div>
              )}
            </div>

            <div className="pt-2 border-t">
              <p className="text-sm text-muted-foreground">
                Registered on {new Date(registration.registered_at).toLocaleDateString()}
              </p>
            </div>

            {canUnregister(registration.event?.event_date) && (
              <Button
                variant="outline"
                className="w-full bg-transparent"
                onClick={() => handleUnregister(registration.id, registration.event?.title)}
                disabled={isLoading === registration.id}
              >
                <X className="w-4 h-4 mr-2" />
                {isLoading === registration.id ? "Unregistering..." : "Unregister"}
              </Button>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
