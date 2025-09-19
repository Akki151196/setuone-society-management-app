import { Suspense } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Wrench, Clock, CheckCircle, AlertTriangle } from "lucide-react"
import { MaintenanceRequestDialog } from "@/components/maintenance/maintenance-request-dialog"
import { MaintenanceRequests } from "@/components/maintenance/maintenance-requests"

export default function MaintenancePage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-balance">Maintenance Requests</h1>
          <p className="text-muted-foreground">Submit and track your maintenance requests</p>
        </div>
        <MaintenanceRequestDialog>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Request
          </Button>
        </MaintenanceRequestDialog>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
            <Wrench className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">This year</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">Being worked on</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">This year</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Urgent</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1</div>
            <p className="text-xs text-muted-foreground">Needs attention</p>
          </CardContent>
        </Card>
      </div>

      {/* Maintenance Requests */}
      <Card>
        <CardHeader>
          <CardTitle>Your Maintenance Requests</CardTitle>
          <CardDescription>View and track the status of your maintenance requests</CardDescription>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<div>Loading maintenance requests...</div>}>
            <MaintenanceRequests />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  )
}
