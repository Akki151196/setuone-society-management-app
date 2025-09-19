import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, CreditCard, UserCheck, Wrench, Building, MessageSquare, AlertTriangle } from "lucide-react"
import Link from "next/link"

export default async function MemberDashboard() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect("/auth/login")

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  if (!profile || profile.role !== "member") {
    redirect("/auth/login")
  }

  // Fetch dashboard data
  const [
    { data: upcomingBookings },
    { data: pendingVisitors },
    { data: maintenanceRequests },
    { data: pendingPayments },
    { data: recentEvents },
  ] = await Promise.all([
    supabase
      .from("facility_bookings")
      .select("*, facility:facilities(*)")
      .eq("user_id", user.id)
      .eq("status", "approved")
      .gte("booking_date", new Date().toISOString().split("T")[0])
      .order("booking_date", { ascending: true })
      .limit(3),
    supabase.from("visitors").select("*").eq("host_id", user.id).eq("status", "pending").limit(5),
    supabase
      .from("maintenance_requests")
      .select("*")
      .eq("user_id", user.id)
      .neq("status", "completed")
      .order("created_at", { ascending: false })
      .limit(3),
    supabase.from("payments").select("*").eq("user_id", user.id).eq("status", "pending").limit(3),
    supabase
      .from("events")
      .select("*")
      .eq("is_active", true)
      .gte("event_date", new Date().toISOString().split("T")[0])
      .order("event_date", { ascending: true })
      .limit(3),
  ])

  const quickActions = [
    {
      title: "Book Facility",
      description: "Reserve community facilities",
      icon: Building,
      href: "/member/bookings",
      color: "bg-blue-500",
    },
    {
      title: "Add Visitor",
      description: "Register expected visitors",
      icon: UserCheck,
      href: "/member/visitors",
      color: "bg-green-500",
    },
    {
      title: "Maintenance Request",
      description: "Report maintenance issues",
      icon: Wrench,
      href: "/member/maintenance",
      color: "bg-orange-500",
    },
    {
      title: "Emergency Alert",
      description: "Report urgent incidents",
      icon: AlertTriangle,
      href: "/member/emergency",
      color: "bg-red-500",
    },
  ]

  return (
    <DashboardLayout profile={profile} title="Member Dashboard">
      <div className="space-y-6">
        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action) => (
            <Card key={action.title} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className={`p-3 rounded-lg ${action.color}`}>
                    <action.icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-sm">{action.title}</h3>
                    <p className="text-xs text-muted-foreground">{action.description}</p>
                  </div>
                </div>
                <Button asChild className="w-full mt-4" size="sm">
                  <Link href={action.href}>Quick Access</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Upcoming Bookings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Upcoming Bookings
              </CardTitle>
              <CardDescription>Your confirmed facility reservations</CardDescription>
            </CardHeader>
            <CardContent>
              {upcomingBookings && upcomingBookings.length > 0 ? (
                <div className="space-y-3">
                  {upcomingBookings.map((booking: any) => (
                    <div key={booking.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div>
                        <p className="font-medium">{booking.facility?.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(booking.booking_date).toLocaleDateString()} • {booking.start_time} -{" "}
                          {booking.end_time}
                        </p>
                      </div>
                      <Badge variant="secondary">Confirmed</Badge>
                    </div>
                  ))}
                  <Button asChild variant="outline" className="w-full bg-transparent">
                    <Link href="/member/bookings">View All Bookings</Link>
                  </Button>
                </div>
              ) : (
                <div className="text-center py-6">
                  <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                  <p className="text-muted-foreground">No upcoming bookings</p>
                  <Button asChild className="mt-2">
                    <Link href="/member/bookings">Book a Facility</Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Pending Visitors */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserCheck className="h-5 w-5" />
                Pending Visitors
              </CardTitle>
              <CardDescription>Visitors awaiting approval</CardDescription>
            </CardHeader>
            <CardContent>
              {pendingVisitors && pendingVisitors.length > 0 ? (
                <div className="space-y-3">
                  {pendingVisitors.map((visitor: any) => (
                    <div key={visitor.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div>
                        <p className="font-medium">{visitor.visitor_name}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(visitor.expected_date).toLocaleDateString()}
                        </p>
                      </div>
                      <Badge variant="outline">Pending</Badge>
                    </div>
                  ))}
                  <Button asChild variant="outline" className="w-full bg-transparent">
                    <Link href="/member/visitors">Manage Visitors</Link>
                  </Button>
                </div>
              ) : (
                <div className="text-center py-6">
                  <UserCheck className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                  <p className="text-muted-foreground">No pending visitors</p>
                  <Button asChild className="mt-2">
                    <Link href="/member/visitors">Add Visitor</Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Maintenance Requests */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wrench className="h-5 w-5" />
                Maintenance Requests
              </CardTitle>
              <CardDescription>Your active maintenance requests</CardDescription>
            </CardHeader>
            <CardContent>
              {maintenanceRequests && maintenanceRequests.length > 0 ? (
                <div className="space-y-3">
                  {maintenanceRequests.map((request: any) => (
                    <div key={request.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div>
                        <p className="font-medium">{request.title}</p>
                        <p className="text-sm text-muted-foreground">{request.category}</p>
                      </div>
                      <Badge
                        variant={
                          request.status === "pending"
                            ? "outline"
                            : request.status === "in_progress"
                              ? "default"
                              : "secondary"
                        }
                      >
                        {request.status.replace("_", " ")}
                      </Badge>
                    </div>
                  ))}
                  <Button asChild variant="outline" className="w-full bg-transparent">
                    <Link href="/member/maintenance">View All Requests</Link>
                  </Button>
                </div>
              ) : (
                <div className="text-center py-6">
                  <Wrench className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                  <p className="text-muted-foreground">No active requests</p>
                  <Button asChild className="mt-2">
                    <Link href="/member/maintenance">Create Request</Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Pending Payments */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Pending Payments
              </CardTitle>
              <CardDescription>Outstanding payments</CardDescription>
            </CardHeader>
            <CardContent>
              {pendingPayments && pendingPayments.length > 0 ? (
                <div className="space-y-3">
                  {pendingPayments.map((payment: any) => (
                    <div key={payment.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div>
                        <p className="font-medium">{payment.description}</p>
                        <p className="text-sm text-muted-foreground">
                          Due: {payment.due_date ? new Date(payment.due_date).toLocaleDateString() : "N/A"}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">₹{payment.amount}</p>
                        <Badge variant="destructive">Due</Badge>
                      </div>
                    </div>
                  ))}
                  <Button asChild variant="outline" className="w-full bg-transparent">
                    <Link href="/member/payments">View All Payments</Link>
                  </Button>
                </div>
              ) : (
                <div className="text-center py-6">
                  <CreditCard className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                  <p className="text-muted-foreground">No pending payments</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Recent Events */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Upcoming Community Events
            </CardTitle>
            <CardDescription>Don't miss out on community activities</CardDescription>
          </CardHeader>
          <CardContent>
            {recentEvents && recentEvents.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {recentEvents.map((event: any) => (
                  <div key={event.id} className="p-4 bg-muted/50 rounded-lg">
                    <h4 className="font-semibold">{event.title}</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      {new Date(event.event_date).toLocaleDateString()} • {event.start_time}
                    </p>
                    <p className="text-sm mt-2">{event.description}</p>
                    <Button asChild size="sm" className="mt-3">
                      <Link href={`/member/events/${event.id}`}>Learn More</Link>
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                <p className="text-muted-foreground">No upcoming events</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
