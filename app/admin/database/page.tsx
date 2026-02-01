'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { CheckCircle2, XCircle, Database, Table, Users, Play, RefreshCw, Loader2 } from 'lucide-react'

type ConnectionStatus = {
  success: boolean
  connected: boolean
  tablesExist?: boolean
  message: string
  error?: string
  counts?: Record<string, number>
  samples?: {
    users: any[]
    companies: any[]
    deals: any[]
  }
}

export default function DatabaseAdminPage() {
  const [status, setStatus] = useState<ConnectionStatus | null>(null)
  const [loading, setLoading] = useState(false)
  const [setupLoading, setSetupLoading] = useState(false)
  const [seedLoading, setSeedLoading] = useState(false)

  const checkConnection = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/admin/verify-connection')
      const data = await response.json()
      setStatus(data)
    } catch (error: any) {
      setStatus({
        success: false,
        connected: false,
        message: 'Failed to check connection',
        error: error.message
      })
    } finally {
      setLoading(false)
    }
  }

  const runSetup = async () => {
    setSetupLoading(true)
    try {
      const response = await fetch('/api/admin/setup-database', {
        method: 'POST'
      })
      const data = await response.json()
      
      if (data.success) {
        alert('Database setup completed successfully!')
        checkConnection()
      } else {
        alert(`Setup failed: ${data.error}\n\n${data.details || ''}`)
      }
    } catch (error: any) {
      alert(`Setup failed: ${error.message}`)
    } finally {
      setSetupLoading(false)
    }
  }

  const runSeed = async () => {
    setSeedLoading(true)
    try {
      const response = await fetch('/api/admin/seed-database', {
        method: 'POST'
      })
      const data = await response.json()
      
      if (data.success) {
        alert(`Database seeded successfully!\n\nCreated:\n- ${data.data.users} users\n- ${data.data.companies} companies\n- ${data.data.contacts} contacts\n- ${data.data.deals} deals`)
        checkConnection()
      } else {
        alert(`Seeding failed: ${data.error}\n\n${data.details || ''}`)
      }
    } catch (error: any) {
      alert(`Seeding failed: ${error.message}`)
    } finally {
      setSeedLoading(false)
    }
  }

  useEffect(() => {
    checkConnection()
  }, [])

  const totalRecords = status?.counts 
    ? Object.values(status.counts).reduce((sum, count) => sum + count, 0)
    : 0

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Database Administration</h1>
          <p className="text-muted-foreground">
            Monitor your ShieldCRM database connection and data
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={checkConnection}
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <RefreshCw className="w-4 h-4 mr-2" />
            )}
            Refresh
          </Button>
          <Badge 
            variant={status?.connected ? 'default' : 'destructive'}
            className="text-sm px-4 py-2"
          >
            {status?.connected ? (
              <CheckCircle2 className="w-4 h-4 mr-2" />
            ) : (
              <XCircle className="w-4 h-4 mr-2" />
            )}
            {status?.connected ? 'Connected' : 'Disconnected'}
          </Badge>
        </div>
      </div>

      {!status?.success && status?.error && (
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="text-destructive flex items-center gap-2">
              <XCircle className="w-5 h-5" />
              Connection Error
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">{status.error}</p>
            <div className="p-4 bg-muted rounded-md">
              <p className="text-sm font-medium mb-3">Quick Setup:</p>
              <p className="text-sm text-muted-foreground mb-4">
                Use the buttons below to automatically set up your database and seed it with mock data.
              </p>
              <div className="flex gap-3">
                <Button
                  onClick={runSetup}
                  disabled={setupLoading}
                >
                  {setupLoading ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Play className="w-4 h-4 mr-2" />
                  )}
                  Run Setup
                </Button>
                <Button
                  variant="outline"
                  onClick={runSeed}
                  disabled={seedLoading || !status?.tablesExist}
                >
                  {seedLoading ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Database className="w-4 h-4 mr-2" />
                  )}
                  Seed Data
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {status?.connected && !status?.tablesExist && (
        <Card className="border-yellow-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Tables Not Found
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Connected to Supabase but database tables do not exist. Click the button below to set up your database.
            </p>
            <div className="flex gap-3">
              <Button
                onClick={runSetup}
                disabled={setupLoading}
              >
                {setupLoading ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Play className="w-4 h-4 mr-2" />
                )}
                Run Setup
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {status?.success && (
        <>
          <div className="flex gap-3">
            <Button
              onClick={runSetup}
              disabled={setupLoading}
              variant="outline"
            >
              {setupLoading ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Play className="w-4 h-4 mr-2" />
              )}
              Reset Database
            </Button>
            <Button
              onClick={runSeed}
              disabled={seedLoading}
              variant="outline"
            >
              {seedLoading ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Database className="w-4 h-4 mr-2" />
              )}
              Seed Mock Data
            </Button>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Tables</CardTitle>
                <Database className="w-4 h-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {status.counts ? Object.keys(status.counts).length : 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  Database tables
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Records</CardTitle>
                <Table className="w-4 h-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalRecords.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  Across all tables
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Users</CardTitle>
                <Users className="w-4 h-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {status.counts?.users || 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  System users
                </p>
              </CardContent>
            </Card>
          </div>

          {status.counts && Object.keys(status.counts).length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Table Statistics</CardTitle>
                <CardDescription>Record counts for each table in the database</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  {Object.entries(status.counts)
                    .sort(([, a], [, b]) => b - a)
                    .map(([tableName, count]) => (
                      <div 
                        key={tableName}
                        className="flex items-center justify-between p-3 border rounded-lg"
                      >
                        <span className="font-medium capitalize">
                          {tableName}
                        </span>
                        <Badge variant="secondary">{count}</Badge>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          )}

          {status.samples?.users && status.samples.users.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Sample Users</CardTitle>
                <CardDescription>Recent users in your database</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {status.samples.users.map((user: any) => (
                    <div key={user.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="space-y-1">
                        <p className="font-medium">{user.full_name}</p>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                      </div>
                      <Badge variant={user.is_active ? 'default' : 'secondary'}>
                        {user.role}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {status.samples?.companies && status.samples.companies.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Sample Companies</CardTitle>
                <CardDescription>Recent companies in your database</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {status.samples.companies.map((company: any) => (
                    <div key={company.id} className="flex items-start justify-between p-3 border rounded-lg">
                      <div className="space-y-1">
                        <p className="font-medium">{company.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {company.industry}
                        </p>
                        {company.city && company.state && (
                          <p className="text-sm text-muted-foreground">
                            {company.city}, {company.state}
                          </p>
                        )}
                      </div>
                      {company.website && (
                        <a 
                          href={company.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-primary hover:underline"
                        >
                          Visit
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {status.samples?.deals && status.samples.deals.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Sample Deals</CardTitle>
                <CardDescription>Recent deals in your pipeline</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {status.samples.deals.map((deal: any) => (
                    <div key={deal.id} className="flex items-start justify-between p-3 border rounded-lg">
                      <div className="space-y-1">
                        <p className="font-medium">{deal.title}</p>
                        {deal.description && (
                          <p className="text-sm text-muted-foreground">
                            {deal.description}
                          </p>
                        )}
                        {deal.value && (
                          <p className="text-sm font-semibold text-green-600">
                            ${parseFloat(deal.value).toLocaleString()}
                          </p>
                        )}
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <Badge>{deal.stage}</Badge>
                        <Badge variant="outline">{deal.priority}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  )
}
