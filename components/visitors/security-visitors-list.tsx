"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Phone, Car, Check, X, LogIn, LogOut } from "lucide-react"

// Mock data - replace with actual data fetching
const mockVisitors = [
  {
    id: "1",
    name: "John Doe",
    phone: "+91 9876543210",
    purpose: "Personal Visit",
    visitDate: "2024-01-15",
    status: "pending",
    vehicleNumber: "KA01AB1234",
    unitNumber: "A-101",
    memberName: "Rajesh Kumar",
    expectedDuration: "2 hours",
    requestedAt: "09:30 AM",
  },
  {
    id: "2",
    name: "Jane Smith",
    phone: "+91 9876543211",
    purpose: "Delivery",
    visitDate: "2024-01-15",
    status: "approved",
    vehicleNumber: null,
    unitNumber: "B-205",
    memberName: "Priya Sharma",
    expectedDuration: "30 minutes",
    requestedAt: "10:15 AM",
    checkInTime: "10:30 AM",
  },
  {
    id: "3",
    name: "Mike Johnson",
    phone: "+91 9876543212",
    purpose: "Maintenance",
    visitDate: "2024-01-15",
    status: "approved",
    vehicleNumber: "KA02CD5678",
    unitNumber: "C-304",
    memberName: "Amit Patel",
    expectedDuration: "1 hour",
    requestedAt: "11:00 AM",
    checkInTime: "11:15 AM",
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
    case "checked-in":
      return "bg-blue-100 text-blue-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

export function SecurityVisitorsList() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [visitors, setVisitors] = useState(mockVisitors)

  const filteredVisitors = visitors.filter((visitor) => {
    const matchesSearch =
      visitor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      visitor.phone.includes(searchTerm) ||
      visitor.unitNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      visitor.memberName.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || visitor.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const handleApprove = (visitorId: string) => {
    setVisitors(visitors.map((visitor) => (visitor.id === visitorId ? { ...visitor, status: "approved" } : visitor)))
  }

  const handleReject = (visitorId: string) => {
    setVisitors(visitors.map((visitor) => (visitor.id === visitorId ? { ...visitor, status: "rejected" } : visitor)))
  }

  const handleCheckIn = (visitorId: string) => {
    const now = new Date().toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    })
    setVisitors(
      visitors.map((visitor) =>
        visitor.id === visitorId ? { ...visitor, status: "checked-in", checkInTime: now } : visitor,
      ),
    )
  }

  const handleCheckOut = (visitorId: string) => {
    const now = new Date().toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    })
    setVisitors(
      visitors.map((visitor) =>
        visitor.id === visitorId ? { ...visitor, status: "completed", checkOutTime: now } : visitor,
      ),
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search visitors, units, or members..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="checked-in">Checked In</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Visitor Details</TableHead>
              <TableHead>Unit & Member</TableHead>
              <TableHead>Purpose</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
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
                  <div className="space-y-1">
                    <div className="font-medium">{visitor.unitNumber}</div>
                    <div className="text-sm text-muted-foreground">{visitor.memberName}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{visitor.purpose}</Badge>
                </TableCell>
                <TableCell>
                  <div className="text-sm">
                    <div>{visitor.expectedDuration}</div>
                    <div className="text-muted-foreground">Req: {visitor.requestedAt}</div>
                    {visitor.checkInTime && <div className="text-green-600">In: {visitor.checkInTime}</div>}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge className={getStatusColor(visitor.status)}>
                    {visitor.status.charAt(0).toUpperCase() + visitor.status.slice(1)}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    {visitor.status === "pending" && (
                      <>
                        <Button size="sm" onClick={() => handleApprove(visitor.id)} className="h-8 px-2">
                          <Check className="h-3 w-3 mr-1" />
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleReject(visitor.id)}
                          className="h-8 px-2"
                        >
                          <X className="h-3 w-3 mr-1" />
                          Reject
                        </Button>
                      </>
                    )}
                    {visitor.status === "approved" && (
                      <Button size="sm" onClick={() => handleCheckIn(visitor.id)} className="h-8 px-2">
                        <LogIn className="h-3 w-3 mr-1" />
                        Check In
                      </Button>
                    )}
                    {visitor.status === "checked-in" && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleCheckOut(visitor.id)}
                        className="h-8 px-2"
                      >
                        <LogOut className="h-3 w-3 mr-1" />
                        Check Out
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
