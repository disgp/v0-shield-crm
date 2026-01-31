'use client'

import { AppLayout } from '@/components/app-layout'
import { AppHeader } from '@/components/app-header'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Mail, Trash2 } from 'lucide-react'
import { signOut } from '@/lib/supabase/auth'

const teamMembers = [
  { id: '1', email: 'jane.smith@company.com', name: 'Jane Smith', role: 'Admin' },
  { id: '2', email: 'bob.wilson@company.com', name: 'Bob Wilson', role: 'Sales Rep' },
  { id: '3', email: 'alice.brown@company.com', name: 'Alice Brown', role: 'Project Manager' },
]

export default function SettingsPage() {
  const router = useRouter()
  const [darkMode, setDarkMode] = useState(false)
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [smsNotifications, setSmsNotifications] = useState(false)

  const handleSignOut = async () => {
    try {
      await signOut()
      router.push('/login')
    } catch (error) {
      console.error('[v0] Failed to sign out:', error)
    }
  }

  return (
    <AppLayout>
      <AppHeader title="Account Settings" />
      <div className="p-6">
        <div className="mx-auto max-w-4xl space-y-6">
          {/* General Section */}
          <Card>
            <CardHeader>
              <CardTitle>General</CardTitle>
              <CardDescription>Update your account information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input id="firstName" placeholder="John" defaultValue="John" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input id="lastName" placeholder="Doe" defaultValue="Doe" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" type="email" placeholder="john@example.com" defaultValue="john.doe@company.com" />
              </div>
            </CardContent>
          </Card>

          {/* Appearance Section */}
          <Card>
            <CardHeader>
              <CardTitle>Appearance</CardTitle>
              <CardDescription>Customize how ShieldCRM looks for you</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="darkMode">Dark Mode</Label>
                  <p className="text-sm text-muted-foreground">Enable dark mode for a more comfortable viewing experience</p>
                </div>
                <Switch id="darkMode" checked={darkMode} onCheckedChange={setDarkMode} />
              </div>
              {darkMode && (
                <Card className="border-accent/50 bg-accent/10">
                  <CardContent className="pt-6">
                    <p className="text-sm text-muted-foreground">
                      Dark mode is currently in preview. Some elements may not be fully optimized.
                    </p>
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>

          {/* Notifications Section */}
          <Card>
            <CardHeader>
              <CardTitle>Notifications</CardTitle>
              <CardDescription>Manage how you receive notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="emailNotif">Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">Receive notifications about updates and activities</p>
                </div>
                <Switch id="emailNotif" checked={emailNotifications} onCheckedChange={setEmailNotifications} />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="smsNotif">SMS Notifications</Label>
                  <p className="text-sm text-muted-foreground">Get text messages for urgent updates</p>
                </div>
                <Switch id="smsNotif" checked={smsNotifications} onCheckedChange={setSmsNotifications} />
              </div>
            </CardContent>
          </Card>

          {/* User Management Section */}
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
              <CardDescription>Invite team members and manage access</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex gap-2">
                <Input placeholder="email@example.com" type="email" className="flex-1" />
                <Button>Invite User</Button>
              </div>

              <div>
                <h4 className="mb-3 text-sm font-semibold">Team Members</h4>
                <div className="space-y-2">
                  {teamMembers.map((member) => (
                    <div
                      key={member.id}
                      className="flex items-center justify-between rounded-lg border border-border p-3"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                          {member.name
                            .split(' ')
                            .map((n) => n[0])
                            .join('')}
                        </div>
                        <div>
                          <p className="text-sm font-medium">{member.name}</p>
                          <p className="text-xs text-muted-foreground">{member.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-muted-foreground">{member.role}</span>
                        <Button variant="ghost" size="icon">
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Account Section */}
          <Card>
            <CardHeader>
              <CardTitle>Account</CardTitle>
              <CardDescription>Manage your account settings</CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                variant="outline" 
                onClick={handleSignOut}
                className="border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground bg-transparent"
              >
                Sign Out
              </Button>
            </CardContent>
          </Card>

          {/* Footer */}
          <div className="sticky bottom-0 flex justify-end border-t border-border bg-background py-4">
            <Button size="lg" className="min-w-[200px]">
              Save Changes
            </Button>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
