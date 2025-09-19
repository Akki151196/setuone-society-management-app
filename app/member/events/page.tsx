import { redirect } from "next/navigation"
import { cookies } from "next/headers"
import { createClient } from "@/lib/supabase/server"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { EventsGrid } from "@/components/events/events-grid"
import { MyEventRegistrations } from "@/components/events/my-event-registrations"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, Users, Ticket, Clock } from "lucide-react"

export default async function MemberEventsPage() {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect("/auth/login")

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  if (!profile || profile.role !== "member") {
    redirect("/auth/login")
  }

  // Fetch events and registrations
  const [{ data: events }, { data: myRegistrations }] = await Promise.all([
    supabase
      .from("events")
      .select("*, creator:profiles(*)")
      .eq("is_active", true)
      .gte("event_date", new Date().toISOString().split("T")[0])
      .order("event_date", { ascending: true }),
    supabase
      .from("event_registrations")
      .select("*, event:events(*)")
      .eq("user_id", user.id)
      .order("registered_at", { ascending: false }),
  ])

  // Get event statistics
  const eventStats = {
    total: events?.length || 0,
    registered: myRegistrations?.length || 0,
    upcoming: myRegistrations?.filter((r) => new Date(r.event?.event_date || "") >= new Date()).length || 0,
    thisWeek:
      events?.filter((e) => {
        const eventDate = new Date(e.event_date)
        const today = new Date()
        const weekFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)
        return eventDate >= today && eventDate <= weekFromNow
      }).length || 0,
  }

  return (
    <DashboardLayout profile={profile} title="Community Events">
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Events</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{eventStats.total}</div>
              <p className="text-xs text-muted-foreground">Available events</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">My Registrations</CardTitle>
              <Ticket className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{eventStats.registered}</div>
              <p className="text-xs text-muted-foreground">Events registered</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Upcoming</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{eventStats.upcoming}</div>
              <p className="text-xs text-muted-foreground">Future events</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">This Week</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{eventStats.thisWeek}</div>
              <p className="text-xs text-muted-foreground">Events this week</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="browse" className="space-y-4">
          <TabsList>
            <TabsTrigger value="browse">Browse Events</TabsTrigger>
            <TabsTrigger value="my-events">My Events</TabsTrigger>
          </TabsList>

          <TabsContent value="browse" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Community Events</CardTitle>
                <CardDescription>Discover and register for community events</CardDescription>
              </CardHeader>
              <CardContent>
                <EventsGrid events={events || []} userRegistrations={myRegistrations || []} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="my-events" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>My Event Registrations</CardTitle>
                <CardDescription>View and manage your event registrations</CardDescription>
              </CardHeader>
              <CardContent>
                <MyEventRegistrations registrations={myRegistrations || []} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
