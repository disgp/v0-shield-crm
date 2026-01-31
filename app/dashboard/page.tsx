'use client'

import { AppLayout } from '@/components/app-layout'
import { AppHeader } from '@/components/app-header'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { ArrowUp, ArrowDown, TrendingUp, DollarSign, Target, Percent } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const velocityData = [
  { month: 'Jan', leads: 45 },
  { month: 'Feb', leads: 52 },
  { month: 'Mar', leads: 48 },
  { month: 'Apr', leads: 61 },
  { month: 'May', leads: 55 },
  { month: 'Jun', leads: 67 },
]

const leadSources = [
  { name: 'Google Ads', count: 142, percentage: 35 },
  { name: 'Referrals', count: 98, percentage: 24 },
  { name: 'Organic Search', count: 87, percentage: 22 },
  { name: 'Social Media', count: 56, percentage: 14 },
  { name: 'Other', count: 20, percentage: 5 },
]

const kpis = [
  {
    title: 'Commercial Leads',
    value: '248',
    trend: '+12%',
    isUp: true,
    icon: Target,
    color: 'text-accent',
  },
  {
    title: 'Cost Per Lead',
    value: '$42',
    trend: '-8%',
    isUp: true,
    icon: DollarSign,
    color: 'text-accent',
  },
  {
    title: 'Est. Revenue',
    value: '$847K',
    subtitle: 'Pipeline Value',
    icon: TrendingUp,
    color: 'text-accent',
  },
  {
    title: 'ROI Check',
    value: '5.2x',
    subtitle: 'Ad Spend Return',
    icon: Percent,
    color: 'text-accent',
  },
]

export default function DashboardPage() {
  return (
    <AppLayout>
      <AppHeader title="Dashboard" />
      <div className="p-6">
        <div className="space-y-6">
          {/* Top Row */}
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Account Health Card */}
            <Card>
              <CardHeader>
                <CardTitle>Account Health</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center justify-center py-8">
                <div className="mb-4 text-6xl font-bold text-accent">95%</div>
                <div className="text-xl font-semibold text-muted-foreground">Excellent</div>
                <p className="mt-4 text-center text-sm text-muted-foreground">
                  Your marketing account is performing above industry standards
                </p>
              </CardContent>
            </Card>

            {/* Export Report Widget */}
            <Card>
              <CardHeader>
                <CardTitle>Export Report</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="startDate">Start Date</Label>
                    <input
                      id="startDate"
                      type="date"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="endDate">End Date</Label>
                    <input
                      id="endDate"
                      type="date"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="brief" defaultChecked />
                    <label htmlFor="brief" className="text-sm font-medium">
                      Brief Summary
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="detailed" />
                    <label htmlFor="detailed" className="text-sm font-medium">
                      Detailed Report
                    </label>
                  </div>
                </div>

                <Button className="w-full bg-accent hover:bg-accent/90">Generate Report</Button>
              </CardContent>
            </Card>
          </div>

          {/* Middle Row */}
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Lead Velocity Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Lead Velocity</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={velocityData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="month" className="text-xs" />
                    <YAxis className="text-xs" />
                    <Tooltip />
                    <Line type="monotone" dataKey="leads" stroke="hsl(var(--accent))" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Lead Sources */}
            <Card>
              <CardHeader>
                <CardTitle>Lead Sources</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {leadSources.map((source) => (
                    <div key={source.name} className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium">{source.name}</span>
                        <span className="text-muted-foreground">
                          {source.count} ({source.percentage}%)
                        </span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-muted">
                        <div
                          className="h-full bg-accent"
                          style={{ width: `${source.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Bottom Row - KPI Cards */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {kpis.map((kpi) => (
              <Card key={kpi.title}>
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">{kpi.title}</p>
                      <p className="mt-2 text-3xl font-bold">{kpi.value}</p>
                      {kpi.trend && (
                        <div className="mt-2 flex items-center gap-1 text-sm">
                          {kpi.isUp ? (
                            <ArrowUp className="h-4 w-4 text-green-600" />
                          ) : (
                            <ArrowDown className="h-4 w-4 text-red-600" />
                          )}
                          <span className={kpi.isUp ? 'text-green-600' : 'text-red-600'}>{kpi.trend}</span>
                        </div>
                      )}
                      {kpi.subtitle && (
                        <p className="mt-2 text-xs text-muted-foreground">{kpi.subtitle}</p>
                      )}
                    </div>
                    <kpi.icon className={`h-5 w-5 ${kpi.color}`} />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
