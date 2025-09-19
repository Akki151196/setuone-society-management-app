import { redirect } from "next/navigation"
import { cookies } from "next/headers"
import { createClient } from "@/lib/supabase/server"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { FacilitiesTable } from "@/components/facilities/facilities-table"
import { AddFacilityDialog } from "@/components/facilities/add-facility-dialog"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Building, Calendar, IndianRupee, Users, Plus } from "lucide-react"

export default async function AdminFacilitiesPage() {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect("/auth/login")

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  if (!profile || !["admin", "secretary"].includes(profile.role)) {
    redirect("/auth/login")
  }

  // Fetch facilities and bookings data
  const [{ data: facilities }, { data: bookings }] = await Promise.all([
    supabase.from("facilities").select("*").order("name"),
    supabase
      .from("facility_bookings")
      .select("*, facility:facilities(*), user:profiles(*)")
      .order("created_at", { ascending: false }),
  ])

  // Calculate statistics
  const stats = {
    totalFacilities: facilities?.length || 0,
    activeFacilities: facilities?.filter((f) => f.is_active).length || 0,
    totalBookings: bookings?.length || 0,
    pendingBookings: bookings?.filter((b) => b.status === "pending").length || 0,
    totalRevenue:
      bookings?.filter((b) => b.status === "approved").reduce((sum, b) => sum + (b.total_amount || 0), 0) || 0,
  }

  return (
    <DashboardLayout profile={profile} title="Facility Management">
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Facilities</CardTitle>
              <Building className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalFacilities}</div>
              <p className="text-xs text-muted-foreground">{stats.activeFacilities} active</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalBookings}</div>
              <p className="text-xs text-muted-foreground">{stats.pendingBookings} pending approval</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Revenue</CardTitle>
              <IndianRupee className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹{stats.totalRevenue.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">From approved bookings</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg. Capacity</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {facilities?.length
                  ? Math.round(facilities.reduce((sum, f) => sum + (f.capacity || 0), 0) / facilities.length)
                  : 0}
              </div>
              <p className="text-xs text-muted-foreground">Average facility capacity</p>
            </CardContent>
          </Card>
        </div>

        {/* Facilities Table */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Facilities</CardTitle>
                <CardDescription>Manage community facilities and their bookings</CardDescription>
              </div>
              <AddFacilityDialog>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Facility
                </Button>
              </AddFacilityDialog>
            </div>
          </CardHeader>
          <CardContent>
            <FacilitiesTable facilities={facilities || []} />
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
