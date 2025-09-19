import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { FacilityGrid } from "@/components/bookings/facility-grid"
import { MyBookings } from "@/components/bookings/my-bookings"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Building, Calendar, Clock, CreditCard } from "lucide-react"

export default async function MemberBookingsPage() {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect("/auth/login")

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  if (!profile || profile.role !== "member") {
    redirect("/auth/login")
  }

  // Fetch facilities and user's bookings
  const [{ data: facilities }, { data: myBookings }] = await Promise.all([
    supabase.from("facilities").select("*").eq("is_active", true).order("name"),
    supabase
      .from("facility_bookings")
      .select("*, facility:facilities(*)")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false }),
  ])

  // Get booking statistics
  const bookingStats = {
    total: myBookings?.length || 0,
    pending: myBookings?.filter((b) => b.status === "pending").length || 0,
    approved: myBookings?.filter((b) => b.status === "approved").length || 0,
    upcoming: myBookings?.filter((b) => b.status === "approved" && new Date(b.booking_date) >= new Date()).length || 0,
  }

  return (
    <DashboardLayout profile={profile} title="Facility Bookings">
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{bookingStats.total}</div>
              <p className="text-xs text-muted-foreground">All time bookings</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{bookingStats.pending}</div>
              <p className="text-xs text-muted-foreground">Awaiting approval</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Approved</CardTitle>
              <Building className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{bookingStats.approved}</div>
              <p className="text-xs text-muted-foreground">Confirmed bookings</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Upcoming</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{bookingStats.upcoming}</div>
              <p className="text-xs text-muted-foreground">Future bookings</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="book" className="space-y-4">
          <TabsList>
            <TabsTrigger value="book">Book Facility</TabsTrigger>
            <TabsTrigger value="my-bookings">My Bookings</TabsTrigger>
          </TabsList>

          <TabsContent value="book" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Available Facilities</CardTitle>
                <CardDescription>Select a facility to make a booking</CardDescription>
              </CardHeader>
              <CardContent>
                <FacilityGrid facilities={facilities || []} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="my-bookings" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>My Bookings</CardTitle>
                <CardDescription>View and manage your facility bookings</CardDescription>
              </CardHeader>
              <CardContent>
                <MyBookings bookings={myBookings || []} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
