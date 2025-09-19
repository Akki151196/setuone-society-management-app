"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Edit, Trash2, Users, IndianRupee, Eye } from "lucide-react"
import Image from "next/image"
import type { Facility } from "@/lib/types"

interface FacilitiesTableProps {
  facilities: Facility[]
}

export function FacilitiesTable({ facilities }: FacilitiesTableProps) {
  const [selectedFacility, setSelectedFacility] = useState<Facility | null>(null)

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Facility</TableHead>
            <TableHead>Capacity</TableHead>
            <TableHead>Rate</TableHead>
            <TableHead>Amenities</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Created</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {facilities.map((facility) => (
            <TableRow key={facility.id}>
              <TableCell>
                <div className="flex items-center space-x-3">
                  <div className="relative w-12 h-12 rounded-md overflow-hidden">
                    <Image
                      src={facility.image_url || "/placeholder.svg?height=48&width=48&query=facility"}
                      alt={facility.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <div className="font-medium">{facility.name}</div>
                    <div className="text-sm text-muted-foreground line-clamp-1">{facility.description}</div>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center">
                  <Users className="mr-1 h-3 w-3" />
                  {facility.capacity}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center">
                  <IndianRupee className="mr-1 h-3 w-3" />
                  {facility.hourly_rate}/hr
                </div>
              </TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-1">
                  {facility.amenities?.slice(0, 2).map((amenity) => (
                    <Badge key={amenity} variant="outline" className="text-xs">
                      {amenity}
                    </Badge>
                  ))}
                  {facility.amenities && facility.amenities.length > 2 && (
                    <Badge variant="outline" className="text-xs">
                      +{facility.amenities.length - 2}
                    </Badge>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <Badge variant={facility.is_active ? "default" : "secondary"}>
                  {facility.is_active ? "Active" : "Inactive"}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="text-sm">{new Date(facility.created_at).toLocaleDateString()}</div>
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
                    <DropdownMenuItem>
                      <Eye className="mr-2 h-4 w-4" />
                      View Details
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit Facility
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
