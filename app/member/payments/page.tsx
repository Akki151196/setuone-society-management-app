import { Suspense } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Receipt, AlertCircle, CheckCircle, Clock } from "lucide-react"
import { PaymentHistory } from "@/components/payments/payment-history"
import { PendingPayments } from "@/components/payments/pending-payments"

export default function PaymentsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-balance">Payments & Billing</h1>
        <p className="text-muted-foreground">Manage your society payments and view billing history</p>
      </div>

      {/* Payment Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Outstanding</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">₹12,500</div>
            <p className="text-xs text-muted-foreground">2 pending payments</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
            <Receipt className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹8,500</div>
            <p className="text-xs text-muted-foreground">Maintenance due</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Paid This Year</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">₹95,000</div>
            <p className="text-xs text-muted-foreground">11 payments made</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Next Due</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Feb 5</div>
            <p className="text-xs text-muted-foreground">Maintenance fee</p>
          </CardContent>
        </Card>
      </div>

      {/* Pending Payments */}
      <Card>
        <CardHeader>
          <CardTitle>Pending Payments</CardTitle>
          <CardDescription>Outstanding payments that require your attention</CardDescription>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<div>Loading pending payments...</div>}>
            <PendingPayments />
          </Suspense>
        </CardContent>
      </Card>

      {/* Payment History */}
      <Card>
        <CardHeader>
          <CardTitle>Payment History</CardTitle>
          <CardDescription>View your past payment transactions</CardDescription>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<div>Loading payment history...</div>}>
            <PaymentHistory />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  )
}
