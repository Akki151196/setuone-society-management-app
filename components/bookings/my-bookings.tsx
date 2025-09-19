"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Calendar, Clock, IndianRupee, X } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import type { FacilityBooking } from "@/lib/types"

interface MyBookingsProps {
  bookings: FacilityBooking[]
}

export function MyBookings({ bookings }: MyBookingsProps) {
  const [isLoading, setIsLoading] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "approved":
        return "default"
      case "pending":
        return "secondary"
      case "rejected":
        return "destructive"
      case "cancelled":
        return "outline"
      default:
        return "secondary"
    }
  }

  const handleCancelBooking = async (bookingId: string) => {
    setIsLoading(bookingId)
    try {
      const { error } = await supabase.from("facility_bookings").update({ status: "cancelled" }).eq("id", bookingId)

      if (error) throw error

      toast.success("Booking cancelled successfully")
      router.refresh()
    } catch (error: any) {
      toast.error(error.message || "Failed to cancel booking")
    } finally {
      setIsLoading(null)
    }
  }

  const canCancelBooking = (booking: FacilityBooking) => {
    return (
      booking.status === "pending" || (booking.status === "approved" && new Date(booking.booking_date) > new Date())
    )
  }

  if (bookings.length === 0) {
    return (
      <div className="text-center py-8">
        <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">No bookings yet</h3>
        <p className="text-muted-foreground">Your facility bookings will appear here</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Recent Bookings Cards for Mobile */}
      <div className="grid gap-4 md:hidden">
        {bookings.slice(0, 5).map((booking) => (
          <Card key={booking.id}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">{booking.facility?.name}</CardTitle>
                <Badge variant={getStatusBadgeVariant(booking.status)} className="capitalize">
                  {booking.status}
                </Badge>
              </div>
              <CardDescription>
                {new Date(booking.booking_date).toLocaleDateString()} • {booking.start_time} - {booking.end_time}
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center text-sm text-muted-foreground">
                  <IndianRupee className="w-4 h-4 mr-1" />₹{booking.total_amount}
                </div>
                {canCancelBooking(booking) && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleCancelBooking(booking.id)}
                    disabled={isLoading === booking.id}
                  >
                    <X className="w-4 h-4 mr-1" />
                    Cancel
                  </Button>
                )}
              </div>
              {booking.purpose && <p className="text-sm text-muted-foreground mt-2">{booking.purpose}</p>}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Table for Desktop */}
      <div className="hidden md:block rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Facility</TableHead>
              <TableHead>Date & Time</TableHead>
              <TableHead>Purpose</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Booked On</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bookings.map((booking) => (
              <TableRow key={booking.id}>
                <TableCell>
                  <div>
                    <div className="font-medium">{booking.facility?.name}</div>
                    <div className="text-sm text-muted-foreground">Capacity: {booking.facility?.capacity}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <div className="flex items-center text-sm">
                      <Calendar className="mr-1 h-3 w-3" />
                      {new Date(booking.booking_date).toLocaleDateString()}
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Clock className="mr-1 h-3 w-3" />
                      {booking.start_time} - {booking.end_time}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="max-w-[200px] truncate">{booking.purpose || "Not specified"}</div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <IndianRupee className="mr-1 h-3 w-3" />
                    {booking.total_amount}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={getStatusBadgeVariant(booking.status)} className="capitalize">
                    {booking.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="text-sm">{new Date(booking.created_at).toLocaleDateString()}</div>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {canCancelBooking(booking) && (
                        <DropdownMenuItem
                          onClick={() => handleCancelBooking(booking.id)}
                          disabled={isLoading === booking.id}
                          className="text-destructive"
                        >
                          <X className="mr-2 h-4 w-4" />
                          Cancel Booking
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
