"use client"

import { useState } from "react"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Bell, Mail, Smartphone, Volume2 } from "lucide-react"

export function NotificationSettings() {
  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
    soundEnabled: true,
    announcements: true,
    alerts: true,
    updates: true,
    maintenance: true,
    payments: true,
    visitors: true,
    events: true,
    quietHours: "22:00-08:00",
  })

  const handleSettingChange = (key: string, value: boolean | string) => {
    setSettings({ ...settings, [key]: value })
  }

  const saveSettings = () => {
    // TODO: Implement settings save
    console.log("Saving notification settings:", settings)
  }

  return (
    <div className="space-y-6">
      {/* Delivery Methods */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium flex items-center">
          <Bell className="h-4 w-4 mr-2" />
          Delivery Methods
        </h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <Label htmlFor="email">Email Notifications</Label>
            </div>
            <Switch
              id="email"
              checked={settings.emailNotifications}
              onCheckedChange={(checked) => handleSettingChange("emailNotifications", checked)}
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Bell className="h-4 w-4 text-muted-foreground" />
              <Label htmlFor="push">Push Notifications</Label>
            </div>
            <Switch
              id="push"
              checked={settings.pushNotifications}
              onCheckedChange={(checked) => handleSettingChange("pushNotifications", checked)}
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Smartphone className="h-4 w-4 text-muted-foreground" />
              <Label htmlFor="sms">SMS Notifications</Label>
            </div>
            <Switch
              id="sms"
              checked={settings.smsNotifications}
              onCheckedChange={(checked) => handleSettingChange("smsNotifications", checked)}
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Volume2 className="h-4 w-4 text-muted-foreground" />
              <Label htmlFor="sound">Sound Enabled</Label>
            </div>
            <Switch
              id="sound"
              checked={settings.soundEnabled}
              onCheckedChange={(checked) => handleSettingChange("soundEnabled", checked)}
            />
          </div>
        </div>
      </div>

      <Separator />

      {/* Notification Types */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium">Notification Types</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label htmlFor="announcements">Society Announcements</Label>
            <Switch
              id="announcements"
              checked={settings.announcements}
              onCheckedChange={(checked) => handleSettingChange("announcements", checked)}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="alerts">Emergency Alerts</Label>
            <Switch
              id="alerts"
              checked={settings.alerts}
              onCheckedChange={(checked) => handleSettingChange("alerts", checked)}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="updates">System Updates</Label>
            <Switch
              id="updates"
              checked={settings.updates}
              onCheckedChange={(checked) => handleSettingChange("updates", checked)}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="maintenance">Maintenance Requests</Label>
            <Switch
              id="maintenance"
              checked={settings.maintenance}
              onCheckedChange={(checked) => handleSettingChange("maintenance", checked)}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="payments">Payment Reminders</Label>
            <Switch
              id="payments"
              checked={settings.payments}
              onCheckedChange={(checked) => handleSettingChange("payments", checked)}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="visitors">Visitor Updates</Label>
            <Switch
              id="visitors"
              checked={settings.visitors}
              onCheckedChange={(checked) => handleSettingChange("visitors", checked)}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="events">Event Notifications</Label>
            <Switch
              id="events"
              checked={settings.events}
              onCheckedChange={(checked) => handleSettingChange("events", checked)}
            />
          </div>
        </div>
      </div>

      <Separator />

      {/* Quiet Hours */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium">Quiet Hours</h3>
        <div className="space-y-2">
          <Label htmlFor="quietHours">Do not disturb during</Label>
          <Select value={settings.quietHours} onValueChange={(value) => handleSettingChange("quietHours", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select quiet hours" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">No quiet hours</SelectItem>
              <SelectItem value="22:00-08:00">10:00 PM - 8:00 AM</SelectItem>
              <SelectItem value="23:00-07:00">11:00 PM - 7:00 AM</SelectItem>
              <SelectItem value="00:00-06:00">12:00 AM - 6:00 AM</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Button onClick={saveSettings} className="w-full">
        Save Settings
      </Button>
    </div>
  )
}
