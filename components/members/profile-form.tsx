"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import type { Profile } from "@/lib/types"

interface ProfileFormProps {
  profile: Profile
}

export function ProfileForm({ profile }: ProfileFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    fullName: profile.full_name || "",
    phone: profile.phone || "",
    apartmentNumber: profile.apartment_number || "",
    buildingName: profile.building_name || "",
    emergencyContact: profile.emergency_contact || "",
  })

  const router = useRouter()
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: formData.fullName,
          phone: formData.phone,
          apartment_number: formData.apartmentNumber,
          building_name: formData.buildingName,
          emergency_contact: formData.emergencyContact,
        })
        .eq("id", profile.id)

      if (error) throw error

      toast.success("Profile updated successfully!")
      router.refresh()
    } catch (error: any) {
      toast.error(error.message || "Failed to update profile")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="fullName">Full Name</Label>
          <Input
            id="fullName"
            required
            value={formData.fullName}
            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number</Label>
          <Input
            id="phone"
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="apartmentNumber">Apartment Number</Label>
          <Input
            id="apartmentNumber"
            placeholder="A-101"
            value={formData.apartmentNumber}
            onChange={(e) => setFormData({ ...formData, apartmentNumber: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="buildingName">Building Name</Label>
          <Input
            id="buildingName"
            placeholder="Tower A"
            value={formData.buildingName}
            onChange={(e) => setFormData({ ...formData, buildingName: e.target.value })}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="emergencyContact">Emergency Contact</Label>
        <Input
          id="emergencyContact"
          placeholder="Emergency contact number"
          value={formData.emergencyContact}
          onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <Label>Email Address</Label>
        <Input value={profile.email} disabled className="bg-muted" />
        <p className="text-sm text-muted-foreground">Email cannot be changed. Contact admin if needed.</p>
      </div>

      <div className="space-y-2">
        <Label>Role</Label>
        <Input value={profile.role} disabled className="bg-muted capitalize" />
        <p className="text-sm text-muted-foreground">Role is managed by society administration.</p>
      </div>

      <Button type="submit" disabled={isLoading}>
        {isLoading ? "Updating..." : "Update Profile"}
      </Button>
    </form>
  )
}
