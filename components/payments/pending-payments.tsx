"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CreditCard, Calendar, AlertTriangle } from "lucide-react"
import { PaymentDialog } from "./payment-dialog"

// Mock data - replace with actual data fetching
const mockPendingPayments = [
  {
    id: "1",
    type: "Maintenance Fee",
    amount: 8500,
    dueDate: "2024-02-05",
    description: "Monthly maintenance charges for January 2024",
    status: "overdue",
    lateFee: 500,
  },
  {
    id: "2",
    type: "Parking Fee",
    amount: 2000,
    dueDate: "2024-02-10",
    description: "Monthly parking charges for covered parking slot",
    status: "due",
    lateFee: 0,
  },
  {
    id: "3",
    type: "Special Assessment",
    amount: 5000,
    dueDate: "2024-02-15",
    description: "Swimming pool renovation fund contribution",
    status: "upcoming",
    lateFee: 0,
  },
]

export function PendingPayments() {
  const [payments] = useState(mockPendingPayments)
  const [selectedPayment, setSelectedPayment] = useState<(typeof mockPendingPayments)[0] | null>(null)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "overdue":
        return "bg-red-100 text-red-800"
      case "due":
        return "bg-yellow-100 text-yellow-800"
      case "upcoming":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "overdue":
        return <AlertTriangle className="h-4 w-4 text-red-500" />
      case "due":
        return <Calendar className="h-4 w-4 text-yellow-500" />
      case "upcoming":
        return <Calendar className="h-4 w-4 text-blue-500" />
      default:
        return <Calendar className="h-4 w-4 text-gray-500" />
    }
  }

  return (
    <div className="space-y-4">
      {payments.map((payment) => (
        <Card key={payment.id} className="border-l-4 border-l-primary">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                {getStatusIcon(payment.status)}
                <CardTitle className="text-lg">{payment.type}</CardTitle>
                <Badge className={getStatusColor(payment.status)}>
                  {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                </Badge>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold">₹{payment.amount.toLocaleString()}</div>
                {payment.lateFee > 0 && <div className="text-sm text-red-600">+ ₹{payment.lateFee} late fee</div>}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <CardDescription className="mb-2">{payment.description}</CardDescription>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4 mr-1" />
                  Due: {new Date(payment.dueDate).toLocaleDateString()}
                </div>
              </div>
              <Button onClick={() => setSelectedPayment(payment)}>
                <CreditCard className="h-4 w-4 mr-2" />
                Pay Now
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}

      {selectedPayment && (
        <PaymentDialog
          payment={selectedPayment}
          open={!!selectedPayment}
          onOpenChange={(open) => !open && setSelectedPayment(null)}
        />
      )}
    </div>
  )
}
