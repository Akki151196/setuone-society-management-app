"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Edit, Trash2, UserCheck, UserX, Phone, Mail } from "lucide-react"
import { EditMemberDialog } from "./edit-member-dialog"
import type { Profile } from "@/lib/types"

interface MembersTableProps {
  members: Profile[]
  userRole?: string
}

export function MembersTable({ members, userRole = "admin" }: MembersTableProps) {
  const [selectedMember, setSelectedMember] = useState<Profile | null>(null)
  const [editDialogOpen, setEditDialogOpen] = useState(false)

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case "admin":
        return "destructive"
      case "secretary":
        return "default"
      case "security":
        return "secondary"
      default:
        return "outline"
    }
  }

  const handleEditMember = (member: Profile) => {
    setSelectedMember(member)
    setEditDialogOpen(true)
  }

  const canEditMember = (memberRole: string) => {
    if (userRole === "admin") return true
    if (userRole === "secretary" && memberRole !== "admin") return true
    return false
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Member</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Apartment</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {members.map((member) => (
              <TableRow key={member.id}>
                <TableCell>
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={member.profile_image_url || "/placeholder.svg"} />
                      <AvatarFallback>
                        {member.full_name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{member.full_name}</div>
                      <div className="text-sm text-muted-foreground">{member.email}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    {member.phone && (
                      <div className="flex items-center text-sm">
                        <Phone className="mr-1 h-3 w-3" />
                        {member.phone}
                      </div>
                    )}
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Mail className="mr-1 h-3 w-3" />
                      {member.email}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    {member.apartment_number && <div className="font-medium">{member.apartment_number}</div>}
                    {member.building_name && (
                      <div className="text-sm text-muted-foreground">{member.building_name}</div>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={getRoleBadgeVariant(member.role)} className="capitalize">
                    {member.role}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={member.is_active ? "default" : "secondary"}>
                    {member.is_active ? "Active" : "Inactive"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="text-sm">{new Date(member.created_at).toLocaleDateString()}</div>
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
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      {canEditMember(member.role) && (
                        <DropdownMenuItem onClick={() => handleEditMember(member)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit Member
                        </DropdownMenuItem>
                      )}
                      {canEditMember(member.role) && (
                        <DropdownMenuItem>
                          {member.is_active ? (
                            <>
                              <UserX className="mr-2 h-4 w-4" />
                              Deactivate
                            </>
                          ) : (
                            <>
                              <UserCheck className="mr-2 h-4 w-4" />
                              Activate
                            </>
                          )}
                        </DropdownMenuItem>
                      )}
                      {userRole === "admin" && member.role !== "admin" && (
                        <>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete Member
                          </DropdownMenuItem>
                        </>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {selectedMember && (
        <EditMemberDialog
          member={selectedMember}
          open={editDialogOpen}
          onOpenChange={setEditDialogOpen}
          userRole={userRole}
        />
      )}
    </>
  )
}
