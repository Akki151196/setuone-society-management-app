"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import {
  Home,
  Users,
  Calendar,
  UserCheck,
  Wrench,
  CreditCard,
  AlertTriangle,
  MessageSquare,
  BarChart3,
  Settings,
  LogOut,
  Building,
  Shield,
  Clock,
} from "lucide-react"
import type { Profile } from "@/lib/types"

interface SidebarProps {
  profile: Profile
  className?: string
}

const navigationItems = {
  admin: [
    { name: "Dashboard", href: "/admin/dashboard", icon: Home },
    { name: "Members", href: "/admin/members", icon: Users },
    { name: "Facilities", href: "/admin/facilities", icon: Building },
    { name: "Events", href: "/admin/events", icon: Calendar },
    { name: "Visitors", href: "/admin/visitors", icon: UserCheck },
    { name: "Maintenance", href: "/admin/maintenance", icon: Wrench },
    { name: "Payments", href: "/admin/payments", icon: CreditCard },
    { name: "Incidents", href: "/admin/incidents", icon: AlertTriangle },
    { name: "Staff", href: "/admin/staff", icon: Clock },
    { name: "Community", href: "/admin/community", icon: MessageSquare },
    { name: "Analytics", href: "/admin/analytics", icon: BarChart3 },
    { name: "Settings", href: "/admin/settings", icon: Settings },
  ],
  secretary: [
    { name: "Dashboard", href: "/secretary/dashboard", icon: Home },
    { name: "Members", href: "/secretary/members", icon: Users },
    { name: "Events", href: "/secretary/events", icon: Calendar },
    { name: "Bookings", href: "/secretary/bookings", icon: Building },
    { name: "Visitors", href: "/secretary/visitors", icon: UserCheck },
    { name: "Maintenance", href: "/secretary/maintenance", icon: Wrench },
    { name: "Payments", href: "/secretary/payments", icon: CreditCard },
    { name: "Community", href: "/secretary/community", icon: MessageSquare },
    { name: "Reports", href: "/secretary/reports", icon: BarChart3 },
  ],
  security: [
    { name: "Dashboard", href: "/security/dashboard", icon: Home },
    { name: "Visitors", href: "/security/visitors", icon: UserCheck },
    { name: "Incidents", href: "/security/incidents", icon: AlertTriangle },
    { name: "Attendance", href: "/security/attendance", icon: Clock },
    { name: "Emergency", href: "/security/emergency", icon: Shield },
  ],
  member: [
    { name: "Dashboard", href: "/member/dashboard", icon: Home },
    { name: "Book Facility", href: "/member/bookings", icon: Building },
    { name: "Events", href: "/member/events", icon: Calendar },
    { name: "Visitors", href: "/member/visitors", icon: UserCheck },
    { name: "Maintenance", href: "/member/maintenance", icon: Wrench },
    { name: "Payments", href: "/member/payments", icon: CreditCard },
    { name: "Community", href: "/member/community", icon: MessageSquare },
    { name: "Profile", href: "/member/profile", icon: Settings },
  ],
}

export function Sidebar({ profile, className }: SidebarProps) {
  const router = useRouter()
  const supabase = createClient()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push("/auth/login")
  }

  const navItems = navigationItems[profile.role] || navigationItems.member

  return (
    <div className={cn("flex h-full w-64 flex-col bg-card border-r", className)}>
      {/* Logo */}
      <div className="flex h-16 items-center px-6 border-b">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/unblurimageai-enhanced-Untitle-unscreen-fxROYz6oaC3Gu5HF1zFBpbdPZFSGOn.gif"
              alt="Setuone"
              width={24}
              height={24}
              className="rounded"
            />
          </div>
          <span className="text-xl font-bold text-foreground">Setuone</span>
        </div>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="space-y-1">
          {navItems.map((item) => (
            <Button key={item.name} variant="ghost" className="w-full justify-start h-10 px-3" asChild>
              <Link href={item.href}>
                <item.icon className="mr-3 h-4 w-4" />
                {item.name}
              </Link>
            </Button>
          ))}
        </nav>
      </ScrollArea>

      {/* User Profile */}
      <div className="border-t p-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="w-full justify-start h-auto p-2">
              <div className="flex items-center gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={profile.profile_image_url || "/placeholder.svg"} />
                  <AvatarFallback>
                    {profile.full_name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 text-left">
                  <p className="text-sm font-medium">{profile.full_name}</p>
                  <p className="text-xs text-muted-foreground capitalize">{profile.role}</p>
                </div>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href={`/${profile.role}/profile`}>
                <Settings className="mr-2 h-4 w-4" />
                Profile Settings
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleSignOut}>
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}
