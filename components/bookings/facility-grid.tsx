"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { BookingDialog } from "./booking-dialog"
import { Building, Users, IndianRupee, Clock } from "lucide-react"
import Image from "next/image"
import type { Facility } from "@/lib/types"

interface FacilityGridProps {
  facilities: Facility[]
}

export function FacilityGrid({ facilities }: FacilityGridProps) {
  const [selectedFacility, setSelectedFacility] = useState<Facility | null>(null)
  const [bookingDialogOpen, setBookingDialogOpen] = useState(false)

  const handleBookFacility = (facility: Facility) => {
    setSelectedFacility(facility)
    setBookingDialogOpen(true)
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {facilities.map((facility) => (
          <Card key={facility.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="aspect-video relative">
              <Image
                src={facility.image_url || "/placeholder.svg?height=200&width=300&query=facility"}
                alt={facility.name}
                fill
                className="object-cover"
              />
            </div>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{facility.name}</CardTitle>
                <Badge variant="secondary">
                  <Building className="w-3 h-3 mr-1" />
                  Available
                </Badge>
              </div>
              <CardDescription className="line-clamp-2">{facility.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center">
                  <Users className="w-4 h-4 mr-1 text-muted-foreground" />
                  <span>Capacity: {facility.capacity}</span>
                </div>
                <div className="flex items-center">
                  <IndianRupee className="w-4 h-4 mr-1 text-muted-foreground" />
                  <span>₹{facility.hourly_rate}/hour</span>
                </div>
              </div>

              {facility.amenities && facility.amenities.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm font-medium">Amenities:</p>
                  <div className="flex flex-wrap gap-1">
                    {facility.amenities.slice(0, 3).map((amenity) => (
                      <Badge key={amenity} variant="outline" className="text-xs">
                        {amenity}
                      </Badge>
                    ))}
                    {facility.amenities.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{facility.amenities.length - 3} more
                      </Badge>
                    )}
                  </div>
                </div>
              )}

              <Button className="w-full" onClick={() => handleBookFacility(facility)}>
                <Clock className="w-4 h-4 mr-2" />
                Book Now
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {selectedFacility && (
        <BookingDialog facility={selectedFacility} open={bookingDialogOpen} onOpenChange={setBookingDialogOpen} />
      )}
    </>
  )
}
