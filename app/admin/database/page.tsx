import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CheckCircle2, XCircle, Database, Table, Users } from 'lucide-react'

export default async function DatabaseAdminPage() {
  const supabase = await createClient()
  
  // Test database connection and gather stats
  let connectionStatus = 'disconnected'
  let tables: any[] = []
  let tableCounts: Record<string, number> = {}
  let error: string | null = null

  try {
    // Test basic connection with a simple query
    const { data: testData, error: testError } = await supabase
      .from('profiles')
      .select('count')
      .limit(1)

    if (testError) throw testError
    
    connectionStatus = 'connected'

    // Get table counts
    const tableNames = [
      'profiles',
      'contacts', 
      'properties',
      'jobs',
      'tasks',
      'invoices',
      'estimates',
      'insurance',
      'notes',
      'payments',
      'inspections',
      'material_orders',
      'products',
      'activity_logs'
    ]

    for (const tableName of tableNames) {
      const { count, error: countError } = await supabase
        .from(tableName)
        .select('*', { count: 'exact', head: true })
      
      if (!countError && count !== null) {
        tableCounts[tableName] = count
      }
    }

    // Get sample data from jobs view
    const { data: jobsData, error: jobsError } = await supabase
      .from('jobs')
      .select(`
        *,
        properties (address_line_1, city, state_iso),
        contacts (first_name, last_name, email)
      `)
      .is('deleted_at', null)
      .limit(5)

    if (!jobsError && jobsData) {
      tables = jobsData
    }

  } catch (e: any) {
    console.error('[v0] Database connection error:', e)
    error = e.message
    connectionStatus = 'error'
  }

  const totalRecords = Object.values(tableCounts).reduce((sum, count) => sum + count, 0)

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Database Administration</h1>
          <p className="text-muted-foreground">
            Monitor your ShieldCRM database connection and data
          </p>
        </div>
        <Badge 
          variant={connectionStatus === 'connected' ? 'default' : 'destructive'}
          className="text-sm px-4 py-2"
        >
          {connectionStatus === 'connected' ? (
            <CheckCircle2 className="w-4 h-4 mr-2" />
          ) : (
            <XCircle className="w-4 h-4 mr-2" />
          )}
          {connectionStatus === 'connected' ? 'Connected' : 'Disconnected'}
        </Badge>
      </div>

      {error && (
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="text-destructive flex items-center gap-2">
              <XCircle className="w-5 h-5" />
              Connection Error
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{error}</p>
            <div className="mt-4 p-4 bg-muted rounded-md">
              <p className="text-sm font-medium mb-2">Setup Instructions:</p>
              <ol className="text-sm space-y-2 list-decimal list-inside">
                <li>Make sure Supabase integration is connected</li>
                <li>
                  Run the database setup script in your Supabase SQL Editor:
                  <code className="block mt-1 p-2 bg-background rounded text-xs">
                    /scripts/01-setup-database.sql
                  </code>
                </li>
                <li>
                  Run the seed data script:
                  <code className="block mt-1 p-2 bg-background rounded text-xs">
                    /scripts/02-seed-mock-data.sql
                  </code>
                </li>
                <li>Refresh this page to verify the connection</li>
              </ol>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tables</CardTitle>
            <Database className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Object.keys(tableCounts).length}</div>
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
            <CardTitle className="text-sm font-medium">Active Contacts</CardTitle>
            <Users className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tableCounts['contacts'] || 0}</div>
            <p className="text-xs text-muted-foreground">
              Clients and leads
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Table Statistics</CardTitle>
          <CardDescription>Record counts for each table in the database</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {Object.entries(tableCounts)
              .sort(([, a], [, b]) => b - a)
              .map(([tableName, count]) => (
                <div 
                  key={tableName}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <span className="font-medium capitalize">
                    {tableName.replace(/_/g, ' ')}
                  </span>
                  <Badge variant="secondary">{count}</Badge>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>

      {tables.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Jobs</CardTitle>
            <CardDescription>Sample data from your jobs table</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {tables.map((job: any) => (
                <div key={job.id} className="flex items-start justify-between p-4 border rounded-lg">
                  <div className="space-y-1">
                    <p className="font-medium">{job.name || 'Untitled Job'}</p>
                    <p className="text-sm text-muted-foreground">
                      {job.properties?.address_line_1}, {job.properties?.city}, {job.properties?.state_iso}
                    </p>
                    {job.contacts && (
                      <p className="text-sm text-muted-foreground">
                        {job.contacts.first_name} {job.contacts.last_name}
                      </p>
                    )}
                  </div>
                  <Badge>{job.stage}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Database Scripts</CardTitle>
          <CardDescription>
            SQL scripts for setting up and managing your database
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <h3 className="font-medium">1. Setup Database Schema</h3>
            <p className="text-sm text-muted-foreground">
              Creates all tables, enums, indexes, and RLS policies
            </p>
            <code className="block p-3 bg-muted rounded text-xs">
              /scripts/01-setup-database.sql
            </code>
          </div>

          <div className="space-y-2">
            <h3 className="font-medium">2. Seed Mock Data</h3>
            <p className="text-sm text-muted-foreground">
              Populates the database with realistic test data
            </p>
            <code className="block p-3 bg-muted rounded text-xs">
              /scripts/02-seed-mock-data.sql
            </code>
          </div>

          <div className="space-y-2">
            <h3 className="font-medium">3. Verify Connection</h3>
            <p className="text-sm text-muted-foreground">
              Runs diagnostic queries to verify database setup
            </p>
            <code className="block p-3 bg-muted rounded text-xs">
              /scripts/03-verify-connection.sql
            </code>
          </div>

          <div className="mt-4 p-4 bg-muted rounded-md">
            <p className="text-sm font-medium mb-2">How to run these scripts:</p>
            <ol className="text-sm space-y-2 list-decimal list-inside">
              <li>Open your Supabase project dashboard</li>
              <li>Navigate to the SQL Editor</li>
              <li>Copy and paste each script in order</li>
              <li>Click Run to execute</li>
              <li>Refresh this page to see the results</li>
            </ol>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
