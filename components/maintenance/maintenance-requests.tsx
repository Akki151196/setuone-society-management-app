"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Search, MoreHorizontal, Calendar, MapPin, User } from "lucide-react"

// Mock data - replace with actual data fetching
const mockRequests = [
  {
    id: "1",
    title: "Kitchen Sink Leakage",
    category: "Plumbing",
    priority: "high",
    status: "in-progress",
    location: "Kitchen",
    submittedDate: "2024-01-15",
    assignedTo: "John Smith",
    estimatedCompletion: "2024-01-17",
    description: "Water is leaking from under the kitchen sink. The leak appears to be getting worse.",
  },
  {
    id: "2",
    title: "Living Room Light Fixture",
    category: "Electrical",
    priority: "medium",
    status: "pending",
    location: "Living Room",
    submittedDate: "2024-01-14",
    assignedTo: null,
    estimatedCompletion: null,
    description: "The main light fixture in the living room is flickering intermittently.",
  },
  {
    id: "3",
    title: "AC Not Cooling",
    category: "HVAC",
    priority: "urgent",
    status: "assigned",
    location: "Master Bedroom",
    submittedDate: "2024-01-13",
    assignedTo: "Mike Johnson",
    estimatedCompletion: "2024-01-16",
    description: "Air conditioning unit is running but not cooling the room effectively.",
  },
  {
    id: "4",
    title: "Bathroom Door Handle",
    category: "Carpentry",
    priority: "low",
    status: "completed",
    location: "Guest Bathroom",
    submittedDate: "2024-01-10",
    assignedTo: "Sarah Wilson",
    estimatedCompletion: "2024-01-12",
    description: "Door handle is loose and needs to be tightened or replaced.",
  },
]

const getStatusColor = (status: string) => {
  switch (status) {
    case "pending":
      return "bg-yellow-100 text-yellow-800"
    case "assigned":
      return "bg-blue-100 text-blue-800"
    case "in-progress":
      return "bg-purple-100 text-purple-800"
    case "completed":
      return "bg-green-100 text-green-800"
    case "cancelled":
      return "bg-red-100 text-red-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "urgent":
      return "bg-red-100 text-red-800"
    case "high":
      return "bg-orange-100 text-orange-800"
    case "medium":
      return "bg-yellow-100 text-yellow-800"
    case "low":
      return "bg-green-100 text-green-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

export function MaintenanceRequests() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [requests] = useState(mockRequests)

  const filteredRequests = requests.filter((request) => {
    const matchesSearch =
      request.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.location.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || request.status === statusFilter

    return matchesSearch && matchesStatus
  })

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search requests..."
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
            <SelectItem value="assigned">Assigned</SelectItem>
            <SelectItem value="in-progress">In Progress</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Request Details</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Assignment</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredRequests.map((request) => (
              <TableRow key={request.id}>
                <TableCell>
                  <div className="space-y-1">
                    <div className="font-medium">{request.title}</div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <MapPin className="h-3 w-3 mr-1" />
                      {request.location}
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Calendar className="h-3 w-3 mr-1" />
                      {new Date(request.submittedDate).toLocaleDateString()}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{request.category}</Badge>
                </TableCell>
                <TableCell>
                  <Badge className={getPriorityColor(request.priority)}>
                    {request.priority.charAt(0).toUpperCase() + request.priority.slice(1)}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge className={getStatusColor(request.status)}>
                    {request.status.charAt(0).toUpperCase() + request.status.slice(1).replace("-", " ")}
                  </Badge>
                </TableCell>
                <TableCell>
                  {request.assignedTo ? (
                    <div className="space-y-1">
                      <div className="flex items-center text-sm">
                        <User className="h-3 w-3 mr-1" />
                        {request.assignedTo}
                      </div>
                      {request.estimatedCompletion && (
                        <div className="text-xs text-muted-foreground">
                          ETA: {new Date(request.estimatedCompletion).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  ) : (
                    <span className="text-sm text-muted-foreground">Not assigned</span>
                  )}
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
                      <DropdownMenuItem>Add Comment</DropdownMenuItem>
                      {request.status === "pending" && <DropdownMenuItem>Edit Request</DropdownMenuItem>}
                      {request.status !== "completed" && (
                        <DropdownMenuItem className="text-red-600">Cancel Request</DropdownMenuItem>
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
