"use client"

import { useState } from "react"
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
import { Separator } from "@/components/ui/separator"
import { CreditCard, Smartphone, Building2, CheckCircle } from "lucide-react"

interface PaymentDialogProps {
  payment: {
    id: string
    type: string
    amount: number
    lateFee: number
    description: string
  }
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function PaymentDialog({ payment, open, onOpenChange }: PaymentDialogProps) {
  const [paymentMethod, setPaymentMethod] = useState("")
  const [processing, setProcessing] = useState(false)
  const [success, setSuccess] = useState(false)

  const totalAmount = payment.amount + payment.lateFee

  const handlePayment = async () => {
    setProcessing(true)
    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setProcessing(false)
    setSuccess(true)

    // Close dialog after showing success
    setTimeout(() => {
      setSuccess(false)
      onOpenChange(false)
    }, 2000)
  }

  if (success) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[425px]">
          <div className="flex flex-col items-center justify-center py-8 space-y-4">
            <CheckCircle className="h-16 w-16 text-green-500" />
            <div className="text-center">
              <h3 className="text-lg font-semibold">Payment Successful!</h3>
              <p className="text-muted-foreground">Your payment has been processed successfully.</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Make Payment</DialogTitle>
          <DialogDescription>Complete your payment for {payment.type}</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Payment Summary */}
          <div className="bg-muted/50 p-4 rounded-lg space-y-2">
            <div className="flex justify-between">
              <span>{payment.type}</span>
              <span>₹{payment.amount.toLocaleString()}</span>
            </div>
            {payment.lateFee > 0 && (
              <div className="flex justify-between text-red-600">
                <span>Late Fee</span>
                <span>₹{payment.lateFee.toLocaleString()}</span>
              </div>
            )}
            <Separator />
            <div className="flex justify-between font-semibold">
              <span>Total Amount</span>
              <span>₹{totalAmount.toLocaleString()}</span>
            </div>
          </div>

          {/* Payment Method Selection */}
          <div className="space-y-3">
            <Label>Select Payment Method</Label>
            <Select value={paymentMethod} onValueChange={setPaymentMethod}>
              <SelectTrigger>
                <SelectValue placeholder="Choose payment method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="card">
                  <div className="flex items-center">
                    <CreditCard className="h-4 w-4 mr-2" />
                    Credit/Debit Card
                  </div>
                </SelectItem>
                <SelectItem value="upi">
                  <div className="flex items-center">
                    <Smartphone className="h-4 w-4 mr-2" />
                    UPI Payment
                  </div>
                </SelectItem>
                <SelectItem value="netbanking">
                  <div className="flex items-center">
                    <Building2 className="h-4 w-4 mr-2" />
                    Net Banking
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Payment Details Form */}
          {paymentMethod === "card" && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="cardNumber">Card Number</Label>
                <Input id="cardNumber" placeholder="1234 5678 9012 3456" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="expiry">Expiry Date</Label>
                  <Input id="expiry" placeholder="MM/YY" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cvv">CVV</Label>
                  <Input id="cvv" placeholder="123" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="cardName">Cardholder Name</Label>
                <Input id="cardName" placeholder="Enter name on card" />
              </div>
            </div>
          )}

          {paymentMethod === "upi" && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="upiId">UPI ID</Label>
                <Input id="upiId" placeholder="yourname@paytm" />
              </div>
            </div>
          )}

          {paymentMethod === "netbanking" && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Select Bank</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose your bank" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sbi">State Bank of India</SelectItem>
                    <SelectItem value="hdfc">HDFC Bank</SelectItem>
                    <SelectItem value="icici">ICICI Bank</SelectItem>
                    <SelectItem value="axis">Axis Bank</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={processing}>
            Cancel
          </Button>
          <Button onClick={handlePayment} disabled={!paymentMethod || processing}>
            {processing ? "Processing..." : `Pay ₹${totalAmount.toLocaleString()}`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
