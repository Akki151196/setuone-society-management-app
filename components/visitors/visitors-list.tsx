"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Search, Phone, Car } from "lucide-react"

// Mock data - replace with actual data fetching
const mockVisitors = [
  {
    id: "1",
    name: "John Doe",
    phone: "+91 9876543210",
    purpose: "Personal Visit",
    visitDate: "2024-01-15",
    status: "approved",
    vehicleNumber: "KA01AB1234",
    approvedBy: "Security Guard",
    checkInTime: "10:30 AM",
    checkOutTime: null,
  },
  {
    id: "2",
    name: "Jane Smith",
    phone: "+91 9876543211",
    purpose: "Delivery",
    visitDate: "2024-01-15",
    status: "pending",
    vehicleNumber: null,
    approvedBy: null,
    checkInTime: null,
    checkOutTime: null,
  },
  {
    id: "3",
    name: "Mike Johnson",
    phone: "+91 9876543212",
    purpose: "Maintenance",
    visitDate: "2024-01-14",
    status: "completed",
    vehicleNumber: "KA02CD5678",
    approvedBy: "Security Guard",
    checkInTime: "2:00 PM",
    checkOutTime: "4:30 PM",
  },
  {
    id: "4",
    name: "Sarah Wilson",
    phone: "+91 9876543213",
    purpose: "Business",
    visitDate: "2024-01-14",
    status: "rejected",
    vehicleNumber: null,
    approvedBy: "Admin",
    checkInTime: null,
    checkOutTime: null,
  },
]

const getStatusColor = (status: string) => {
  switch (status) {
    case "approved":
      return "bg-green-100 text-green-800"
    case "pending":
      return "bg-yellow-100 text-yellow-800"
    case "rejected":
      return "bg-red-100 text-red-800"
    case "completed":
      return "bg-blue-100 text-blue-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

export function VisitorsList() {
  const [searchTerm, setSearchTerm] = useState("")
  const [visitors] = useState(mockVisitors)

  const filteredVisitors = visitors.filter(
    (visitor) =>
      visitor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      visitor.phone.includes(searchTerm) ||
      visitor.purpose.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search visitors..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Visitor Details</TableHead>
              <TableHead>Purpose</TableHead>
              <TableHead>Visit Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Check In/Out</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredVisitors.map((visitor) => (
              <TableRow key={visitor.id}>
                <TableCell>
                  <div className="space-y-1">
                    <div className="font-medium">{visitor.name}</div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Phone className="h-3 w-3 mr-1" />
                      {visitor.phone}
                    </div>
                    {visitor.vehicleNumber && (
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Car className="h-3 w-3 mr-1" />
                        {visitor.vehicleNumber}
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{visitor.purpose}</Badge>
                </TableCell>
                <TableCell>{visitor.visitDate}</TableCell>
                <TableCell>
                  <Badge className={getStatusColor(visitor.status)}>
                    {visitor.status.charAt(0).toUpperCase() + visitor.status.slice(1)}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="text-sm">
                    {visitor.checkInTime && <div className="text-green-600">In: {visitor.checkInTime}</div>}
                    {visitor.checkOutTime && <div className="text-red-600">Out: {visitor.checkOutTime}</div>}
                    {!visitor.checkInTime && visitor.status === "approved" && (
                      <div className="text-muted-foreground">Not checked in</div>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>View Details</DropdownMenuItem>
                      {visitor.status === "pending" && (
                        <>
                          <DropdownMenuItem>Approve</DropdownMenuItem>
                          <DropdownMenuItem>Reject</DropdownMenuItem>
                        </>
                      )}
                      {visitor.status === "approved" && !visitor.checkInTime && (
                        <DropdownMenuItem>Cancel</DropdownMenuItem>
                      )}
                      <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
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
