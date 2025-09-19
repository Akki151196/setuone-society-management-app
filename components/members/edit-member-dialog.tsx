"use client"

import type React from "react"

import { useState, useEffect } from "react"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import type { Profile } from "@/lib/types"

interface EditMemberDialogProps {
  member: Profile
  open: boolean
  onOpenChange: (open: boolean) => void
  userRole?: string
}

export function EditMemberDialog({ member, open, onOpenChange, userRole = "admin" }: EditMemberDialogProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    role: "",
    apartmentNumber: "",
    buildingName: "",
    emergencyContact: "",
    isActive: true,
  })

  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    if (member) {
      setFormData({
        fullName: member.full_name || "",
        phone: member.phone || "",
        role: member.role || "",
        apartmentNumber: member.apartment_number || "",
        buildingName: member.building_name || "",
        emergencyContact: member.emergency_contact || "",
        isActive: member.is_active,
      })
    }
  }, [member])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: formData.fullName,
          phone: formData.phone,
          role: formData.role,
          apartment_number: formData.apartmentNumber,
          building_name: formData.buildingName,
          emergency_contact: formData.emergencyContact,
          is_active: formData.isActive,
        })
        .eq("id", member.id)

      if (error) throw error

      toast.success("Member updated successfully!")
      onOpenChange(false)
      router.refresh()
    } catch (error: any) {
      toast.error(error.message || "Failed to update member")
    } finally {
      setIsLoading(false)
    }
  }

  const canEditRole = userRole === "admin" || (userRole === "secretary" && member.role !== "admin")

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Member</DialogTitle>
          <DialogDescription>Update member information and settings.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
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
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="apartmentNumber">Apartment Number</Label>
                <Input
                  id="apartmentNumber"
                  value={formData.apartmentNumber}
                  onChange={(e) => setFormData({ ...formData, apartmentNumber: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="buildingName">Building Name</Label>
                <Input
                  id="buildingName"
                  value={formData.buildingName}
                  onChange={(e) => setFormData({ ...formData, buildingName: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Select
                value={formData.role}
                onValueChange={(value) => setFormData({ ...formData, role: value })}
                disabled={!canEditRole}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="member">Member</SelectItem>
                  <SelectItem value="security">Security</SelectItem>
                  {userRole === "admin" && <SelectItem value="secretary">Secretary</SelectItem>}
                  {userRole === "admin" && <SelectItem value="admin">Admin</SelectItem>}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="emergencyContact">Emergency Contact</Label>
              <Input
                id="emergencyContact"
                value={formData.emergencyContact}
                onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="isActive"
                checked={formData.isActive}
                onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
              />
              <Label htmlFor="isActive">Active Member</Label>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Updating..." : "Update Member"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
