import { AppLayout } from '@/components/app-layout'
import { AppHeader } from '@/components/app-header'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { MapPin, DollarSign, Wrench, Activity, Edit } from 'lucide-react'

const job = {
  id: '1',
  name: 'Full Roof Replacement',
  status: 'In Progress',
  property: {
    address: '1234 Oak Street, Austin, TX 78701',
    type: 'Residential',
    roofArea: '2,450 sq ft',
  },
  financials: {
    totalCost: '$18,500',
    deposit: '$5,000',
    balance: '$13,500',
    paymentStatus: 'Partial',
  },
  production: {
    startDate: '2024-02-15',
    estimatedCompletion: '2024-02-22',
    crewSize: '4',
    supervisor: 'Tom Smith',
  },
  activities: [
    { date: '2024-02-15', action: 'Job started', user: 'Tom Smith' },
    { date: '2024-02-14', action: 'Materials delivered', user: 'Sarah Johnson' },
    { date: '2024-02-10', action: 'Deposit received', user: 'John Doe' },
    { date: '2024-02-08', action: 'Contract signed', user: 'Michael Johnson' },
  ],
}

export default function JobDetailPage() {
  return (
    <AppLayout>
      <AppHeader
        title="Job Details"
        action={
          <Button>
            <Edit className="mr-2 h-4 w-4" />
            Edit Job
          </Button>
        }
      />
      <div className="p-6">
        <div className="mx-auto max-w-4xl space-y-6">
          {/* Job Header */}
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle>{job.name}</CardTitle>
                  <p className="mt-1 text-sm text-muted-foreground">Job #{job.id}</p>
                </div>
                <Badge>{job.status}</Badge>
              </div>
            </CardHeader>
          </Card>

          {/* Property Specs */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Property Specifications
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground">Address</p>
                  <p className="font-medium">{job.property.address}</p>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <p className="text-sm text-muted-foreground">Property Type</p>
                    <Badge variant="secondary">{job.property.type}</Badge>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Roof Area</p>
                    <p className="font-medium">{job.property.roofArea}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Financials */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Financials
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-sm text-muted-foreground">Total Cost</p>
                  <p className="text-xl font-bold">{job.financials.totalCost}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Payment Status</p>
                  <Badge variant="secondary">{job.financials.paymentStatus}</Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Deposit Paid</p>
                  <p className="font-medium">{job.financials.deposit}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Balance Due</p>
                  <p className="font-medium">{job.financials.balance}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Production Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wrench className="h-5 w-5" />
                Production Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-sm text-muted-foreground">Start Date</p>
                  <p className="font-medium">{job.production.startDate}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Est. Completion</p>
                  <p className="font-medium">{job.production.estimatedCompletion}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Crew Size</p>
                  <p className="font-medium">{job.production.crewSize} workers</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Supervisor</p>
                  <p className="font-medium">{job.production.supervisor}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Activity Log */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Activity Log
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {job.activities.map((activity, index) => (
                  <div key={index} className="flex gap-4 border-b border-border pb-4 last:border-0 last:pb-0">
                    <div className="shrink-0 text-sm text-muted-foreground">{activity.date}</div>
                    <div className="flex-1">
                      <p className="font-medium">{activity.action}</p>
                      <p className="text-sm text-muted-foreground">by {activity.user}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  )
}
