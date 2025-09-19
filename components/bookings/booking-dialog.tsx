"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { format } from "date-fns"
import { CalendarIcon, IndianRupee, Users } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Facility } from "@/lib/types"

interface BookingDialogProps {
  facility: Facility
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function BookingDialog({ facility, open, onOpenChange }: BookingDialogProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date>()
  const [formData, setFormData] = useState({
    startTime: "",
    endTime: "",
    purpose: "",
  })

  const router = useRouter()
  const supabase = createClient()

  const calculateTotal = () => {
    if (!formData.startTime || !formData.endTime || !facility.hourly_rate) return 0

    const start = new Date(`2000-01-01T${formData.startTime}`)
    const end = new Date(`2000-01-01T${formData.endTime}`)
    const hours = (end.getTime() - start.getTime()) / (1000 * 60 * 60)

    return hours > 0 ? hours * facility.hourly_rate : 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedDate) {
      toast.error("Please select a date")
      return
    }

    setIsLoading(true)

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) throw new Error("Not authenticated")

      const totalAmount = calculateTotal()

      const { error } = await supabase.from("facility_bookings").insert({
        facility_id: facility.id,
        user_id: user.id,
        booking_date: format(selectedDate, "yyyy-MM-dd"),
        start_time: formData.startTime,
        end_time: formData.endTime,
        purpose: formData.purpose,
        total_amount: totalAmount,
        status: "pending",
      })

      if (error) throw error

      toast.success("Booking request submitted successfully!")
      onOpenChange(false)
      setSelectedDate(undefined)
      setFormData({ startTime: "", endTime: "", purpose: "" })
      router.refresh()
    } catch (error: any) {
      toast.error(error.message || "Failed to submit booking")
    } finally {
      setIsLoading(false)
    }
  }

  const isDateDisabled = (date: Date) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return date < today
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Book {facility.name}</DialogTitle>
          <DialogDescription>Fill in the details to request a booking for this facility</DialogDescription>
        </DialogHeader>

        {/* Facility Info */}
        <div className="bg-muted/50 p-4 rounded-lg space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold">{facility.name}</h4>
            <Badge variant="secondary">Available</Badge>
          </div>
          <p className="text-sm text-muted-foreground">{facility.description}</p>
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center">
              <Users className="w-4 h-4 mr-1" />
              <span>Capacity: {facility.capacity}</span>
            </div>
            <div className="flex items-center">
              <IndianRupee className="w-4 h-4 mr-1" />
              <span>₹{facility.hourly_rate}/hour</span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            {/* Date Selection */}
            <div className="space-y-2">
              <Label>Booking Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !selectedDate && "text-muted-foreground",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {selectedDate ? format(selectedDate, "PPP") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    disabled={isDateDisabled}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Time Selection */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startTime">Start Time</Label>
                <Input
                  id="startTime"
                  type="time"
                  required
                  value={formData.startTime}
                  onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endTime">End Time</Label>
                <Input
                  id="endTime"
                  type="time"
                  required
                  value={formData.endTime}
                  onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                />
              </div>
            </div>

            {/* Purpose */}
            <div className="space-y-2">
              <Label htmlFor="purpose">Purpose (Optional)</Label>
              <Textarea
                id="purpose"
                placeholder="Describe the purpose of your booking..."
                value={formData.purpose}
                onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
              />
            </div>

            {/* Total Cost */}
            {formData.startTime && formData.endTime && (
              <div className="bg-primary/10 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Total Cost:</span>
                  <span className="text-lg font-bold">₹{calculateTotal()}</span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">Payment will be processed after booking approval</p>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading || !selectedDate}>
              {isLoading ? "Submitting..." : "Submit Booking"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
