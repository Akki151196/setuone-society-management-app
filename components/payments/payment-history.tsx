"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Search, Download, MoreHorizontal, Receipt } from "lucide-react"

// Mock data - replace with actual data fetching
const mockPaymentHistory = [
  {
    id: "1",
    type: "Maintenance Fee",
    amount: 8500,
    paidDate: "2024-01-05",
    method: "UPI",
    transactionId: "TXN123456789",
    status: "completed",
    receiptUrl: "#",
  },
  {
    id: "2",
    type: "Parking Fee",
    amount: 2000,
    paidDate: "2024-01-03",
    method: "Credit Card",
    transactionId: "TXN123456788",
    status: "completed",
    receiptUrl: "#",
  },
  {
    id: "3",
    type: "Maintenance Fee",
    amount: 8500,
    paidDate: "2023-12-05",
    method: "Net Banking",
    transactionId: "TXN123456787",
    status: "completed",
    receiptUrl: "#",
  },
  {
    id: "4",
    type: "Special Assessment",
    amount: 5000,
    paidDate: "2023-11-15",
    method: "UPI",
    transactionId: "TXN123456786",
    status: "completed",
    receiptUrl: "#",
  },
  {
    id: "5",
    type: "Facility Booking",
    amount: 1500,
    paidDate: "2023-11-10",
    method: "Credit Card",
    transactionId: "TXN123456785",
    status: "completed",
    receiptUrl: "#",
  },
]

export function PaymentHistory() {
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [payments] = useState(mockPaymentHistory)

  const filteredPayments = payments.filter((payment) => {
    const matchesSearch =
      payment.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.transactionId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.method.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesType = typeFilter === "all" || payment.type.toLowerCase().includes(typeFilter.toLowerCase())

    return matchesSearch && matchesType
  })

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search payments..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="maintenance">Maintenance</SelectItem>
            <SelectItem value="parking">Parking</SelectItem>
            <SelectItem value="facility">Facility</SelectItem>
            <SelectItem value="special">Special Assessment</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Export
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Payment Details</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Method</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPayments.map((payment) => (
              <TableRow key={payment.id}>
                <TableCell>
                  <div className="space-y-1">
                    <div className="font-medium">{payment.type}</div>
                    <div className="text-sm text-muted-foreground">ID: {payment.transactionId}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="font-medium">₹{payment.amount.toLocaleString()}</div>
                </TableCell>
                <TableCell>{new Date(payment.paidDate).toLocaleDateString()}</TableCell>
                <TableCell>
                  <Badge variant="outline">{payment.method}</Badge>
                </TableCell>
                <TableCell>
                  <Badge className="bg-green-100 text-green-800">
                    {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                  </Badge>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Receipt className="h-4 w-4 mr-2" />
                        Download Receipt
                      </DropdownMenuItem>
                      <DropdownMenuItem>View Details</DropdownMenuItem>
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
